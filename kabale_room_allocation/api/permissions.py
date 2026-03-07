from rest_framework import permissions

class IsFacultyAdmin(permissions.BasePermission):
    """
    Allows access only to faculty admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

class HasCoursePermission(permissions.BasePermission):
    """
    Check if user has permission to manage courses.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.can_view_reports
        else:
            return request.user.can_manage_courses

class HasLecturerPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.can_view_reports
        else:
            return request.user.can_manage_lecturers

class HasRoomPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.can_view_reports
        else:
            return request.user.can_manage_rooms

class HasAllocationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.can_view_reports
        else:
            return request.user.can_manage_allocations

class HasCoordinatorPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if request.user.is_superuser:
            return True
        
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.can_view_reports
        else:
            return request.user.can_manage_coordinators