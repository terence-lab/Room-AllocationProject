from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import *
from .serializers import *
from .permissions import *

# Custom Login View
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'faculty_id'

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'dept_id'
    
    def get_queryset(self):
        queryset = Department.objects.all()
        faculty_id = self.request.query_params.get('faculty_id', None)
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)
        return queryset

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'semester_id'
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        active_semester = Semester.objects.filter(is_active=True).first()
        if active_semester:
            serializer = self.get_serializer(active_semester)
            return Response(serializer.data)
        return Response({'detail': 'No active semester found'}, status=404)

class StudentGroupViewSet(viewsets.ModelViewSet):
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'group_id'
    
    def get_queryset(self):
        queryset = StudentGroup.objects.all()
        dept_id = self.request.query_params.get('dept_id', None)
        study_mode = self.request.query_params.get('study_mode', None)
        
        if dept_id:
            queryset = queryset.filter(dept_id=dept_id)
        if study_mode:
            queryset = queryset.filter(study_mode=study_mode)
        return queryset

class LecturerViewSet(viewsets.ModelViewSet):
    queryset = Lecturer.objects.all()
    serializer_class = LecturerSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'lecturer_id'
    
    def get_queryset(self):
        queryset = Lecturer.objects.all()
        dept_id = self.request.query_params.get('dept_id', None)
        active_only = self.request.query_params.get('active_only', False)
        
        if dept_id:
            queryset = queryset.filter(dept_id=dept_id)
        if active_only:
            queryset = queryset.filter(is_active=True)
        return queryset
    
    @action(detail=True, methods=['get'])
    def sessions(self, request, lecturer_id=None):
        lecturer = self.get_object()
        sessions = LectureSession.objects.filter(lecturer=lecturer)
        serializer = LectureSessionSerializer(sessions, many=True)
        return Response(serializer.data)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'course_code'
    
    def get_queryset(self):
        queryset = Course.objects.all()
        dept_id = self.request.query_params.get('dept_id', None)
        search = self.request.query_params.get('search', None)
        
        if dept_id:
            queryset = queryset.filter(dept_id=dept_id)
        if search:
            queryset = queryset.filter(
                models.Q(course_code__icontains=search) |
                models.Q(course_name__icontains=search)
            )
        return queryset

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'room_id'
    
    def get_queryset(self):
        queryset = Room.objects.all()
        faculty_id = self.request.query_params.get('faculty_id', None)
        room_type = self.request.query_params.get('room_type', None)
        min_capacity = self.request.query_params.get('min_capacity', None)
        
        if faculty_id:
            queryset = queryset.filter(owner_faculty_id=faculty_id)
        if room_type:
            queryset = queryset.filter(room_type=room_type)
        if min_capacity:
            queryset = queryset.filter(capacity__gte=min_capacity)
        return queryset
    
    @action(detail=True, methods=['get'])
    def allocations(self, request, room_id=None):
        room = self.get_object()
        allocations = Allocation.objects.filter(room=room)
        serializer = AllocationSerializer(allocations, many=True)
        return Response(serializer.data)

class RoomFeatureViewSet(viewsets.ModelViewSet):
    queryset = RoomFeature.objects.all()
    serializer_class = RoomFeatureSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = RoomFeature.objects.all()
        room_id = self.request.query_params.get('room_id', None)
        if room_id:
            queryset = queryset.filter(room_id=room_id)
        return queryset

class ClassCoordinatorViewSet(viewsets.ModelViewSet):
    queryset = ClassCoordinator.objects.all()
    serializer_class = ClassCoordinatorSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = ClassCoordinator.objects.all()
        dept_id = self.request.query_params.get('dept_id', None)
        active_only = self.request.query_params.get('active_only', False)
        
        if dept_id:
            queryset = queryset.filter(dept_id=dept_id)
        if active_only:
            queryset = queryset.filter(is_active=True)
        return queryset
    
    @action(detail=True, methods=['get'])
    def groups(self, request, pk=None):
        coordinator = self.get_object()
        coordinator_groups = CoordinatorGroup.objects.filter(coordinator=coordinator)
        groups = [cg.group for cg in coordinator_groups]
        serializer = StudentGroupSerializer(groups, many=True)
        return Response(serializer.data)

class LectureSessionViewSet(viewsets.ModelViewSet):
    queryset = LectureSession.objects.all()
    serializer_class = LectureSessionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = LectureSession.objects.all()
        semester_id = self.request.query_params.get('semester_id', None)
        lecturer_id = self.request.query_params.get('lecturer_id', None)
        course_code = self.request.query_params.get('course_code', None)
        
        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)
        if lecturer_id:
            queryset = queryset.filter(lecturer_id=lecturer_id)
        if course_code:
            queryset = queryset.filter(primary_course_id=course_code)
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_group(self, request, pk=None):
        session = self.get_object()
        group_id = request.data.get('group_id')
        
        try:
            group = StudentGroup.objects.get(group_id=group_id)
            session_group, created = SessionGroup.objects.get_or_create(
                session=session, group=group
            )
            if created:
                return Response({'status': 'group added'}, status=201)
            return Response({'status': 'group already exists'})
        except StudentGroup.DoesNotExist:
            return Response({'error': 'Group not found'}, status=404)
    
    @action(detail=True, methods=['delete'])
    def remove_group(self, request, pk=None):
        session = self.get_object()
        group_id = request.data.get('group_id')
        
        try:
            session_group = SessionGroup.objects.get(session=session, group_id=group_id)
            session_group.delete()
            return Response({'status': 'group removed'})
        except SessionGroup.DoesNotExist:
            return Response({'error': 'Group not found in session'}, status=404)

class AllocationViewSet(viewsets.ModelViewSet):
    queryset = Allocation.objects.all()
    serializer_class = AllocationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        try:
            queryset = Allocation.objects.all()
            room_id = self.request.query_params.get('room_id', None)
            day = self.request.query_params.get('day', None)
            session_id = self.request.query_params.get('session_id', None)
            
            if room_id:
                queryset = queryset.filter(room_id=room_id)
            if day:
                queryset = queryset.filter(day_of_week=day)
            if session_id:
                queryset = queryset.filter(session_id=session_id)
            return queryset
        except Exception:
            # Return empty queryset if there's an error
            return Allocation.objects.none()
    
    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            # If anything fails, return empty list
            return Response([])
    
    @action(detail=False, methods=['get'])
    def timetable(self, request):
        try:
            room_id = request.query_params.get('room_id')
            day = request.query_params.get('day')
            
            if not room_id or not day:
                return Response({'error': 'room_id and day are required'}, status=400)
            
            allocations = Allocation.objects.filter(room_id=room_id, day_of_week=day)
            serializer = self.get_serializer(allocations, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e), 'allocations': []}, status=200)

class CoordinatorGroupViewSet(viewsets.ModelViewSet):
    queryset = CoordinatorGroup.objects.all()
    serializer_class = CoordinatorGroupSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = CoordinatorGroup.objects.all()
        coordinator_id = self.request.query_params.get('coordinator_id', None)
        group_id = self.request.query_params.get('group_id', None)
        
        if coordinator_id:
            queryset = queryset.filter(coordinator_id=coordinator_id)
        if group_id:
            queryset = queryset.filter(group_id=group_id)
        return queryset