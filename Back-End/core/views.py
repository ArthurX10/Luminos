from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Usuarios, Anotacoes, Etiquetas, ElementosVisuais, ConexoesLinhas, Notificacoes, Eventos

from .serializers import (
    AnotacaoSerializer, UsuarioSerializer, EtiquetaSerializer, 
    ElementoVisualSerializer, ConexaoLinhaSerializer, AnotacaoCompletaSerializer, 
    NotificacaoSerializer, EventoSerializer
)
from django.contrib.auth.hashers import check_password, make_password

# ROTAS DA API (REACT / FRONT-END)

@api_view(['POST'])
def api_cadastro(request):
    email = request.data.get('email')
    senha = request.data.get('senha') or request.data.get('password')
    
    if not email or not senha:
        return Response({"error": "E-mail e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

    if Usuarios.objects.filter(email=email).exists():
        return Response({"error": "E-mail já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)
        
    usuario = Usuarios.objects.create(email=email, senha_hash=make_password(senha))
    return Response({"message": "Usuário criado!"}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def api_login(request):
    email = request.data.get('email')
    senha = request.data.get('senha') or request.data.get('password')
    print(f"DEBUG LOGIN -> Email recebido: {email} | Senha recebida: {senha}")
    try:
        usuario = Usuarios.objects.get(email=email)
        
        if check_password(senha, usuario.senha_hash):
            return Response({
                "message": "Login realizado", 
                "user_id": usuario.id, 
                "email": usuario.email
            }, status=status.HTTP_200_OK)
            
        return Response({"error": "Senha incorreta."}, status=status.HTTP_401_UNAUTHORIZED)
    except Usuarios.DoesNotExist:
        return Response({"error": "Email não cadastrado."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def api_anotacoes(request, user_id):
    try:
        usuario = Usuarios.objects.get(id=user_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        etiqueta_id = request.query_params.get('etiqueta_id')
        apenas_importantes = request.query_params.get('apenas_importantes') == 'true'
        notas = Anotacoes.objects.filter(usuario=usuario).order_by('-importante', '-data_criacao')
        
        if apenas_importantes:
            notas = notas.filter(importante=True)

        if etiqueta_id:
            notas = notas.filter(etiquetas__id=etiqueta_id)
            
        serializer = AnotacaoCompletaSerializer(notas, many=True)
        return Response(serializer.data)
        
    if request.method == 'POST':
        serializer = AnotacaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=usuario)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def api_detalhe_anotacao(request, pk):
    try:
        nota = Anotacoes.objects.get(pk=pk)
    except Anotacoes.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        serializer = AnotacaoSerializer(nota, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        nota.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT'])
def api_perfil_usuario(request, user_id):
    try:
        usuario = Usuarios.objects.get(id=user_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ENDPOINTS DE ETIQUETAS
    
@api_view(['GET', 'POST'])
def api_gerenciar_etiquetas(request, user_id):
    if request.method == 'GET':
        etiquetas = Etiquetas.objects.filter(usuario_id=user_id)
        serializer = EtiquetaSerializer(etiquetas, many=True)
        return Response(serializer.data)
        
    if request.method == 'POST':
        data = request.data.copy()
        data['usuario'] = user_id
        serializer = EtiquetaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_vincular_etiqueta(request, nota_id):
    etiqueta_id = request.data.get('etiqueta_id')
    try:
        nota = Anotacoes.objects.get(pk=nota_id)
        etiqueta = Etiquetas.objects.get(pk=etiqueta_id)
        nota.etiquetas.add(etiqueta)
        return Response({"message": "Etiqueta vinculada!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- ENDPOINTS DO MAPA MENTAL / ESTRUTURAS ---

@api_view(['POST'])
def api_salvar_elemento_visual(request, nota_id):
    data = request.data.copy()
    data['anotacao'] = nota_id
    serializer = ElementoVisualSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_salvar_conexao(request, nota_id):
    data = request.data.copy()
    data['anotacao'] = nota_id
    serializer = ConexaoLinhaSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'GET'])
def api_alternar_importante(request, nota_id):
    try:
        nota = Anotacoes.objects.get(pk=nota_id)
        nota.importante = not nota.importante
        nota.save()
        if request.query_params.get('redirect') == 'true':
            return redirect('exibir_anotacoes')
        return Response({"id": nota.id, "importante": nota.importante}, status=status.HTTP_200_OK)
    except Anotacoes.DoesNotExist:
        return Response({"error": "Anotação não encontrada."}, status=status.HTTP_404_NOT_FOUND)

# --- SPRINT 05: NOTIFICAÇÕES ---

@api_view(['GET'])
def api_listar_notificacoes(request, user_id):
    try:
        Usuarios.objects.get(id=user_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    notificacoes = Notificacoes.objects.filter(usuario_id=user_id, lida=False).order_by('-criada_em')
    serializer = NotificacaoSerializer(notificacoes, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def api_marcar_notificacao_lida(request, notificacao_id):
    try:
        notificacao = Notificacoes.objects.get(pk=notificacao_id)
        notificacao.lida = True
        notificacao.save()
        return Response({"message": "Notificação marcada como lida."}, status=status.HTTP_200_OK)
    except Notificacoes.DoesNotExist:
        return Response({"error": "Notificação não encontrada."}, status=status.HTTP_404_NOT_FOUND)
    
# CRUD EVENTOS 18/06/2026

# LISTAR E CRIAR EVENTOS DO USUÁRIO
@api_view(['GET', 'POST'])
def api_gerenciar_eventos(request, user_id):
    if request.method == 'GET':
        # Traz os eventos ordenados pela data de início
        eventos = Eventos.objects.filter(usuario_id=user_id).order_by('data_inicio')
        serializer = EventoSerializer(eventos, many=True)
        return Response(serializer.data)
        
    if request.method == 'POST':
        data = request.data.copy()
        data['usuario'] = user_id # Vincula o evento ao usuário logado
        serializer = EventoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ATUALIZAR E DELETAR UM EVENTO ESPECÍFICO
@api_view(['PUT', 'DELETE'])
def api_detalhe_evento(request, pk):
    try:
        evento = Eventos.objects.get(pk=pk)
    except Eventos.DoesNotExist:
        return Response({"error": "Evento não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        serializer = EventoSerializer(evento, data=request.data, partial=True) # partial=True permite atualizar só alguns campos
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        evento.delete()
        return Response({"message": "Evento deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)

# VIEWS TRADICIONAIS (TEMPLATES DJANGO .HTML)

def cadastro_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        if Usuarios.objects.filter(email=email).exists():
            messages.error(request, "Este e-mail já está cadastrado.")
        else:
            Usuarios.objects.create(email=email, senha_hash=make_password(senha))
            messages.success(request, "Cadastro realizado! Agora faça login.")
            return redirect('login')
    return render(request, 'cadastro.html')

def login_view(request):
    if request.method == 'POST':
        email_form = request.POST.get('email')
        senha_form = request.POST.get('senha')
        try:
            usuario = Usuarios.objects.get(email=email_form)
            if check_password(senha_form, usuario.senha_hash):
                request.session['usuario_id'] = usuario.id
                return redirect('exibir_anotacoes')
            else:
                messages.error(request, "Senha incorreta.")
        except Usuarios.DoesNotExist:
            messages.error(request, "Email não cadastrado.")
    return render(request, 'login.html')

def anotacoes_view(request):
    user_id = request.session.get('usuario_id')
    if not user_id:
        return redirect('login')
        
    usuario = get_object_or_404(Usuarios, id=user_id)
    
    if request.method == 'POST':
        titulo = request.POST.get('titulo')
        conteudo = request.POST.get('conteudo')
        Anotacoes.objects.create(usuario=usuario, titulo=titulo, conteudo=conteudo)
        messages.success(request, "Nota Salva")
        
    notas = Anotacoes.objects.filter(usuario=usuario).order_by('-importante', '-data_criacao')
    return render(request, 'anotacao.html', {'notas': notas, 'usuario': usuario})

def excluir_anotacao(request, pk):
    user_id = request.session.get('usuario_id')
    if not user_id:
        return redirect('login')
        
    nota = get_object_or_404(Anotacoes, pk=pk, usuario_id=user_id)
    if request.method == 'POST':
        nota.delete()
        messages.success(request, "Nota excluída")
        return redirect('exibir_anotacoes')
    return render(request, 'confirmar_exclusao.html', {'nota': nota})

def editar_anotacao(request, pk):
    user_id = request.session.get('usuario_id')
    if not user_id:
        return redirect('login')
        
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

