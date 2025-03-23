from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models


# Modèle utilisateur personnalisé
class User(AbstractUser):
    email = models.EmailField(unique=True)
    iot_id = models.CharField(max_length=100, unique=True, blank=True, null=True)  # ID plateforme IoT
    username = models.CharField(max_length=255)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    # Modifier les relations pour éviter le conflit de related_name
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # Nouveau nom pour la relation
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # Nouveau nom pour la relation
        blank=True
    )

    def __str__(self):
        return self.email


# Modèle des données IoT
class DeviceData(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="device_data")
    device_id = models.CharField(max_length=100)  # Identifiant unique de l’appareil IoT
    temperature = models.FloatField()
    humidity = models.FloatField(blank=True, null=True)
    date_create = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.device_id


