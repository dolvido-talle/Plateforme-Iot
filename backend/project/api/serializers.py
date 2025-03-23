from rest_framework import serializers
from .models import User
from .models import DeviceData


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'iot_id', 'password', 'username']

    def create(self, validated_data):
        user = User(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])  # Hash du mot de passe
        user.save()
        return user

    for user in User.objects.all():
      if not user.password.startswith("pbkdf2_sha256$"):  # Vérifions si le mot de passe est en clair
        user.set_password(user.password)
        user.save()


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class DeviceDataSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DeviceData
        fields = ['id', 'user_email', 'device_id', 'temperature', 'humidity', 'date_create']


