from django.db import models

# Create your models here.
class Anotacoes(models.Model):
    usuario = models.ForeignKey('Usuarios', models.DO_NOTHING)
    titulo = models.CharField(max_length=150, blank=True, null=True)
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False

class Usuarios(models.Model):
    email = models.CharField(unique=True, max_length=255)
    senha_hash = models.CharField(max_length=255)
    data_criacao = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'