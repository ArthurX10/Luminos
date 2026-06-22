import pytest
from django.contrib.auth.hashers import check_password
from rest_framework.test import APIClient
from core.models import Usuarios, Anotacoes, Etiquetas, Notificacoes, Eventos, ElementosVisuais, ConexoesLinhas


@pytest.mark.django_db
class TestPerfilUsuario:

    def setup_method(self):
        self.client = APIClient()

    def test_busca_perfil(self, usuario):

        response = self.client.get(
            f"/api/perfil/{usuario.id}/"
        )

        assert response.status_code == 200
        assert response.data["email"] == usuario.email

    def test_atualizar_nome(self, usuario):

        response = self.client.put(
            f"/api/perfil/{usuario.id}/",
            {
                "nome": "Arthur"
            },
            format="json"
        )

        usuario.refresh_from_db()

        assert response.status_code == 200
        assert usuario.nome == "Arthur"

    def test_atualizar_senha(self, usuario):

        response = self.client.put(
            f"/api/perfil/{usuario.id}/",
            {
                "senha": "novaSenha123"
            },
            format="json"
        )

        usuario.refresh_from_db()

        assert response.status_code == 200
        assert check_password(
            "novaSenha123",
            usuario.senha_hash
        )

    def test_senha_curta(self, usuario):

        response = self.client.put(
            f"/api/perfil/{usuario.id}/",
            {
                "senha": "123"
            },
            format="json"
        )

        assert response.status_code == 400


# ====================================================

@pytest.mark.django_db
class TestEtiquetasApi:

    def setup_method(self):
        self.client = APIClient()

    def test_criar_etiqueta(self, usuario):

        response = self.client.post(
            f"/api/etiquetas/{usuario.id}/",
            {
                "nome": "Faculdade"
            },
            format="json"
        )

        assert response.status_code == 201

        assert Etiquetas.objects.filter(
            nome="Faculdade"
        ).exists()

    def test_listar_etiquetas(self, usuario):

        Etiquetas.objects.create(
            usuario=usuario,
            nome="Python"
        )

        response = self.client.get(
            f"/api/etiquetas/{usuario.id}/"
        )

        assert response.status_code == 200
        assert len(response.data) == 1

    def test_excluir_etiqueta(self, usuario):

        etiqueta = Etiquetas.objects.create(
            usuario=usuario,
            nome="Excluir"
        )

        response = self.client.delete(
            f"/api/etiqueta/{etiqueta.id}/"
        )

        assert response.status_code == 204

        assert not Etiquetas.objects.filter(
            id=etiqueta.id
        ).exists()


# ====================================================

@pytest.mark.django_db
class TestVincularEtiqueta:

    def setup_method(self):
        self.client = APIClient()

    def test_vincular_etiqueta(self, usuario):

        nota = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Teste"
        )

        etiqueta = Etiquetas.objects.create(
            usuario=usuario,
            nome="Importante"
        )

        response = self.client.post(
            f"/api/anotacao/{nota.id}/vincular-etiqueta/",
            {
                "etiqueta_id": etiqueta.id
            },
            format="json"
        )

        nota.refresh_from_db()

        assert response.status_code == 200
        assert nota.etiquetas.count() == 1


# ====================================================

@pytest.mark.django_db
class TestDetalheAnotacao:

    def setup_method(self):
        self.client = APIClient()

    def test_buscar_anotacao(self, usuario):

        nota = Anotacoes.objects.create(
            usuario=usuario,
            titulo="POO",
            conteudo="Herança"
        )

        response = self.client.get(
            f"/api/notas/detalhe/{nota.id}/"
        )

        assert response.status_code == 200
        assert response.data["titulo"] == "POO"

    def test_editar_anotacao(self, usuario):

        nota = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Velho"
        )

        response = self.client.put(
            f"/api/notas/detalhe/{nota.id}/",
            {
                "conteudo": "Novo"
            },
            format="json"
        )

        nota.refresh_from_db()

        assert response.status_code == 200
        assert nota.conteudo == "Novo"

    def test_excluir_anotacao(self, usuario):

        nota = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Excluir"
        )

        response = self.client.delete(
            f"/api/notas/detalhe/{nota.id}/"
        )

        assert response.status_code == 204

        assert not Anotacoes.objects.filter(
            id=nota.id
        ).exists()


# ====================================================

@pytest.mark.django_db
class TestNotificacoesApi:

    def setup_method(self):
        self.client = APIClient()

    def test_listar_notificacoes(self, usuario):

        Notificacoes.objects.create(
            usuario=usuario,
            mensagem="Teste"
        )

        response = self.client.get(
            f"/api/notificacoes/{usuario.id}/"
        )

        assert response.status_code == 200
        assert len(response.data) == 1


# ====================================================

@pytest.mark.django_db
class TestEventosApi:

    def setup_method(self):
        self.client = APIClient()

    def test_listar_eventos(self, usuario):

        from django.utils import timezone

        Eventos.objects.create(
            usuario=usuario,
            titulo="POO",
            tipo="AVALIACAO",
            data_inicio=timezone.now()
        )

        response = self.client.get(
            f"/api/eventos/{usuario.id}/"
        )

        assert response.status_code == 200
        assert len(response.data) == 1

    def test_deletar_evento(self, usuario):

        from django.utils import timezone

        evento = Eventos.objects.create(
            usuario=usuario,
            titulo="Prova",
            tipo="AVALIACAO",
            data_inicio=timezone.now()
        )

        response = self.client.delete(
            f"/api/evento/{evento.id}/"
        )

        assert response.status_code == 204

        assert not Eventos.objects.filter(
            id=evento.id
        ).exists()


# ====================================================

@pytest.mark.django_db
class TestAutenticacaoApi:
    """Valida cadastro e login de usuários via API."""

    def setup_method(self):
        self.client = APIClient()

    def test_cadastro_sucesso(self):
        response = self.client.post(
            "/api/cadastro/",
            {
                "email": "novocadastro@email.com",
                "senha": "senhasegura123"
            },
            format="json"
        )
        assert response.status_code == 201
        assert Usuarios.objects.filter(email="novocadastro@email.com").exists()

    def test_cadastro_email_duplicado(self, usuario):
        response = self.client.post(
            "/api/cadastro/",
            {
                "email": usuario.email,
                "senha": "outrasenha123"
            },
            format="json"
        )
        assert response.status_code == 400
        assert "error" in response.data

    def test_login_sucesso(self, usuario):
        response = self.client.post(
            "/api/login/",
            {
                "email": usuario.email,
                "senha": "123456"
            },
            format="json"
        )
        assert response.status_code == 200
        assert response.data["user_id"] == usuario.id

    def test_login_senha_incorreta(self, usuario):
        response = self.client.post(
            "/api/login/",
            {
                "email": usuario.email,
                "senha": "senhaerrada123"
            },
            format="json"
        )
        assert response.status_code == 401


@pytest.mark.django_db
class TestGerenciarNotasApi:
    """Testa os endpoints de listar/filtrar e criar notas (AnotacaoCompletaSerializer)."""

    def setup_method(self):
        self.client = APIClient()

    def test_criar_nota_sucesso(self, usuario):
        response = self.client.post(
            f"/api/notas/{usuario.id}/",
            {
                "titulo": "Nota de Teste",
                "conteudo": "Conteúdo legal",
                "diretorio": "PESSOAL"
            },
            format="json"
        )
        assert response.status_code == 201
        assert Anotacoes.objects.filter(usuario=usuario, titulo="Nota de Teste").exists()

    def test_listar_e_filtrar_notas(self, usuario):
        etiqueta = Etiquetas.objects.create(usuario=usuario, nome="Estudos")
        
        # Cria notas com características diferentes
        nota1 = Anotacoes.objects.create(
            usuario=usuario, titulo="Nota 1", conteudo="Conteudo 1", diretorio="PESSOAL", importante=True
        )
        nota1.etiquetas.add(etiqueta)

        Anotacoes.objects.create(
            usuario=usuario, titulo="Nota 2", conteudo="Conteudo 2", diretorio="TRABALHO", importante=False
        )

        # 1. Listar todas
        response = self.client.get(f"/api/notas/{usuario.id}/")
        assert response.status_code == 200
        assert len(response.data) == 2

        # 2. Filtrar por apenas importantes
        response = self.client.get(f"/api/notas/{usuario.id}/?apenas_importantes=true")
        assert len(response.data) == 1
        assert response.data[0]["titulo"] == "Nota 1"

        # 3. Filtrar por diretório
        response = self.client.get(f"/api/notas/{usuario.id}/?diretorio=TRABALHO")
        assert len(response.data) == 1
        assert response.data[0]["titulo"] == "Nota 2"

        # 4. Filtrar por etiqueta
        response = self.client.get(f"/api/notas/{usuario.id}/?etiqueta_id={etiqueta.id}")
        assert len(response.data) == 1
        assert response.data[0]["titulo"] == "Nota 1"


@pytest.mark.django_db
class TestMapaMentalApi:
    """Testa salvamento de elementos visuais e conexões do mapa mental."""

    def setup_method(self):
        self.client = APIClient()

    def test_salvar_elemento_visual(self, usuario):
        nota = Anotacoes.objects.create(usuario=usuario, conteudo="Mapa")
        response = self.client.post(
            f"/api/anotacao/{nota.id}/elemento/",
            {
                "tipo_forma": "RETANGULO",
                "texto_interno": "Bloco 1",
                "posicao_x": 100,
                "posicao_y": 150
            },
            format="json"
        )
        assert response.status_code == 201
        assert ElementosVisuais.objects.filter(anotacao=nota, tipo_forma="RETANGULO").exists()

    def test_salvar_conexao(self, usuario):
        nota = Anotacoes.objects.create(usuario=usuario, conteudo="Mapa")
        el1 = ElementosVisuais.objects.create(anotacao=nota, tipo_forma="RETANGULO")
        el2 = ElementosVisuais.objects.create(anotacao=nota, tipo_forma="CIRCULO")

        response = self.client.post(
            f"/api/anotacao/{nota.id}/conexao/",
            {
                "elemento_origem": el1.id,
                "elemento_destino": el2.id,
                "tipo_linha": "RETA",
                "espessura": 2
            },
            format="json"
        )
        assert response.status_code == 201
        assert ConexoesLinhas.objects.filter(anotacao=nota, elemento_origem=el1).exists()


@pytest.mark.django_db
class TestNotificacoesAcoesApi:
    """Testa marcação de lida em notificações."""

    def setup_method(self):
        self.client = APIClient()

    def test_marcar_notificacao_como_lida(self, usuario):
        notif = Notificacoes.objects.create(usuario=usuario, mensagem="Alerta")
        
        response = self.client.patch(
            f"/api/notificacao/{notif.id}/lida/"
        )
        
        assert response.status_code == 200
        notif.refresh_from_db()
        assert notif.lida is True


@pytest.mark.django_db
class TestExtrasApi:
    """Testa ações adicionais em anotações (marcar importante e atualizar evento)."""

    def setup_method(self):
        self.client = APIClient()

    def test_alternar_importante(self, usuario):
        nota = Anotacoes.objects.create(usuario=usuario, conteudo="Teste", importante=False)
        
        response = self.client.patch(
            f"/api/anotacao/{nota.id}/destacar/"
        )
        
        assert response.status_code == 200
        nota.refresh_from_db()
        assert nota.importante is True

    def test_criar_evento_sucesso(self, usuario):
        from django.utils import timezone
        
        response = self.client.post(
            f"/api/eventos/{usuario.id}/",
            {
                "titulo": "Reunião de Estudos",
                "tipo": "REUNIAO",
                "data_inicio": timezone.now().isoformat()
            },
            format="json"
        )
        assert response.status_code == 201
        assert Eventos.objects.filter(usuario=usuario, titulo="Reunião de Estudos").exists()

    def test_atualizar_evento(self, usuario):
        from django.utils import timezone
        evento = Eventos.objects.create(
            usuario=usuario, titulo="Prova", tipo="AVALIACAO", data_inicio=timezone.now()
        )

        response = self.client.put(
            f"/api/evento/{evento.id}/",
            {
                "titulo": "Prova de POO Alterada"
            },
            format="json"
        )
        assert response.status_code == 200
        evento.refresh_from_db()
        assert evento.titulo == "Prova de POO Alterada"