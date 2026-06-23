import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

# Permite OAuth via HTTP em desenvolvimento local (remover em produção)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Usuarios, Anotacoes, Etiquetas, ElementosVisuais, ConexoesLinhas, Notificacoes, Eventos
from googleapiclient.discovery import build
import google.oauth2.credentials
import json


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
    return Response({"message": "Usuário criado!", "user_id": usuario.id, "email": usuario.email}, status=status.HTTP_201_CREATED)

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
        diretorio = request.query_params.get('diretorio')
        notas = Anotacoes.objects.filter(usuario=usuario).order_by('-importante', '-data_atualizacao', '-data_criacao')
        
        if apenas_importantes:
            notas = notas.filter(importante=True)

        if etiqueta_id:
            notas = notas.filter(etiquetas__id=etiqueta_id)

        if diretorio:
            notas = notas.filter(diretorio=diretorio)
            
        serializer = AnotacaoCompletaSerializer(notas, many=True)
        return Response(serializer.data)
        
    if request.method == 'POST':
        serializer = AnotacaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(usuario=usuario)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ADICIONADO: Suporte ao método GET para permitir que o front-end carregue os detalhes de uma anotação existente
@api_view(['GET', 'PUT', 'DELETE'])
def api_detalhe_anotacao(request, pk):
    try:
        nota = Anotacoes.objects.get(pk=pk)
    except Anotacoes.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'GET':
        serializer = AnotacaoSerializer(nota)
        return Response(serializer.data)
        
    if request.method == 'PUT':
        # NOTA: Adicionado partial=True para permitir atualizações parciais pelo Front-End.
        # Isso impede que campos não especificados no payload da requisição (como 'diretorio',
        # 'cor_fundo', 'importante', etc.) sejam limpos/sobrescritos com valor nulo no banco.
        serializer = AnotacaoSerializer(nota, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        nota.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'PUT', 'DELETE'])
def api_perfil_usuario(request, user_id):
    try:
        usuario = Usuarios.objects.get(id=user_id)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)

    if request.method == 'PUT':
        # ADICIONADO: Suporte para atualizar a senha do usuário no painel de configurações.
        # Como o UsuarioSerializer não serializa a senha por questões de segurança,
        # capturamos a nova senha pura, validamos o comprimento mínimo,
        # geramos o hash seguro com make_password() e salvamos diretamente no modelo.
        senha = request.data.get('senha')
        if senha:
            if len(senha) < 6:
                return Response({"error": "A senha deve ter pelo menos 6 caracteres."}, status=status.HTTP_400_BAD_REQUEST)
            usuario.senha_hash = make_password(senha)
            usuario.save()

        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        usuario.delete()
        return Response({"message": "Usuário deletado com sucesso!"}, status=status.HTTP_204_NO_CONTENT)
    
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

# ADICIONADO: Endpoint para excluir uma etiqueta específica pelo seu ID.
# Utilizado pelo modal de gerenciamento de etiquetas no Front-End (Home.jsx e Create.jsx).
@api_view(['DELETE'])
def api_detalhe_etiqueta(request, etiqueta_id):
    try:
        etiqueta = Etiquetas.objects.get(pk=etiqueta_id)
    except Etiquetas.DoesNotExist:
        return Response({"error": "Etiqueta não encontrada."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        etiqueta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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

@api_view(['POST'])
def api_desvincular_etiqueta(request, nota_id):
    etiqueta_id = request.data.get('etiqueta_id')
    try:
        nota = Anotacoes.objects.get(pk=nota_id)
        etiqueta = Etiquetas.objects.get(pk=etiqueta_id)
        nota.etiquetas.remove(etiqueta)
        return Response({"message": "Etiqueta desvinculada!"}, status=status.HTTP_200_OK)
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

@api_view(['PUT', 'DELETE'])
def api_detalhe_elemento(request, pk):
    try:
        elemento = ElementosVisuais.objects.get(pk=pk)
    except ElementosVisuais.DoesNotExist:
        return Response({"error": "Elemento visual não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        serializer = ElementoVisualSerializer(elemento, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        elemento.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT', 'DELETE'])
def api_detalhe_conexao(request, pk):
    try:
        conexao = ConexoesLinhas.objects.get(pk=pk)
    except ConexoesLinhas.DoesNotExist:
        return Response({"error": "Conexão de linha não encontrada."}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PUT':
        serializer = ConexaoLinhaSerializer(conexao, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    if request.method == 'DELETE':
        conexao.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

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



#Criado pelo João Arthur
# Integração com o google 
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/google/callback/")
GOOGLE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token"
SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

# Passo A: Redireciona o usuário para o Google (sem PKCE)
@api_view(['GET'])
def google_auth_redirect(request):
    from requests_oauthlib import OAuth2Session
    user_id = request.GET.get('user_id', '')
    oauth = OAuth2Session(
        client_id=GOOGLE_CLIENT_ID,
        redirect_uri=GOOGLE_REDIRECT_URI,
        scope=SCOPES,
    )
    auth_url, state = oauth.authorization_url(
        GOOGLE_AUTH_URI,
        access_type="offline",
        prompt="consent",
    )
    
    # Codifica o user_id junto com o state para recuperar no callback
    state_with_user = f"{state}:{user_id}"
    auth_url = auth_url.replace(f"state={state}", f"state={state_with_user}")
    
    request.session['oauth_state'] = state_with_user
    return Response({"auth_url": auth_url})

# Passo B: Google retorna aqui depois da permissão
@api_view(['GET'])
def google_auth_callback(request):
    import json
    from requests_oauthlib import OAuth2Session
    from django.utils.dateparse import parse_datetime
    from django.utils import timezone

    # Usa o state da URL diretamente (evita problema de sessão cross-origin)
    state_param = request.GET.get('state', '')
    user_id = None
    if ':' in state_param:
        state_oauth, user_id_str = state_param.split(':', 1)
        try:
            user_id = int(user_id_str)
        except ValueError:
            pass
    else:
        state_oauth = state_param

    oauth = OAuth2Session(
        client_id=GOOGLE_CLIENT_ID,
        redirect_uri=GOOGLE_REDIRECT_URI,
        state=state_param,
    )

    # Monta a URL completa do callback para o fetch_token usar
    full_callback_url = request.build_absolute_uri()

    token = oauth.fetch_token(
        GOOGLE_TOKEN_URI,
        client_secret=GOOGLE_CLIENT_SECRET,
        authorization_response=full_callback_url,
        include_client_id=True,
    )

    # Busca os eventos do Google Calendar (Agenda Principal)
    service = build('calendar', 'v3', credentials=google.oauth2.credentials.Credentials(
        token=token['access_token']
    ))
    events_result = service.events().list(calendarId='primary', maxResults=30).execute()
    items = events_result.get('items', [])

    # Busca também os feriados brasileiros (Google Agenda Feriados)
    try:
        import datetime
        time_min = (datetime.datetime.utcnow() - datetime.timedelta(days=60)).isoformat() + 'Z'
        holidays_result = service.events().list(
            calendarId='pt.brazilian#holiday@group.v.calendar.google.com',
            timeMin=time_min,
            singleEvents=True,
            orderBy='startTime',
            maxResults=30
        ).execute()
        holidays = holidays_result.get('items', [])
        items = items + holidays
    except Exception as e:
        print("Erro ao buscar feriados da agenda do Google:", e)

    if user_id:
        # Remove eventos do Google anteriores desse usuário para não duplicar
        Eventos.objects.filter(usuario_id=user_id, tipo='GOOGLE').delete()
        Eventos.objects.filter(usuario_id=user_id, descricao__startswith='[GOOGLE]').delete()

        # Salva os novos eventos vindos do Google Agenda
        for ev in items:
            start_raw = ev.get('start', {})
            start_str = start_raw.get('dateTime') or start_raw.get('date')
            start_dt = None
            if start_str:
                if len(start_str) == 10:  # YYYY-MM-DD (Evento de dia inteiro)
                    start_dt = parse_datetime(f"{start_str}T00:00:00Z")
                else:
                    start_dt = parse_datetime(start_str)
            
            if not start_dt:
                start_dt = timezone.now()

            end_raw = ev.get('end', {})
            end_str = end_raw.get('dateTime') or end_raw.get('date')
            end_dt = None
            if end_str:
                if len(end_str) == 10:  # YYYY-MM-DD
                    end_dt = parse_datetime(f"{end_str}T23:59:59Z")
                else:
                    end_dt = parse_datetime(end_str)

            # Para burlar a constraint do banco 'eventos_tipo_check', salvamos como 'EVENTO'
            # e colocamos o marcador '[GOOGLE]' na descrição para o front-end reconhecer.
            desc = ev.get('description') or ''
            google_desc = f"[GOOGLE]\n{desc}" if desc else "[GOOGLE]"

            Eventos.objects.create(
                usuario_id=user_id,
                titulo=ev.get('summary') or 'Sem título',
                descricao=google_desc,
                tipo='EVENTO',
                data_inicio=start_dt,
                data_fim=end_dt
            )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    return redirect(f"{frontend_url}/calendar?google=conectado")


# Endpoint para o React buscar os eventos do Google salvos na sessão
@api_view(['GET'])
def google_eventos(request):
    import json
    eventos_json = request.session.get('google_eventos', '[]')
    return Response({"eventos_google": json.loads(eventos_json)})