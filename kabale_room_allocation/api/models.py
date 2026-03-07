from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

# Custom User Manager for FacultyAdmins
class FacultyAdminManager(BaseUserManager):
    def create_user(self, email, full_name, faculty_id, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, faculty_id=faculty_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, full_name, faculty_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_primary_admin', True)
        return self.create_user(email, full_name, faculty_id, password, **extra_fields)

# 1. FACULTIES
class Faculty(models.Model):
    faculty_id = models.CharField(max_length=10, primary_key=True)
    faculty_name = models.CharField(max_length=100)
    faculty_code = models.CharField(max_length=10, unique=True)
    
    class Meta:
        db_table = 'Faculties'
    
    def __str__(self):
        return f"{self.faculty_code} - {self.faculty_name}"

# 2. DEPARTMENTS
class Department(models.Model):
    dept_id = models.CharField(max_length=10, primary_key=True)
    dept_name = models.CharField(max_length=100)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, db_column='faculty_id')
    
    class Meta:
        db_table = 'Departments'
    
    def __str__(self):
        return self.dept_name

# 3. SEMESTERS
class Semester(models.Model):
    semester_id = models.CharField(max_length=10, primary_key=True)
    semester_name = models.CharField(max_length=50)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'Semesters'
    
    def __str__(self):
        return self.semester_name

# 4. STUDENT GROUPS
class StudentGroup(models.Model):
    STUDY_MODE_CHOICES = [
        ('FT', 'Full Time'),
        ('WK', 'Weekend/Evening'),
    ]
    
    group_id = models.CharField(max_length=10, primary_key=True)
    group_code = models.CharField(max_length=20)
    study_mode = models.CharField(max_length=2, choices=STUDY_MODE_CHOICES)
    approx_size = models.IntegerField()
    department = models.ForeignKey(Department, on_delete=models.CASCADE, db_column='dept_id')
    
    class Meta:
        db_table = 'StudentGroups'
    
    def __str__(self):
        return self.group_code

# 5. LECTURERS
class Lecturer(models.Model):
    lecturer_id = models.CharField(max_length=10, primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, db_column='dept_id')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Lecturers'
    
    def __str__(self):
        return self.full_name

# 6. COURSES
class Course(models.Model):
    course_code = models.CharField(max_length=20, primary_key=True)
    course_name = models.CharField(max_length=100, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, db_column='dept_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Courses'
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"

# 7. ROOMS
class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('Lecture Room', 'Lecture Room'),
        ('Laboratory', 'Laboratory'),
        ('Seminar Hall', 'Seminar Hall'),
        ('Auditorium', 'Auditorium'),
    ]
    
    room_id = models.CharField(max_length=20, primary_key=True)
    building_name = models.CharField(max_length=50, blank=True)
    capacity = models.IntegerField()
    room_type = models.CharField(max_length=30, choices=ROOM_TYPE_CHOICES, default='Lecture Room')
    owner_faculty = models.ForeignKey(Faculty, on_delete=models.SET_NULL, null=True, db_column='owner_faculty_id')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Rooms'
    
    def __str__(self):
        return f"{self.room_id} ({self.capacity} seats)"

# 8. ROOM FEATURES - FIXED for string IDs
class RoomFeature(models.Model):
    feature_id = models.CharField(max_length=20, primary_key=True)  # Changed from AutoField to CharField
    room = models.ForeignKey(Room, on_delete=models.CASCADE, db_column='room_id')
    feature_name = models.CharField(max_length=50)
    feature_value = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'RoomFeatures'
    
    def __str__(self):
        return f"{self.room_id} - {self.feature_name}: {self.feature_value}"

# 9. FACULTY ADMINS (Custom User Model)
class FacultyAdmin(AbstractBaseUser, PermissionsMixin):
    admin_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, db_column='faculty_id')
    job_title = models.CharField(max_length=100, default='Faculty Administrator')
    is_primary_admin = models.BooleanField(default=False)
    
    # Permissions
    can_manage_courses = models.BooleanField(default=True)
    can_manage_lecturers = models.BooleanField(default=True)
    can_manage_rooms = models.BooleanField(default=True)
    can_manage_allocations = models.BooleanField(default=True)
    can_manage_coordinators = models.BooleanField(default=True)
    can_view_reports = models.BooleanField(default=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    
    objects = FacultyAdminManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'faculty_id']
    
    class Meta:
        db_table = 'FacultyAdmins'
    
    def __str__(self):
        return f"{self.full_name} ({self.email})"
    
    def has_perm(self, perm, obj=None):
        return True
    
    def has_module_perms(self, app_label):
        return True

# 10. CLASS COORDINATORS
class ClassCoordinator(models.Model):
    coordinator_id = models.AutoField(primary_key=True)
    student_name = models.CharField(max_length=100)
    student_email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    student_id = models.CharField(max_length=20, unique=True)
    programme = models.CharField(max_length=100, blank=True)
    year_of_study = models.IntegerField(null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, db_column='dept_id')
    group_ids_managed = models.TextField(blank=True, help_text="Comma-separated group IDs")
    date_appointed = models.DateField()
    appointed_by_admin = models.ForeignKey(FacultyAdmin, on_delete=models.CASCADE, db_column='appointed_by_admin_id')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'ClassCoordinators'
    
    def __str__(self):
        return f"{self.student_name} ({self.student_id})"

# 11. LECTURE SESSIONS - WITH INDEXES
class LectureSession(models.Model):
    TEACHING_MODE_CHOICES = [
        ('Physical', 'Physical'),
        ('Online', 'Online'),
    ]
    
    session_id = models.CharField(max_length=20, primary_key=True)
    primary_course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE, 
        db_column='primary_course_code', 
        null=True
    )
    cross_listed_codes = models.CharField(max_length=100, blank=True)
    semester = models.ForeignKey(
        Semester, 
        on_delete=models.CASCADE, 
        db_column='semester_id', 
        null=True
    )
    lecturer = models.ForeignKey(
        Lecturer, 
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='lecturer_id'
    )
    duration_minutes = models.IntegerField(default=60)
    teaching_mode = models.CharField(
        max_length=10, 
        choices=TEACHING_MODE_CHOICES, 
        default='Physical'
    )
    
    class Meta:
        db_table = 'LectureSessions'
        indexes = [
            models.Index(fields=['session_id']),  # Add index on session_id
        ]
    
    def __str__(self):
        return f"Session {self.session_id}: {self.primary_course}"

# 12. SESSION GROUPS - FIXED
class SessionGroup(models.Model):
    session = models.ForeignKey(LectureSession, on_delete=models.CASCADE, db_column='session_id')
    group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE, db_column='group_id')
    
    class Meta:
        db_table = 'SessionGroups'
        unique_together = ('session', 'group')
    
    def __str__(self):
        return f"Session {self.session_id} - Group {self.group_id}"

# 13. ALLOCATIONS - WITH INDEXES
class Allocation(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]
    
    RECURRENCE_CHOICES = [
        ('weekly', 'Weekly'),
        ('bi-weekly', 'Bi-Weekly'),
        ('one-time', 'One Time'),
    ]
    
    allocation_id = models.CharField(max_length=20, primary_key=True)
    session = models.ForeignKey(LectureSession, on_delete=models.CASCADE, db_column='session_id')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, db_column='room_id')
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    buffer_start_time = models.TimeField(editable=False)
    recurrence_pattern = models.CharField(max_length=10, choices=RECURRENCE_CHOICES, default='weekly')
    
    class Meta:
        db_table = 'Allocations'
        unique_together = ('session', 'day_of_week', 'start_time')
        indexes = [
            models.Index(fields=['session_id']),  # Add index on foreign key
            models.Index(fields=['room_id']),
            models.Index(fields=['day_of_week']),
        ]
    
    def save(self, *args, **kwargs):
        from datetime import datetime, timedelta
        if self.start_time:
            start_dt = datetime.combine(datetime.today(), self.start_time)
            buffer_dt = start_dt - timedelta(minutes=30)
            self.buffer_start_time = buffer_dt.time()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Allocation {self.allocation_id}: {self.room_id} on {self.day_of_week} at {self.start_time}"

# 14. COORDINATOR GROUPS
class CoordinatorGroup(models.Model):
    coordinator = models.ForeignKey(ClassCoordinator, on_delete=models.CASCADE, db_column='coordinator_id')
    group = models.ForeignKey(StudentGroup, on_delete=models.CASCADE, db_column='group_id')
    assigned_date = models.DateField(auto_now_add=True)
    appointed_by_admin = models.ForeignKey(FacultyAdmin, on_delete=models.CASCADE, db_column='appointed_by_admin_id')
    
    class Meta:
        db_table = 'CoordinatorGroups'
        unique_together = ('coordinator', 'group')
    
    def __str__(self):
        return f"Coordinator {self.coordinator_id} - Group {self.group_id}"