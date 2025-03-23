from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User, DeviceData


# Enregistrer le modèle User dans l'admin
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'iot_id', 'is_active', 'is_superuser', 'password')  # Champs à afficher dans la liste
    search_fields = ('email', 'username')  # Champs sur lesquels tu peux rechercher
    list_filter = ('is_active',)  # Filtre par statut d'activation


class DeviceDataAdmin(admin.ModelAdmin):
    # Liste des champs à afficher dans la liste des objets
    list_display = ('device_id', 'date_create', 'temperature', 'humidity')
    # Champs que tu veux rendre filtrables dans l'interface admin
    list_filter = ('device_id', 'date_create')
    # Champs à rechercher dans la liste
    search_fields = ('device_id',)
    ordering = ('-date_create',)
    list_editable = ('temperature', 'humidity')


admin.site.register(DeviceData, DeviceDataAdmin)
