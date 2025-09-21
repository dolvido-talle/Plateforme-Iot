from django.urls import path, re_path, include
from rest_framework.routers import DefaultRouter
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api.views import CustomTokenObtainPairView, CustomTokenRefreshView, logout
from rest_framework.routers import DefaultRouter
from .api.views import UserViewSet, AdminUserViewSet, DeviceDataListView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .api.views import RequestPasswordResetView, ConfirmPasswordResetView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')
router.register(r'devices', DeviceDataListView, basename='device-data')

# Définition du schéma Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="Plateforme IoT API",
        default_version="v1",
        description="Documentation de l'API pour la plateforme IoT",
        terms_of_service="https://www.3il-ingenieurs.fr/",
        contact=openapi.Contact(email="talletou@3il.fr"),
        license=openapi.License(name="MIT License"),
    ),
    public=False,  # Accessible publiquement
    permission_classes=(AllowAny,),  # Swagger  accessible sans authentification
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", logout, name="logout"),
    path('api/reset-password/', RequestPasswordResetView.as_view(), name='reset-password'),
    path('api/confirm-password/', ConfirmPasswordResetView.as_view(), name='confirm-password'),

    # Documentation Swagger UI
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    # Documentation Redoc (alternative à Swagger)
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/', include(router.urls)),
]
