from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'faculties', FacultyViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'semesters', SemesterViewSet)
router.register(r'student-groups', StudentGroupViewSet)
router.register(r'lecturers', LecturerViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'room-features', RoomFeatureViewSet)
router.register(r'class-coordinators', ClassCoordinatorViewSet)
router.register(r'lecture-sessions', LectureSessionViewSet)
router.register(r'allocations', AllocationViewSet)
router.register(r'coordinator-groups', CoordinatorGroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='login'),
]