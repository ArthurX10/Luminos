from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Usuarios, Anotacoes

# parte do cadastro/login
def cadastro_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        
        # Verificão se já existe um usuario com o email cadastrado no bd
        if Usuarios.objects.filter(email=email).exists():
            messages.error(request, "Este e-mail já está cadastrado.")
        else:
            Usuarios.objects.create(email=email, senha_hash=senha)
            messages.success(request, "Cadastro realizado! Agora faça login.")
            return redirect('login')
        
    return render(request, 'cadastro.html')

def login_view(request):
    if request.method ==  'POST':
        email_form = request.POST.get('email')
        senha_form = request.POST.get('senha')

        try:
            usuario = Usuarios.objects.get(email=email_form)
            if usuario.senha_hash == senha_form:
                request.session['usuario_id'] = usuario.id
                return redirect('exibir_anotacoes')
            else:
                messages.error("Senha incorreta.")
        except Usuarios.DoesNotExist:
            messages.error(request, "Email não cadastrado.")

    return render(request, 'login.html')

# parte do CRUD
def anotacoes_view(request):
    user_id = request.session.get('usuario_id')
    if not user_id:
        return redirect('login')
    
    usuario = Usuarios.objects.get(id=user_id)

    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        conteudo = request.POST.get('conteudo')
        Anotacoes.objects.create(usuario=usuario, titulo=titulo, conteudo=conteudo)
        messages.success(request, "Nota Salva")

    notas = Anotacoes.objects.filter(usuario=usuario).order_by('-data_criacao')
    return render(request, 'anotacao.html', {'notas': notas, 'usuario': usuario})

def excluir_anotacao(request, pk):
    user_id = request.session.get('usuario_id')
    nota = get_object_or_404(Anotacoes, pk=pk, usuario_id=user_id)
    
    if request.method == 'POST':
        nota.delete()
        messages.success(request, "Nota excluída")
        return redirect('exibir_anotacoes')
    
    return render(request, 'confirmar_exclusao.html', {'nota': nota})

def editar_anotacao(request, pk):
    user_id = request.session.get('usuario_id')
    nota = get_object_or_404(Anotacoes, pk=pk, usuario_id=user_id)

    if request.method == 'POST':
        nota.titulo = request.POST.get('titulo')
        nota.conteudo = request.POST.get('conteudo')
        nota.save()
        messages.success(request, "Nota atualizada!")
        return redirect('exibir_anotacoes')

    return render(request, 'editar.html', {'nota': nota})

def logout_view(request):
    request.session.flush()
    return redirect('login')