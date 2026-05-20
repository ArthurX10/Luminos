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


class Anotacoes(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE) 
    titulo = models.CharField(max_length=150, blank=True, null=True)
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'anotacoes'