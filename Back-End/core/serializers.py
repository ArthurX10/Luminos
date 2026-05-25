from rest_framework import serializers
from .models import Usuarios, Anotacoes, Etiquetas, ElementosVisuais, ConexoesLinhas

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        # Adicionando os novos campos que o David criou no bd
        fields = ['id', 'nome', 'email', 'foto_url']

class AnotacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anotacoes
        fields = ['id', 'titulo', 'conteudo', 'data_criacao']

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiquetas
        fields = ['id', 'usuario', 'nome', 'cor']

class ElementoVisualSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementosVisuais
        fields = '__all__'

class ConexaoLinhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConexoesLinhas
        fields = '__all__'

class AnotacaoCompletaSerializer(serializers.ModelSerializer):
    # Trazer dados aninhados para o React renderizar o mapa visual completo de uma vez
    etiquetas = EtiquetaSerializer(many=True, read_only=True)
    elementos = serializers.SerializerMethodField()
    conexoes = serializers.SerializerMethodField()

    class Meta:
        model = Anotacoes
        fields = ['id', 'usuario', 'titulo', 'conteudo', 'cor_fundo', 'tipo_layout', 'data_criacao', 'etiquetas', 'elementos', 'conexoes']

    def get_elementos(self, obj):
        elementos = ElementosVisuais.objects.filter(anotacao=obj)
        return ElementoVisualSerializer(elementos, many=True).data

    def get_conexoes(self, obj):
        conexoes = ConexoesLinhas.objects.filter(anotacao=obj)
        return ConexaoLinhaSerializer(conexoes, many=True).data