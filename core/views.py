from django.shortcuts import render
from django.contrib import messages
from .models import Usuarios, Anotacoes

def criar_anotacao_view(request):
    if request.method == 'POST':
        email_form = request.POST.get('email')
        senha_form = request.POST.get('senha')
        titulo_form = request.POST.get('titulo')
        conteudo_form = request.POST.get('conteudo')

        try:
            # busca user com o email correspondente
            usuario = Usuarios.objects.get(email=email_form)

            # compara senha depois usar a criptografia do Django
            if usuario.senha_hash == senha_form:
                # Salva a anotação
                Anotacoes.objects.create(
                    usuario=usuario,
                    titulo=titulo_form,
                    conteudo=conteudo_form
                )
                messages.success(request, "Anotação salva com sucesso no Neon!")
            else:
                messages.error(request, "Senha incorreta.")
        
        except Usuarios.DoesNotExist:
            messages.error(request, "Usuário não encontrado.")

    return render(request, 'anotacao.html')