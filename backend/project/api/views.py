from rest_framework import viewsets
from .models import User, DeviceData
from .serializers import UserSerializer, AdminSerializer, DeviceDataSerializer
from .permissions import IsAdminAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from http import HTTPStatus
from django.core.mail import send_mail
import datetime
from rest_framework.views import APIView
from .models import PasswordResetCode
import random
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from django.conf import settings


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return User.objects.all()


class AdminUserViewSet(viewsets.ModelViewSet):
    serializer_class = AdminSerializer
    permission_classes = [IsAdminAuthenticated]

    def get_queryset(self):
        return User.objects.all()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Permet de Génèrer un access token et un refresh token, puis les stocke dans des cookies"""

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        tokens = response.data

        if "access" in tokens and "refresh" in tokens:
            res = Response()
            res.data = {"success": True}

            # Déterminer secure et samesite en fonction du mode DEBUG
            secure_flag = not settings.DEBUG  # True en production, False en développement
            samesite_value = "None" if secure_flag else "Lax"

            # Stockage des tokens dans des cookies sécurisés
            res.set_cookie(
                key="access_token",
                value=tokens["access"],
                httponly=True,
                secure=secure_flag,
                samesite=samesite_value,
                path="/",
            )

            res.set_cookie(
                key="refresh_token",
                value=tokens["refresh"],
                httponly=True,
                secure=secure_flag,
                samesite=samesite_value,
                path="/",
            )

            res.data.update(tokens)
            return res

        return Response({"success": False}, status=HTTPStatus.BAD_REQUEST)


class CustomTokenRefreshView(TokenRefreshView):
    """ Rafraîchit l'access token en utilisant le refresh token stocké dans les cookies. """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"error": "No refresh token found"}, HTTPStatus.UNAUTHORIZED)

        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        if "access" in response.data:
            res = Response()
            res.data = {"refreshed": True}

            secure_flag = not settings.DEBUG
            samesite_value = "None" if secure_flag else "Lax"

            # Mise à jour du cookie avec le nouveau token d'accès
            res.set_cookie(
                key="access_token",
                value=response.data["access"],
                httponly=True,
                secure=secure_flag,
                samesite=samesite_value,
                path="/",
            )
            return res

        return Response({"refreshed": False}, status=HTTPStatus.BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """ Supprime les cookies contenant les tokens pour déconnecter l'utilisateur. """
    try:
        res = Response()
        res.data = {"deconnexion": True}
        res.delete_cookie("access_token", path="/", samesite="None")
        res.delete_cookie("refresh_token", path="/", samesite="None")
        return res
    except Exception as e:
        print(e)
        return Response({"deconnexion": False}, status=HTTPStatus.INTERNAL_SERVER_ERROR)


class DeviceDataListView(viewsets.ModelViewSet):
    serializer_class = DeviceDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            queryset = DeviceData.objects.all()
        else:
            queryset = DeviceData.objects.filter(user=user)
        print(f"QuerySet trouvé: {queryset}")
        print(f"Admin trouvé: {user.is_superuser}")
        return queryset



    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            self.headers = {}
            response = Response({"detail": "Veuillez vous authentifier svp"}, status=HTTPStatus.UNAUTHORIZED)
            return self.finalize_response(request, response, *args, **kwargs)
        return super().dispatch(request, *args, **kwargs)
    """


reset_codes = {}


class RequestPasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur introuvable."}, status=HTTPStatus.NOT_FOUND)

        code = f"{random.randint(100000, 999999)}"
        reset_codes[email] = {
            "code": code,
            "expires_at": datetime.datetime.now() + datetime.timedelta(minutes=5)
        }

        # Enregistrer le code
        PasswordResetCode.objects.create(user=user, code=code)
        message = f" {email} Votre code de réinitialisation de la plateforme IoT de 3IL est : {code}. Il expire le {reset_codes[email]['expires_at']}."
        send_mail(
            "Votre code de réinitialisation de la plateforme IoT de 3IL",
            message,
            "no-reply@3il-ingenieurs.fr",
            [email],
        )

        return Response({"Success": "Code envoyé par email", "mail": message}, status=HTTPStatus.OK)


class ConfirmPasswordResetView(APIView):
    """ Vue pour confirmer la réinitialisation du mot de passe. """

    def post(self, request):
        code = request.data.get("code")
        new_password = request.data.get("new_password")

        try:
            reset_entry = PasswordResetCode.objects.get(code=code, used=False)
        except PasswordResetCode.DoesNotExist:
            return Response({"error": "Code invalide ou déjà utilisé."}, status=HTTPStatus.BAD_REQUEST)

        if reset_entry.is_expired():
            return Response({"error": "Code expiré."}, status=HTTPStatus.BAD_REQUEST)

        user = reset_entry.user
        user.set_password(new_password)
        user.save()

        reset_entry.used = True
        reset_entry.save()

        return Response({"success": "Mot de passe mis à jour."}, status=HTTPStatus.OK)
