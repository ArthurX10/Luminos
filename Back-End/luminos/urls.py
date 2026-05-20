from django.urls import path
from core.views import (
    api_login, api_cadastro, api_anotacoes, api_detalhe_anotacao, api_perfil_usuario
)

urlpatterns = [
    # APENAS ROTAS DE API (React / Vite)
    path('api/login/', api_login, name='api_login'),
    path('api/cadastro/', api_cadastro, name='api_cadastro'),
    path('api/notas/<int:user_id>/', api_anotacoes, name='api_listar_criar_notas'),
    path('api/notas/detalhe/<int:pk>/', api_detalhe_anotacao, name='api_gerenciar_nota'),
    path('api/perfil/<int:user_id>/', api_perfil_usuario, name='api_perfil_usuario')
]