"""
URL configuration for luminos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from core.views import (
    login_view, anotacoes_view, logout_view, 
    cadastro_view, excluir_anotacao, editar_anotacao
)

urlpatterns = [
    path('', login_view, name='login'),
    path('cadastro/', cadastro_view, name='cadastro'),
    path('anotacoes/', anotacoes_view, name='exibir_anotacoes'),
    path('anotacoes/excluir/<int:pk>/', excluir_anotacao, name='excluir_anotacao'),
    path('anotacoes/editar/<int:pk>/', editar_anotacao, name='editar_anotacao'),
    path('logout/', logout_view, name='logout'),
]