from rest_framework import serializers
from .models import Usuarios, Anotacoes

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        # Adicionando os novos campos que o David criou no bd
        fields = ['id', 'nome', 'email', 'foto_url']

class AnotacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anotacoes
        fields = ['id', 'titulo', 'conteudo', 'data_criacao']