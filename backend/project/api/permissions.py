from rest_framework.permissions import BasePermission
from .models import User


class IsAdminAuthenticated(BasePermission):

    def has_permission(self, request, view):
        # Vérifie si l'utilisateur est authentifié et est une instance du modèle User personnalisé.

        return bool(
            request.user and
            request.user.is_authenticated and
            isinstance(request.user, User) and  # Vérifie que l'utilisateur est une instance de ton modèle User.
            request.user.is_superuser
        )


class IsStaffAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and isinstance(request.user, User) and request.user.is_staff)

