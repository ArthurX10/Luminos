from django.db import models

class Usuarios(models.Model):
    nome = models.CharField(max_length=150, blank=True, null=True)
    foto_url = models.TextField(blank=True, null=True)
    email = models.CharField(unique=True, max_length=255)
    senha_hash = models.CharField(max_length=255)
    data_criacao = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'usuarios'

    def __str__(self):
        return self.email

class Etiquetas(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, db_column='usuario_id')
    nome = models.CharField(max_length=50)
    cor = models.CharField(max_length=7, default='#3498DB')
    criado_em = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'etiquetas'
        unique_together = (('usuario', 'nome'),)

class Anotacoes(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, db_column='usuario_id') 
    titulo = models.CharField(max_length=150, blank=True, null=True)
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    cor_fundo = models.CharField(max_length=7, default='#FFFFFF') #sprint 03
    tipo_layout = models.CharField(max_length=20, default='TEXTO')
    importante = models.BooleanField(default=False) #sprint 04
    etiquetas = models.ManyToManyField(Etiquetas, through='AnotacaoEtiquetas')
    data_prazo = models.DateTimeField(blank=True, null=True) #sprint 05
    dias_antecedencia_alerta = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'anotacoes'

class AnotacaoEtiquetas(models.Model):
    anotacao = models.ForeignKey(Anotacoes, on_delete=models.CASCADE, db_column='anotacao_id')
    etiqueta = models.ForeignKey(Etiquetas, on_delete=models.CASCADE, db_column='etiqueta_id')
    associado_em = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'anotacao_etiquetas'
        unique_together = (('anotacao', 'etiqueta'),)

class ElementosVisuais(models.Model):
    anotacao = models.ForeignKey(Anotacoes, on_delete=models.CASCADE, db_column='anotacao_id')
    tipo_forma = models.CharField(max_length=30)
    texto_interno = models.TextField(blank=True, null=True)
    posicao_x = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    posicao_y = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    largura = models.DecimalField(max_digits=10, decimal_places=2, default=150.00)
    altura = models.DecimalField(max_digits=10, decimal_places=2, default=80.00)
    cor_preenchimento = models.CharField(max_length=7, default='#FFFFFF')
    cor_borda = models.CharField(max_length=7, default='#000000')
    criado_em = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'elementos_visuais'

class ConexoesLinhas(models.Model):
    anotacao = models.ForeignKey(Anotacoes, on_delete=models.CASCADE, db_column='anotacao_id')
    elemento_origem = models.ForeignKey(ElementosVisuais, on_delete=models.CASCADE, related_name='conexoes_origem', db_column='elemento_origem_id')
    elemento_destino = models.ForeignKey(ElementosVisuais, on_delete=models.CASCADE, related_name='conexoes_destino', db_column='elemento_destino_id')
    tipo_linha = models.CharField(max_length=20, default='RETA')
    cor_linha = models.CharField(max_length=7, default='#000000')
    espessura = models.IntegerField(default=2, blank=True, null=True)
    texto_rotulo = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'conexoes_linhas'

# Calendario
class Eventos(models.Model):
    TIPO_CHOICES = [
        ('LEMBRETE', 'Lembrete'),
        ('REUNIAO', 'Reunião'),
        ('EVENTO', 'Evento'),
        ('ANIVERSARIO', 'Aniversário'),
        ('AVALIACAO', 'Avaliação'),
    ]

    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, db_column='usuario_id')
    titulo = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    data_inicio = models.DateTimeField()
    data_fim = models.DateTimeField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'eventos'
        # Criando o índice que o David pediu para o calendário
        indexes = [
            models.Index(fields=['data_inicio'], name='idx_evento_data_inicio'),
        ]

    def __str__(self):
        return self.titulo

class Notificacoes(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, db_column='usuario_id')
    anotacao = models.ForeignKey(Anotacoes, on_delete=models.CASCADE, db_column='anotacao_id', blank=True, null=True) # Modificado para null=True porque agora a notificação pode vir de um evento
    evento = models.ForeignKey(Eventos, on_delete=models.CASCADE, db_column='evento_id', blank=True, null=True) # nova chave estrangeira para o calendario
    mensagem = models.TextField()
    lida = models.BooleanField(default=False)
    criada_em = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'notificacoes'

