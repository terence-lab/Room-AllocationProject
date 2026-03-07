from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *

class FacultyAdminAdmin(UserAdmin):
    list_display = ('email', 'full_name', 'faculty', 'is_primary_admin', 'is_active')
    list_filter = ('faculty', 'is_primary_admin', 'is_active')
    search_fields = ('email', 'full_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number', 'faculty', 'job_title')}),
        ('Permissions', {'fields': (
            'is_primary_admin', 'is_active', 'is_staff', 'is_superuser',
            'can_manage_courses', 'can_manage_lecturers', 'can_manage_rooms',
            'can_manage_allocations', 'can_manage_coordinators', 'can_view_reports'
        )}),
        ('Important dates', {'fields': ('last_login', 'created_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'faculty_id', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('created_at', 'last_login')

# Register all models
admin.site.register(Faculty)
admin.site.register(Department)
admin.site.register(Semester)
admin.site.register(StudentGroup)
admin.site.register(Lecturer)
admin.site.register(Course)
admin.site.register(Room)
admin.site.register(RoomFeature)
admin.site.register(FacultyAdmin, FacultyAdminAdmin)
admin.site.register(ClassCoordinator)
admin.site.register(LectureSession)
admin.site.register(SessionGroup)
admin.site.register(Allocation)
admin.site.register(CoordinatorGroup)