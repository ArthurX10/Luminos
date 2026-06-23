from rest_framework import serializers
from .models import Usuarios, Anotacoes, Etiquetas, ElementosVisuais, ConexoesLinhas, Notificacoes, Eventos

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        # Adicionando os novos campos que o David criou no bd
        fields = ['id', 'nome', 'email', 'foto_url', 'data_criacao'] # adicionei o data de criação zé 

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiquetas
        fields = ['id', 'usuario', 'nome', 'cor']

class AnotacaoSerializer(serializers.ModelSerializer):
    conteudo = serializers.CharField(allow_blank=True, required=False)
    etiquetas = EtiquetaSerializer(many=True, read_only=True)
    elementos = serializers.SerializerMethodField()
    conexoes = serializers.SerializerMethodField()

    class Meta:
        model = Anotacoes
        # Sprint 06 - Adicionada a descrição (resumo) separada do conteúdo principal
        fields = ['id', 'titulo', 'descricao', 'conteudo', 'data_criacao',
                  'cor_fundo', 'tipo_layout', 'importante', 
                  'data_prazo', 'dias_antecedencia_alerta', 'diretorio', 'imagem_url', 'data_atualizacao', 'etiquetas', 'elementos', 'conexoes']
        read_only_fields = ['usuario']

    def get_elementos(self, obj):
        elementos = ElementosVisuais.objects.filter(anotacao=obj)
        return ElementoVisualSerializer(elementos, many=True).data

    def get_conexoes(self, obj):
        conexoes = ConexoesLinhas.objects.filter(anotacao=obj)
        return ConexaoLinhaSerializer(conexoes, many=True).data

class ElementoVisualSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementosVisuais
        fields = '__all__'

class ConexaoLinhaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConexoesLinhas
        fields = '__all__'

class AnotacaoCompletaSerializer(serializers.ModelSerializer):
    conteudo = serializers.CharField(allow_blank=True, required=False)
    # Trazer dados aninhados para o React renderizar o mapa visual completo de uma vez
    etiquetas = EtiquetaSerializer(many=True, read_only=True)
    elementos = serializers.SerializerMethodField()
    conexoes = serializers.SerializerMethodField()

    class Meta:
        model = Anotacoes
        # Sprint 06 - Adicionada a descrição ao retorno completo
        fields = ['id', 'usuario', 'titulo', 'descricao', 'conteudo', 'cor_fundo', 'tipo_layout', 'data_criacao', 'importante', 'diretorio', 'etiquetas', 'elementos', 'conexoes', 'imagem_url', 'data_atualizacao']

    def get_elementos(self, obj):
        elementos = ElementosVisuais.objects.filter(anotacao=obj)
        return ElementoVisualSerializer(elementos, many=True).data

    def get_conexoes(self, obj):
        conexoes = ConexoesLinhas.objects.filter(anotacao=obj)
        return ConexaoLinhaSerializer(conexoes, many=True).data
    
class NotificacaoSerializer(serializers.ModelSerializer):
# Traz o título da anotação associada para o Front-End poder exibir "Prazo perto: [Título da Nota]"
    anotacao_titulo = serializers.CharField(source='anotacao.titulo', read_only=True)
    evento_titulo = serializers.CharField(source='evento.titulo', read_only=True)

    class Meta:
        model = Notificacoes
        fields = ['id', 'usuario', 'anotacao', 'anotacao_titulo', 'evento', 'evento_titulo', 'mensagem', 'lida', 'criada_em']

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eventos
        fields = ['id', 'usuario', 'titulo', 'descricao', 'tipo', 'data_inicio', 'data_fim', 'criado_em']