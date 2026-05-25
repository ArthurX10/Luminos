# luminos/urls.py
from django.urls import path
# ADICIONADO: As novas funções da Sprint 03 foram incluídas no import aqui em cima
from core.views import (
    api_login, api_cadastro, api_anotacoes, api_detalhe_anotacao, api_perfil_usuario,
    api_gerenciar_etiquetas, api_vincular_etiqueta, api_salvar_elemento_visual, api_salvar_conexao
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
    path('api/anotacao/<int:nota_id>/conexao', api_salvar_conexao), # <-- Não esqueça dessa última vírgula!
]