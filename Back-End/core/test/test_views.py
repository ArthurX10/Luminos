# app/tests/conftest.py

import pytest
from django.contrib.auth.hashers import make_password
from app.models import Usuarios


@pytest.fixture
def usuario():
    return Usuarios.objects.create(
        email="teste@email.com",
        senha_hash=make_password("123456")
    )

#======================================================

import pytest
from rest_framework.test import APIClient
from app.models import Usuarios


@pytest.mark.django_db
class TestApiCadastro:

    def setup_method(self):
        self.client = APIClient()

    def test_cadastro_sucesso(self):
        response = self.client.post(
            "/api/cadastro/",
            {
                "email": "novo@email.com",
                "senha": "123456"
            },
            format="json"
        )

        assert response.status_code == 201
        assert Usuarios.objects.filter(
            email="novo@email.com"
        ).exists()

    def test_cadastro_email_duplicado(self):
        Usuarios.objects.create(
            email="teste@email.com",
            senha_hash="123"
        )

        response = self.client.post(
            "/api/cadastro/",
            {
                "email": "teste@email.com",
                "senha": "123456"
            },
            format="json"
        )

        assert response.status_code == 400

# ======================================================

import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestApiLogin:

    def setup_method(self):
        self.client = APIClient()

    def test_login_sucesso(self, usuario):

        response = self.client.post(
            "/api/login/",
            {
                "email": "teste@email.com",
                "senha": "123456"
            },
            format="json"
        )

        assert response.status_code == 200
        assert response.data["email"] == "teste@email.com"

    def test_login_senha_errada(self, usuario):

        response = self.client.post(
            "/api/login/",
            {
                "email": "teste@email.com",
                "senha": "senha_errada"
            },
            format="json"
        )

        assert response.status_code == 401

    def test_login_usuario_nao_existe(self):

        response = self.client.post(
            "/api/login/",
            {
                "email": "naoexiste@email.com",
                "senha": "123456"
            },
            format="json"
        )

        assert response.status_code == 404

  #=====================================================

import pytest
from rest_framework.test import APIClient
from app.models import Anotacoes


@pytest.mark.django_db
class TestApiAnotacoes:

    def setup_method(self):
        self.client = APIClient()

    def test_criar_anotacao(self, usuario):

        response = self.client.post(
            f"/api/anotacoes/{usuario.id}/",
            {
                "titulo": "POO",
                "conteudo": "Estudar herança"
            },
            format="json"
        )

        assert response.status_code == 201

        assert Anotacoes.objects.filter(
            titulo="POO"
        ).exists()

    def test_listar_anotacoes(self, usuario):

        Anotacoes.objects.create(
            usuario=usuario,
            titulo="Teste",
            conteudo="Conteudo"
        )

        response = self.client.get(
            f"/api/anotacoes/{usuario.id}/"
        )

        assert response.status_code == 200
        assert len(response.data) == 1

  #======================================================================
import pytest
from rest_framework.test import APIClient
from app.models import Anotacoes


@pytest.mark.django_db
class TestAlternarImportante:

    def setup_method(self):
        self.client = APIClient()

    def test_alterna_importante(self, usuario):

        nota = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Teste"
        )

        assert nota.importante is False

        response = self.client.patch(
            f"/api/anotacoes/{nota.id}/importante/"
        )

        nota.refresh_from_db()

        assert response.status_code == 200
        assert nota.importante is True

#=============================================================
import pytest
from rest_framework.test import APIClient
from app.models import Notificacoes


@pytest.mark.django_db
class TestNotificacoes:

    def setup_method(self):
        self.client = APIClient()

    def test_marcar_como_lida(self, usuario):

        notificacao = Notificacoes.objects.create(
            usuario=usuario,
            mensagem="Teste"
        )

        response = self.client.patch(
            f"/api/notificacoes/{notificacao.id}/lida/"
        )

        notificacao.refresh_from_db()

        assert response.status_code == 200
        assert notificacao.lida is True

#=================================================
import pytest
from django.utils import timezone
from rest_framework.test import APIClient
from app.models import Eventos


@pytest.mark.django_db
class TestEventos:

    def setup_method(self):
        self.client = APIClient()

    def test_criar_evento(self, usuario):

        response = self.client.post(
            f"/api/eventos/{usuario.id}/",
            {
                "titulo": "Prova POO",
                "tipo": "AVALIACAO",
                "data_inicio": timezone.now().isoformat()
            },
            format="json"
        )

        assert response.status_code == 201

        assert Eventos.objects.filter(
            titulo="Prova POO"
        ).exists()
#====================================================================
