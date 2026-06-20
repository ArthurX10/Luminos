# luminos/urls.py
from django.urls import path
# ADICIONADO: As novas funções da Sprint 03 foram incluídas no import aqui em cima
from core.views import (
    api_login, api_cadastro, api_anotacoes, api_detalhe_anotacao, api_perfil_usuario,
    api_gerenciar_etiquetas, api_vincular_etiqueta, api_salvar_elemento_visual, api_salvar_conexao,
    api_alternar_importante, api_listar_notificacoes, api_marcar_notificacao_lida,
    login_view, cadastro_view, anotacoes_view, excluir_anotacao, editar_anotacao, logout_view,
    api_detalhe_evento, api_gerenciar_eventos,
    google_auth_redirect, google_auth_callback, google_eventos,
)

urlpatterns = [
    # APENAS ROTAS DE API (React / Vite)
    path('api/login/', api_login, name='api_login'),
    path('api/cadastro/', api_cadastro, name='api_cadastro'),
    path('api/login', api_login),
    path('api/cadastro', api_cadastro),
    path('api/notas/<int:user_id>/', api_anotacoes, name='api_listar_criar_notas'),
    path('api/notas/detalhe/<int:pk>/', api_detalhe_anotacao, name='api_gerenciar_nota'),
    path('api/perfil/<int:user_id>/', api_perfil_usuario, name='api_perfil_usuario'),

    # Gerenciamento de Etiquetas do usuário (CORRIGIDO: removido o 'views.')
    path('api/etiquetas/<int:user_id>/', api_gerenciar_etiquetas),
    path('api/etiquetas/<int:user_id>', api_gerenciar_etiquetas),
    
    # Vinculo N:M entre Nota e Etiqueta
    path('api/anotacao/<int:nota_id>/vincular-etiqueta/', api_vincular_etiqueta),
    path('api/anotacao/<int:nota_id>/vincular-etiqueta', api_vincular_etiqueta),

    # Criar formas geométricas e conectores
    path('api/anotacao/<int:nota_id>/elemento/', api_salvar_elemento_visual),
    path('api/anotacao/<int:nota_id>/elemento', api_salvar_elemento_visual),
    path('api/anotacao/<int:nota_id>/conexao/', api_salvar_conexao),
    path('api/anotacao/<int:nota_id>/conexao', api_salvar_conexao),
    path('api/anotacao/<int:nota_id>/destacar/', api_alternar_importante),
    path('api/anotacao/<int:nota_id>/destacar', api_alternar_importante),
    # Sprint 05 (notificações)
    path('api/notificacoes/<int:user_id>/', api_listar_notificacoes),
    path('api/notificacoes/<int:user_id>', api_listar_notificacoes),
    path('api/notificacao/<int:notificacao_id>/lida/', api_marcar_notificacao_lida),
    path('api/notificacao/<int:notificacao_id>/lida', api_marcar_notificacao_lida),
    # Calendario
    path('api/eventos/<int:user_id>/', api_gerenciar_eventos, name='api_gerenciar_eventos'),
    path('api/evento/<int:pk>/', api_detalhe_evento, name='api_detalhe_evento'),
    # rotas tradicionais de HTML
    path('login/', login_view, name='login'),
    path('login', login_view),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('cadastro', cadastro_view),
    path('anotacoes/', anotacoes_view, name='exibir_anotacoes'),
    path('anotacoes', anotacoes_view),
    path('excluir/<int:pk>/', excluir_anotacao, name='excluir_anotacao'),
    path('editar/<int:pk>/', editar_anotacao, name='editar_anotacao'),
    path('logout/', logout_view, name='logout'),

    # Google Agenda
    path('api/google/login/', google_auth_redirect),
    path('api/google/callback/', google_auth_callback),
    path('api/google/eventos/', google_eventos),

]