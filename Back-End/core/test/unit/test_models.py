import pytest
from django.db import IntegrityError
from core.models import (
    Usuarios,
    Etiquetas,
    Anotacoes,
    AnotacaoEtiquetas,
    ElementosVisuais,
    ConexoesLinhas,
    Eventos,
    Notificacoes
)

from django.utils import timezone


@pytest.mark.django_db
class TestUsuarios:

    def test_criar_usuario(self):
        usuario = Usuarios.objects.create(
            nome="Vinicius",
            email="vinicius@email.com",
            senha_hash="123456"
        )

        assert usuario.id is not None
        assert usuario.nome == "Vinicius"
        assert usuario.email == "vinicius@email.com"

    def test_str_usuario(self):
        usuario = Usuarios.objects.create(
            email="teste@email.com",
            senha_hash="abc"
        )

        assert str(usuario) == "teste@email.com"

    def test_email_unico(self):
        Usuarios.objects.create(
            email="teste@email.com",
            senha_hash="123"
        )

        with pytest.raises(IntegrityError):
            Usuarios.objects.create(
                email="teste@email.com",
                senha_hash="456"
            )

#========================================================================

@pytest.mark.django_db
class TestEtiquetas:

    def test_criar_etiqueta(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        etiqueta = Etiquetas.objects.create(
            usuario=usuario,
            nome="Estudos"
        )

        assert etiqueta.nome == "Estudos"
        assert etiqueta.cor == "#3498DB"

    def test_nome_unico_por_usuario(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        Etiquetas.objects.create(
            usuario=usuario,
            nome="Python"
        )

        with pytest.raises(IntegrityError):
            Etiquetas.objects.create(
                usuario=usuario,
                nome="Python"
            )

#========================================================================

@pytest.mark.django_db
class TestAnotacoes:

    def test_criar_anotacao(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Minha anotação"
        )

        assert anotacao.conteudo == "Minha anotação"
        assert anotacao.cor_fundo == "#FFFFFF"
        assert anotacao.tipo_layout == "TEXTO"
        assert anotacao.importante is False

    def test_relacao_etiquetas(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Teste"
        )

        etiqueta = Etiquetas.objects.create(
            usuario=usuario,
            nome="Faculdade"
        )

        anotacao.etiquetas.add(etiqueta)

        assert anotacao.etiquetas.count() == 1
        assert anotacao.etiquetas.first() == etiqueta

# ===================================================================

@pytest.mark.django_db
class TestAnotacaoEtiquetas:

    def test_associacao(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Teste"
        )

        etiqueta = Etiquetas.objects.create(
            usuario=usuario,
            nome="Importante"
        )

        associacao = AnotacaoEtiquetas.objects.create(
            anotacao=anotacao,
            etiqueta=etiqueta
        )

        assert associacao.anotacao == anotacao
        assert associacao.etiqueta == etiqueta

# ==============================================================

@pytest.mark.django_db
class TestElementosVisuais:

    def test_criar_elemento_visual(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Mapa mental"
        )

        elemento = ElementosVisuais.objects.create(
            anotacao=anotacao,
            tipo_forma="RETANGULO"
        )

        assert elemento.tipo_forma == "RETANGULO"
        assert elemento.largura == 150
        assert elemento.altura == 80

# ====================================

@pytest.mark.django_db
class TestConexoesLinhas:

    def test_criar_conexao(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Mapa"
        )

        origem = ElementosVisuais.objects.create(
            anotacao=anotacao,
            tipo_forma="RETANGULO"
        )

        destino = ElementosVisuais.objects.create(
            anotacao=anotacao,
            tipo_forma="CIRCULO"
        )

        conexao = ConexoesLinhas.objects.create(
            anotacao=anotacao,
            elemento_origem=origem,
            elemento_destino=destino
        )

        assert conexao.tipo_linha == "RETA"
        assert conexao.espessura == 2

#=========================================================

@pytest.mark.django_db
class TestEventos:

    def test_criar_evento(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        evento = Eventos.objects.create(
            usuario=usuario,
            titulo="Prova POO",
            tipo="AVALIACAO",
            data_inicio=timezone.now()
        )

        assert evento.titulo == "Prova POO"
        assert evento.tipo == "AVALIACAO"

    def test_str_evento(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        evento = Eventos.objects.create(
            usuario=usuario,
            titulo="Reunião",
            tipo="REUNIAO",
            data_inicio=timezone.now()
        )

        assert str(evento) == "Reunião"

# ==============================================

@pytest.mark.django_db
class TestNotificacoes:

    def test_criar_notificacao_para_anotacao(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        anotacao = Anotacoes.objects.create(
            usuario=usuario,
            conteudo="Ler documentação"
        )

        notificacao = Notificacoes.objects.create(
            usuario=usuario,
            anotacao=anotacao,
            mensagem="Prazo próximo"
        )

        assert notificacao.mensagem == "Prazo próximo"
        assert notificacao.lida is False

    def test_criar_notificacao_para_evento(self):
        usuario = Usuarios.objects.create(
            email="user@email.com",
            senha_hash="123"
        )

        evento = Eventos.objects.create(
            usuario=usuario,
            titulo="Prova",
            tipo="AVALIACAO",
            data_inicio=timezone.now()
        )

        notificacao = Notificacoes.objects.create(
            usuario=usuario,
            evento=evento,
            mensagem="Prova amanhã"
        )

        assert notificacao.evento == evento
  
