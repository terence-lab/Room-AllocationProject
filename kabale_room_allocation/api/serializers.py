from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

# Auth Serializer for Login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), 
                              email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
        else:
            raise serializers.ValidationError('Must include "email" and "password"')

        data['user'] = user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyAdmin
        fields = ['admin_id', 'full_name', 'email', 'faculty_id', 'job_title', 
                 'is_primary_admin', 'permissions']
    
    permissions = serializers.SerializerMethodField()
    
    def get_permissions(self, obj):
        return {
            'can_manage_courses': obj.can_manage_courses,
            'can_manage_lecturers': obj.can_manage_lecturers,
            'can_manage_rooms': obj.can_manage_rooms,
            'can_manage_allocations': obj.can_manage_allocations,
            'can_manage_coordinators': obj.can_manage_coordinators,
            'can_view_reports': obj.can_view_reports,
        }

# Faculty Serializer
class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'

# Department Serializer
class DepartmentSerializer(serializers.ModelSerializer):
    faculty_name = serializers.ReadOnlyField(source='faculty.faculty_name')
    
    class Meta:
        model = Department
        fields = ['dept_id', 'dept_name', 'faculty_id', 'faculty_name']

# Semester Serializer
class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = '__all__'

# StudentGroup Serializer
class StudentGroupSerializer(serializers.ModelSerializer):
    dept_name = serializers.ReadOnlyField(source='department.dept_name')
    dept_id = serializers.ReadOnlyField(source='department.dept_id')
    
    class Meta:
        model = StudentGroup
        fields = ['group_id', 'group_code', 'study_mode', 'approx_size', 
                 'dept_id', 'dept_name']

# Lecturer Serializer - FIXED
class LecturerSerializer(serializers.ModelSerializer):
    dept_name = serializers.ReadOnlyField(source='department.dept_name')
    dept_id = serializers.ReadOnlyField(source='department.dept_id')  
    
    class Meta:
        model = Lecturer
        fields = ['lecturer_id', 'full_name', 'email', 'phone_number', 
                 'dept_id', 'dept_name', 'is_active', 'created_at', 'updated_at']

# Course Serializer - 
class CourseSerializer(serializers.ModelSerializer):
    dept_name = serializers.ReadOnlyField(source='department.dept_name')
    dept_id = serializers.ReadOnlyField(source='department.dept_id') 
    
    class Meta:
        model = Course
        fields = ['course_code', 'course_name', 'dept_id', 'dept_name', 
                 'created_at', 'updated_at']
        
# Room Feature Serializer
class RoomFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomFeature
        fields = ['feature_id', 'room_id', 'feature_name', 'feature_value']

# Room Serializer
class RoomSerializer(serializers.ModelSerializer):
    features = RoomFeatureSerializer(many=True, read_only=True, source='roomfeature_set')
    owner_faculty_name = serializers.ReadOnlyField(source='owner_faculty.faculty_name')
    
    class Meta:
        model = Room
        fields = ['room_id', 'building_name', 'capacity', 'room_type', 
                 'owner_faculty_id', 'owner_faculty_name', 'features', 
                 'created_at', 'updated_at']

# ClassCoordinator Serializer
class ClassCoordinatorSerializer(serializers.ModelSerializer):
    dept_name = serializers.ReadOnlyField(source='department.dept_name')
    dept_id = serializers.ReadOnlyField(source='department.dept_id')
    appointed_by_name = serializers.ReadOnlyField(source='appointed_by_admin.full_name')
    
    class Meta:
        model = ClassCoordinator
        fields = ['coordinator_id', 'student_name', 'student_email', 'phone_number',
                 'student_id', 'programme', 'year_of_study', 'dept_id', 'dept_name',
                 'group_ids_managed', 'date_appointed', 'appointed_by_admin_id',
                 'appointed_by_name', 'is_active']

# LectureSession Serializer - COMPLETELY SAFE
class LectureSessionSerializer(serializers.ModelSerializer):
    course_name = serializers.SerializerMethodField()
    lecturer_name = serializers.SerializerMethodField()
    semester_name = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    
    class Meta:
        model = LectureSession
        fields = ['session_id', 'primary_course_id', 'course_name', 
                 'cross_listed_codes', 'semester_id', 'semester_name',
                 'lecturer_id', 'lecturer_name', 'duration_minutes', 
                 'teaching_mode', 'groups']
    
    def get_course_name(self, obj):
        try:
            if obj.primary_course:
                return obj.primary_course.course_name
        except:
            pass
        return None
    
    def get_lecturer_name(self, obj):
        try:
            if obj.lecturer:
                return obj.lecturer.full_name
        except:
            pass
        return None
    
    def get_semester_name(self, obj):
        try:
            if obj.semester:
                return obj.semester.semester_name
        except:
            pass
        return None
    
    def get_groups(self, obj):
        try:
            session_groups = SessionGroup.objects.filter(session=obj)
            return [{'group_id': sg.group_id, 'group_code': sg.group.group_code} 
                    for sg in session_groups]
        except:
            return []

# Allocation Serializer - COMPLETELY SAFE
class AllocationSerializer(serializers.ModelSerializer):
    room_name = serializers.SerializerMethodField()
    session_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Allocation
        fields = ['allocation_id', 'session_id', 'session_info', 'room_id', 
                 'room_name', 'day_of_week', 'start_time', 'end_time', 
                 'buffer_start_time', 'recurrence_pattern']
    
    def get_room_name(self, obj):
        try:
            if obj.room:
                return obj.room.room_id
        except:
            pass
        return None
    
    def get_session_info(self, obj):
        try:
            if not obj.session:
                return None
            
            # Safely get all related data with try/except for each
            lecturer_name = None
            try:
                if obj.session.lecturer:
                    lecturer_name = obj.session.lecturer.full_name
            except:
                pass
            
            course_name = None
            try:
                if obj.session.primary_course:
                    course_name = obj.session.primary_course.course_name
            except:
                pass
            
            return {
                'session_id': obj.session.session_id,
                'course_code': obj.session.primary_course_id,
                'course_name': course_name,
                'lecturer_id': obj.session.lecturer_id,
                'lecturer_name': lecturer_name,
                'duration': obj.session.duration_minutes
            }
        except Exception as e:
            # If anything fails, return basic info
            return {
                'session_id': obj.session_id,
                'error': 'Could not load full session details'
            }


# CoordinatorGroup Serializer
class CoordinatorGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoordinatorGroup
        fields = '__all__'