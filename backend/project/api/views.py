from rest_framework import viewsets
from .models import User, DeviceData
from .serializers import UserSerializer, AdminSerializer, DeviceDataSerializer
from .permissions import IsAdminAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from http import HTTPStatus


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

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

            # Stockage des tokens dans des cookies sécurisés
            res.set_cookie(
                key="access_token",
                value=tokens["access"],
                httponly=True,
                secure=True,  # À désactiver si en local (mettre False)
                samesite="None",
                path="/",
            )

            res.set_cookie(
                key="refresh_token",
                value=tokens["refresh"],
                httponly=True,
                secure=False,  # À désactiver si en local (mettre False)
                samesite="None",
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

            # Mise à jour du cookie avec le nouveau token d'accès
            res.set_cookie(
                key="access_token",
                value=response.data["access"],
                httponly=True,
                secure=False,  # À désactiver si en local (mettre False)
                samesite="None",
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

