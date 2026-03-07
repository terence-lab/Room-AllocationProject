from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView 
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Kabale University Room Allocation API",
        default_version='v1',
        description="API for managing room allocations at Kabale University",
        contact=openapi.Contact(email="admin@kabaleuniversity.ac.ug"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/kabale/', include('api.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Swagger documentation URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]