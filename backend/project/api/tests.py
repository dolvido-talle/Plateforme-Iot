from http import HTTPStatus

import pytest as pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db(
    databases=['default'],
)
class TestCaseUser:
    @pytest.fixture(autouse=True)
    def setup_class(self):
        # Création d'un utilisateur pour les tests
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            email="toto@3il.fr",
            password="password123",
            iot_id="iot123",
            username="toto"
        )
        self.client.force_authenticate(user=self.user)

    def test_get_user_authenticated(self):
        response = self.client.get(reverse('user-list'))
        assert response.status_code == HTTPStatus.OK

    def test_get_user_not_authenticated(self):
        response = self.client.get(reverse('user-list'))
        self.client.force_authenticate(user=None)  # Déconnexion de l'utilisateur
        assert response.status_code == HTTPStatus.UNAUTHORIZED
        assert response.data["detail"] == "Authentication credentials were not provided."

    def test_create_user(self):
        data = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "username": "New User",
            "iot_id": "iot456"
        }
        response = self.client.post(reverse('user-list'), data)
        assert response.status_code == HTTPStatus.CREATED

    def test_update_user(self):
        response = self.client.patch(reverse('user-list'))
        assert response.status_code == HTTPStatus.OK
        assert len(response.data) == 1

    def test_update_user(self):
        update_data = {
            "email": "updateuser@example.com",
            "password": "update_password123",
        }
        response = self.client.patch(reverse('user-detail', kwargs={'pk': self.user.pk}), update_data)
        assert response.status_code == HTTPStatus.OK

    def test_delete_user(self):
        response = self.client.delete(reverse('user-detail', kwargs={'pk': self.user.pk}))
        assert response.status_code == HTTPStatus.NO_CONTENT
