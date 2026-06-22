import pytest
from django.contrib.auth.hashers import make_password
from rest_framework.test import APIClient

from core.models import Usuarios


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def usuario(db):
    return Usuarios.objects.create(
        email="teste@email.com",
        senha_hash=make_password("123456")
    )