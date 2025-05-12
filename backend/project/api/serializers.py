from rest_framework import serializers
from .models import User
from .models import DeviceData
from rest_framework.validators import UniqueValidator


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['id', 'email', 'iot_id', 'password', 'username']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            iot_id=validated_data.get('iot_id')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']


class DeviceDataSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DeviceData
        fields = ['id', 'user_email', 'device_id', 'temperature', 'humidity', 'date_create']


