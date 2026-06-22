import React from 'react'
import Side from '../components/Side'
import './Home.css'
import { useState, useEffect } from 'react'
import api from '../api';
import { CiCamera } from "react-icons/ci";
import { FiFileText } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoFunnelOutline } from "react-icons/io5";
import { FaRegClock, FaRegCalendar, FaLocationArrow } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";
import { LuClipboardPen } from "react-icons/lu";
import { FiFile } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { IoTvOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { RiText } from "react-icons/ri";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdSunny } from "react-icons/md";
import { GoFileDirectory } from "react-icons/go";
import { FaTag } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


function Home() {
  const [greeting, setGreeting] = useState('');
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [textSize, setTextSize] = useState('MEDIO')
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [showDailyQuote, setShowDailyQuote] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState('ÚNICA');
  const [historyFilter, setHistoryFilter] = useState('ACESSO');
  const [managerFilter, setManagerFilter] = useState('ANOTAÇÕES')
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userCreatedDate, setUserCreatedDate] = useState('');
  const [remeberDiary, setRemeberDiary] = useState(false);
  const [rememberCalendar, setRememberCalendar] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [events, setEvents] = useState([]);
  // Estado centralizado de etiquetas — compartilhado entre o modal CREATE_NOTE e o modal ETIQUETAS
  const [etiquetas, setEtiquetas] = useState([]);
  // Nome da nova etiqueta sendo digitada no modal ETIQUETAS
  const [novaEtiquetaNome, setNovaEtiquetaNome] = useState('');
  // Cor selecionada para a nova etiqueta (palete fixa)
  const [novaEtiquetaCor, setNovaEtiquetaCor] = useState('#007AFF');
  // IDs das etiquetas selecionadas para vincular à nota sendo criada
  const [etiquetasSelecionadas, setEtiquetasSelecionadas] = useState([]);
  const Navigate = useNavigate();

  // Paleta de cores disponíveis para etiquetas
  const CORES_ETIQUETA = ['#007AFF', '#34C759', '#FF3B30', '#AF52DE', '#FF9500', '#FF2D55', '#5AC8FA'];


  const filteredNotes = notes.filter(note => 
    (note.titulo && note.titulo.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (note.descricao && note.descricao.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (note.conteudo && note.conteudo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatRelativeTime = (dataString) => {
    if (!dataString) return 'Sem Registro';


    const date = new Date(dataString);

    const now = new Date();

    const diffMs = now - date;

    if (diffMs < 0) return "Agora mesmo";

    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Agora mesmo";

    if (diffMins < 60) return `Há ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);

    if (diffHours < 24) return `Há ${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);

    if (diffDays === 1) return "Ontem";

    if (diffDays <= 30) return `Há ${diffDays} dias`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "Há 1 mês";
    if (diffMonths < 12) return `Há ${diffMonths} meses`;
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears === 1) return "Há 1 ano";
    return `Há ${diffYears} anos`;

  };

  const getEventColor = (tipo) => {
    switch (tipo) {
      case 'LEMBRETE': return '#FF9500';
      case 'REUNIAO': return '#007AFF';
      case 'AVALIACAO': return '#FF3B30';
      case 'ANIVERSARIO': return '#AF52DE';
      case 'EVENTO': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const handleDeleteAccount = () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return;

    api.delete(`api/perfil/${userId}/`)
      .then(response => {
        alert("Conta deletada com sucesso!");
        localStorage.removeItem('user_id');
        setActiveModal(null);
        Navigate('/login');
      })
      .catch(error => console.error("Erro ao deletar conta: ", error))
  }

  const handleUpdateProfile = () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return;

    api.put(`api/perfil/${userId}/`, {
      nome: userName
    })
      .then(response => {
        alert("Perfil atualizado com sucesso!")
        setActiveModal(null);
      })
      .catch(error => console.error("Erro ao atualizar perfil: ", error))
  }

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setSelectedFolder('');
    setActiveModal(null);
  }

  const handlePasswordRedefinition = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Senhas não coincidem!');
      return;
    }

    if (newPassword.length < 6) {
      alert('Senha deve ter pelo menos 6 caracteres!');
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    api.put(`api/perfil/${userId}/`, {
      senha: newPassword
    })
      .then(response => {
        alert('Senha redefinida com sucesso!');
        setNewPassword('');
        setConfirmNewPassword('');
        setActiveModal('PROFILE');
      })
      .catch(error => {
        console.error("Erro ao redefinir senha: ", error);
        alert(error.response?.data?.error || 'Erro ao redefinir a senha.');
      });
  };

  const handleDeleteNote = (noteId) => {
    if (!window.confirm('Deseja realmente excluir esta anotação?'))
      return;

    api.delete(`api/notas/detalhe/${noteId}/`)
      .then(response => {
        alert('Anotação excluída com sucesso!');
        setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
      })
      .catch(error => {
        console.error('Erro ao deletar anotação: ', error);
        alert("Erro ao excluir a anotação");
      });
  };


  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find(n => n.id === noteId);
    if (!noteToEdit) return;

    setEditingNote(noteToEdit);
    setNewTitle(noteToEdit.titulo || '');
    setNewDescription(noteToEdit.descricao || '');
    setSelectedFolder(noteToEdit.diretorio || '');
    setActiveModal('EDIT_NOTE');
  }

  const handleCreateNote = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    api.post(`api/notas/${userId}/`, {
      titulo: newTitle,
      descricao: newDescription,
      conteudo: '',
      diretorio: selectedFolder || null,
    })
      .then(response => {
        setNotes(prevNotes => [response.data, ...prevNotes]);
        setNewTitle('');
        setNewDescription('');
        setSelectedFolder('');
        setActiveModal(null);
        Navigate(`/create/${response.data.id}`)
      })
      .catch(error => console.log("Erro ao criar nota: ", error))
  }


  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (!editingNote) return;

    api.put(`api/notas/detalhe/${editingNote.id}/`, {
      titulo: newTitle,
      descricao: newDescription,
      conteudo: editingNote.conteudo,
      diretorio: selectedFolder || null,
    })
      .then(response => {
        setNotes(prevNotes => prevNotes.map(n => n.id === editingNote.id ? response.data : n));
        setNewTitle('');
        setNewDescription('');
        setSelectedFolder('');
        setActiveModal('GESTAO');
      })
      .catch(error => {
        console.error('erro ao atualizar nota: ', error);
        alert('Erro ao atualizar a anotação')
      });
  };

  const handleNoteClick = (noteId) => {
    Navigate(`/create/${noteId}`);
  };


  const getGroupedNotesByLetter = () => {
    const grouped = notes.reduce((acc, note) => {
      const title = note.titulo || 'SEM TÍTULO';
      const firstLetter = title.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(note);
      return acc;
    }, {});
    return Object.keys(grouped).sort().reduce((acc, letter) => {
      acc[letter] = grouped[letter].sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));
      return acc;
    }, {});
  };


  const getNoteFolder = (note) => {
    return note.diretorio || 'SEM PASTA';
  };

  const getGroupedNotesByFolder = () => {
    const folders = {
      'PESSOAL': [],
      'TRABALHO / FACULDADE': [],
      'ESPORTES': [],
      'SEM PASTA': [],
    };
    notes.forEach(note => {
      const dir = note.diretorio;
      if (dir === 'pessoal') folders['PESSOAL'].push(note);
      else if (dir === 'trabalho') folders['TRABALHO / FACULDADE'].push(note);
      else if (dir === 'esporte') folders['ESPORTES'].push(note);
      else folders['SEM PASTA'].push(note);
    });
    return folders;
  };

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return 'Bom dia';
      } else if (hour < 18) {
        return 'Boa tarde';
      } else {
        return 'Boa noite';
      }
    };

    setGreeting(getGreeting());

    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      api.get(`api/perfil/${userId}/`)
        .then(response => {
          setUserName(response.data.nome || 'Usuário');
          setUserEmail(response.data.email || '');
          setUserCreatedDate(response.data.data_criacao || '')
        })
        .catch(error => console.error("Erro ao carregar os dados do usuário: ", error));

      api.get(`api/notas/${userId}/`)
        .then(response => {
          const ordenadas = response.data.sort((a, b) =>
            new Date(b.data_criacao) - new Date(a.data_criacao)
          );
          setNotes(ordenadas);
        })
        .catch(err => console.log(err));

      api.get(`api/eventos/${userId}/`)
        .then(response => {
          const ordenados = response.data.sort((a, b) =>
            new Date(a.data_inicio) - new Date(b.data_inicio)
          );
          setEvents(ordenados);
        })
        .catch(error => console.error("Erro ao carregar eventos: ", error));

      // Carrega as etiquetas do usuário para uso global no Home
      api.get(`api/etiquetas/${userId}/`)
        .then(response => setEtiquetas(response.data))
        .catch(error => console.error("Erro ao carregar etiquetas: ", error));
    }
  }, []);

  // Cria uma nova etiqueta e atualiza o estado global
  const handleCriarEtiqueta = () => {
    const userId = localStorage.getItem('user_id');
    if (!novaEtiquetaNome.trim() || !userId) return;

    api.post(`api/etiquetas/${userId}/`, { nome: novaEtiquetaNome.trim(), cor: novaEtiquetaCor })
      .then(response => {
        setEtiquetas(prev => [...prev, response.data]);
        setNovaEtiquetaNome('');
      })
      .catch(error => console.error('Erro ao criar etiqueta:', error));
  };

  // Exclui uma etiqueta e remove do estado global
  const handleExcluirEtiqueta = (etiquetaId) => {
    api.delete(`api/etiqueta/${etiquetaId}/`)
      .then(() => {
        setEtiquetas(prev => prev.filter(e => e.id !== etiquetaId));
        // Remove também da seleção ativa caso estivesse selecionada
        setEtiquetasSelecionadas(prev => prev.filter(id => id !== etiquetaId));
      })
      .catch(error => console.error('Erro ao excluir etiqueta:', error));
  };

  // Liga/desliga a seleção de uma etiqueta na criação de nota
  const toggleEtiquetaSelecionada = (etiquetaId) => {
    setEtiquetasSelecionadas(prev =>
      prev.includes(etiquetaId)
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
  };


  return (

    <div className='home-container'>
      <Side
        userName={userName}
        notes={notes}
        onNewNote={() => setActiveModal("CREATE_NOTE")}
        onProfileOpen={() => setActiveModal('PROFILE')}
        onSearchOpen={() => setActiveModal('SEARCH')}
        onHistoryOpen={() => setActiveModal('HISTORY')}
        onSettingsOpen={() => setActiveModal('SETTINGS')}
        onGestaoOpen={() => setActiveModal('GESTAO')}
        activeModal={activeModal}
      />

      <main className="home-content">
        <div className="home-header">
          <h1 className="home-greeting">{greeting.toUpperCase()}, {userName.toUpperCase()}</h1>
        </div>

        <div className="home-section">
          <span className="home-section-title">ÚLTIMAS CRIAÇÕES</span>
          <div className="home-section-content">
            {notes.length > 0 ? (
              <div className="home-cards-grid">
                {notes.slice(0, 4).map((note) => (
                  <div key={note.id} className="note-card" style={{ borderLeft: `5px solid ${note.cor_fundo || '#007aff'}` }} onClick={() => handleNoteClick(note.id)} >
                    <h3 className='note-card-title'>{note.titulo}</h3>
                    <p className='note-card-snippet'>{note.descricao || 'Sem descrição'}</p>
                    <span className="note-card-date">{new Date(note.data_criacao).toLocaleDateString('pt-BR')}</span>

                  </div>
                ))}
              </div>) : (
              <p className="no-notes-message">Nenhuma anotação recente encontrada.</p>
            )}
          </div>
        </div>

        <div className="home-section" style={{ marginTop: '40px' }}>
          <span className="home-section-title">LEMBRETES</span>
          <div className="home-section-content">
            {events.length > 0 ? (
              <div className="home-cards-grid">
                {events.slice(0, 4).map((event) => (
                  <div key={event.id} className="note-card" style={{ borderLeft: `5px solid ${getEventColor(event.tipo)}` }}>
                    <h3 className="note-card-title">{event.titulo}</h3>
                    <p className="note-card-snippet">{event.descricao || 'Sem descrição'}</p>
                    <span className="note-card-date">
                      {new Date(event.data_inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-notes-message">Nenhum lembrete ou evento encontrado.</p>
            )}
          </div>
        </div>

      </main>

      {activeModal === 'CREATE_NOTE' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)} >
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>
              Criação de anotação
            </h2>

            <form onSubmit={handleCreateNote} className='modal-form'>
              <div className='modal-row'>
                <div className="modal-form-group flex-3">
                  <label htmlFor="newTitle">NOME DA ANOTAÇÃO:</label>
                  <input
                    type="text"
                    id="newTitle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className='modal-form-group'>
                  <label>ICONE:</label>
                  <button className="icon-select-btn" type='button'>
                    <CiCamera size={30} />
                  </button>
                </div>
              </div>
              <div className="modal-form-group">
                <label htmlFor="newDescription">Descrição:</label>
                <textarea
                  className='modal-input-description'
                  id="newDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="newFolder">
                  Pasta:
                </label>
                <select
                  id="newFolder"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="">Selecione uma pasta...</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="trabalho">Trabalho/Faculdade</option>
                  <option value="esporte">Esporte</option>
                </select>
              </div>

              {/* Seção de etiquetas com seleção rápida e botão para gerenciar */}
              <div className="modal-form-group">
                <div className="etiqueta-label-row">
                  <label>ETIQUETAS</label>
                  <button
                    type='button'
                    className="btn-gerenciar-etiquetas"
                    onClick={() => setActiveModal('ETIQUETAS')}
                  >
                    + GERENCIAR
                  </button>
                </div>

                {/* Lista de etiquetas para selecionar rapidamente */}
                <div className="etiqueta-quick-list">
                  {etiquetas.length === 0 ? (
                    <span className="etiqueta-empty-hint">Nenhuma etiqueta criada. Clique em + GERENCIAR.</span>
                  ) : (
                    etiquetas.map(tag => (
                      <div
                        key={tag.id}
                        className={`etiqueta-quick-item ${etiquetasSelecionadas.includes(tag.id) ? 'selected' : ''}`}
                        onClick={() => toggleEtiquetaSelecionada(tag.id)}
                        style={{ '--tag-cor': tag.cor }}
                      >
                        <FaTag size={12} color={etiquetasSelecionadas.includes(tag.id) ? tag.cor : '#666'} />
                        <span>{tag.nome.toUpperCase()}</span>
                      </div>
                    ))
                  )}
                </div>

                <div className="modal-actions-container">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>cancelar</button>
                  <button type="submit" className="btn-save">Prosseguir</button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal centralizado de Gerenciamento de Etiquetas */}
      {activeModal === 'ETIQUETAS' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal('CREATE_NOTE')}>
          <div className='modal-container etiquetas-modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>ETIQUETAS</h2>

            {/* Formulário de criação de nova etiqueta */}
            <div className="etiqueta-criar-form">
              <div className="etiqueta-input-row">
                <input
                  type="text"
                  className="etiqueta-nome-input"
                  placeholder="Nome da etiqueta..."
                  value={novaEtiquetaNome}
                  onChange={(e) => setNovaEtiquetaNome(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCriarEtiqueta(); } }}
                  maxLength={30}
                />
                <button
                  type='button'
                  className="btn-criar-etiqueta"
                  onClick={handleCriarEtiqueta}
                  disabled={!novaEtiquetaNome.trim()}
                >
                  CRIAR
                </button>
              </div>

              {/* Palete de cores para a nova etiqueta */}
              <div className="etiqueta-cor-picker">
                <span className="etiqueta-cor-label">COR:</span>
                {CORES_ETIQUETA.map(cor => (
                  <div
                    key={cor}
                    className={`etiqueta-cor-dot ${novaEtiquetaCor === cor ? 'selecionada' : ''}`}
                    style={{ backgroundColor: cor }}
                    onClick={() => setNovaEtiquetaCor(cor)}
                  />
                ))}
              </div>
            </div>

            <div className="etiqueta-divider" />

            {/* Lista de etiquetas existentes */}
            <div className="etiquetas-lista">
              {etiquetas.length === 0 ? (
                <p className="etiqueta-empty-hint">Nenhuma etiqueta criada ainda.</p>
              ) : (
                etiquetas.map(tag => (
                  <div key={tag.id} className="etiqueta-list-item">
                    <div className="etiqueta-list-info">
                      <span className="etiqueta-cor-preview" style={{ backgroundColor: tag.cor }} />
                      <FaTag size={14} color={tag.cor} />
                      <span className="etiqueta-list-nome">{tag.nome.toUpperCase()}</span>
                    </div>
                    <button
                      type='button'
                      className="btn-excluir-etiqueta"
                      onClick={() => handleExcluirEtiqueta(tag.id)}
                      title="Excluir etiqueta"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="etiqueta-modal-footer">
              <button
                type='button'
                className="btn-voltar-criar-nota"
                onClick={() => setActiveModal('CREATE_NOTE')}
              >
                ← VOLTAR
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'SEARCH' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Pesquisar Anotação</h2>
            <div className="search-bar-container">
              <FaMagnifyingGlass size={24} color='#ffffff' />
              <input
                className='search-input-field'
                type="text"
                placeholder='Digite o nome da anotação'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <IoFunnelOutline size={24} color='#ffffff' style={{ cursor: 'pointer' }} />
            </div>

            <div className="recent-search">
              {searchQuery ? "RESULTADO" : "RECENTES"}
            </div>

            <div className="search-result-list">
              {filteredNotes.length > 0 ? (filteredNotes.map((note) =>
              (<div
                key={note.id}
                className='search-result-item'
                style={{ cursor: 'pointer' }}
                onClick={() => { setActiveModal(null); handleNoteClick(note.id); }}
              >
                <span className="search-result-icon">
                  <FiFileText color='#ffffff' />
                </span>
                <div className="search-result-info">
                  <span className="search-result-title">{(note.titulo || 'Sem Título').toUpperCase()}</span>
                  <span className="search-result-folder">
                    {note.diretorio === 'pessoal' ? 'PESSOAL'
                      : note.diretorio === 'trabalho' ? 'TRABALHO / FACULDADE'
                        : note.diretorio === 'esporte' ? 'ESPORTES'
                          : 'SEM PASTA'}
                  </span>
                </div>
              </div>
              ))) : (
                <p className="no-notes-message">Nenhuma anotação encontrada.</p>
              )}
            </div>


          </div>
        </div>
      )}

      {activeModal === 'HISTORY' && (
        <div className="modal-overlay fade-in" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <h2 className="modal-title">HISTÓRICO</h2>
            <div className="history-filters">
              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'ACESSO' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('ACESSO')}
              >
                <FaRegClock /> ACESSO
              </button>

              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'CRIAÇÃO' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('CRIAÇÃO')}
              >
                <FiFilePlus /> criação
              </button>

              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'ALTERAÇÃO' ? 'active' : ''}`}
                onClick={() => setHistoryFilter('ALTERAÇÃO')}
              >
                <LuClipboardPen /> alteração
              </button>
            </div>

            <div className="history-table-header">
              <div className="history-col col-name">
                <FiFile /> NOME DA ANOTAÇÃO
              </div>
              <div className="history-col col-loc">
                <FaLocationArrow />LOCALIZAÇÃO
              </div>
              <div className="history-col col-time">
                <FaRegClock /> ULTIMO ACESSO
              </div>
            </div>

            <div className="history-rows-list">
              {notes.length > 0 ? (notes.map((note, index) => (
                <div key={note.id} className="history-row-item">
                  <div className="history-col col-name">
                    <FiFileText className="row-icon" />
                    <span>{(note.titulo || 'Sem Título').toUpperCase()}</span>
                  </div>

                  <div className="history-col col-loc">
                    <span>
                      {note.diretorio === 'pessoal' ? 'PESSOAL'
                        : note.diretorio === 'trabalho' ? 'TRABALHO / FACULDADE'
                          : note.diretorio === 'esporte' ? 'ESPORTES'
                            : 'SEM PASTA'}
                    </span>
                  </div>

                  <div className="history-col col-time">
                    <span>{formatRelativeTime(note.data_criacao)}</span>
                  </div>

                  <div className="history-actions">
                    <div
                      style={{ color: '#ffffff' }}
                      cursor='pointer'
                      onClick={() => handleEditNote(note.id)}
                      type="button"
                      className="history-action-btn edit-btn"

                    ><FiEdit />
                    </div>

                    <div
                      style={{ cursor: 'pointer', color: '#ffffff' }}
                      onClick={() => handleDeleteNote(note.id)}
                      type="button"
                      className="history-action-btn delete-btn">
                      <FaRegTrashCan />
                    </div>
                  </div>
                </div>
              ))
              ) : (
                <p className="no-history-message">Nenhum anotação encontrada.</p>
              )}

            </div>

          </div>
        </div>
      )}

      {activeModal === 'SETTINGS' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container settings-modal-container' onClick={(e) => e.stopPropagation()} >
            <h2 className="modal-title">CONFIGURAÇÕES</h2>
            <div className='settings-options-list'>
              <div className='settings-option-item' onClick={() => setActiveModal('PROFILE')}>
                <FaRegUser size={22} />
                <span>Painel do Usuário</span>
              </div>

              <div className='settings-option-item' onClick={() => setActiveModal('PERSONALIZAR')}>
                <IoTvOutline size={22} />
                <span>Personalizar experiência</span>
              </div>

              <div className='settings-option-item' onClick={() => setActiveModal('NOTIFICAÇÕES')}>
                <FaRegBell size={22} />
                <span>Notificações</span>
              </div>

              <div className='settings-option-item' onClick={() => setActiveModal('SOBRE')}>
                <IoMdInformationCircleOutline size={22} />
                <span>Sobre o luminos</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'PROFILE' && (
        <div className="modal-overlay fade-in" onClick={() => setActiveModal(null)}>
          <div className='modal-container profile-modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>PAINEL DE USUÁRIO</h2>
            <div className="profile-header-section">
              <div className='profile-avatar-circle'>
                <FaRegUser size={36} color="#ffffff" />
              </div>
              <div className="profile-username-group">
                <h2>Usuário:</h2>
                <input
                  type='text'
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className='profile-username-input'
                />
              </div>
            </div>

            <div className='profile-info-fields'>
              <div className='profile-info-row'>
                <label>E-MAIL</label>
                <span className='profile-info-value'>
                  {userEmail.toUpperCase()}</span>
              </div>

              <div className='profile-info-row profile-password-row'>
                <div>
                  <label>SENHA</label>
                  <span className='profile-info-value'>GERENCIE SUAS SENHAS</span>
                </div>
                <button type='button' className='btn-change-password' onClick={() => setActiveModal('REDEFINIR-SENHA')}>ALTERAR SENHA</button>
              </div>

              <div className="profile-info-row">
                <label>USUÁRIO DESDE:</label>
                <span className='profile-info-value'>
                  {userCreatedDate ? new Date(userCreatedDate).toLocaleDateString('pt-BR') : 'DD DE MM AAAA'}
                </span>
              </div>
            </div>

            <div className="profile-actions-row">
              <button type="button" className='btn-confirm-changes' onClick={handleUpdateProfile}>
                CONFIRMAR ALTERAÇÕES
              </button>

              <button type="button" className='btn-delete-account' onClick={() => setActiveModal('DELETE-ACCOUNT')}>
                DELETAR MINHA CONTA
              </button>
            </div>

          </div>
        </div>
      )}


      {activeModal === 'DELETE-ACCOUNT' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container delete-account-modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title' style={{ color: "#FFE100" }}>ATENÇÃO!!!</h2>

            <div className='delete-account-content'>
              <p>Ao continuar, sua <span>conta e todas as anotações </span>inculadas a ela serão <span>apagadas permanentemente.</span> Esses dados não poderão ser restaurados depois da exclusão.</p>

            </div>

            <div className='delete-actions-row'>
              <button
                type='button' className='btn-delete-account' onClick={handleDeleteAccount}
              >
                DELETAR CONTA
              </button>

              <button
                type='button' className='btn-cancelar-delete-account' onClick={() => setActiveModal(null)}
              >
                CANCELAR
              </button>
            </div>

          </div>
        </div>

      )}


      {activeModal === 'PERSONALIZAR' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container experience-modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>PERSONALIZAR EXPERIÊNCIA</h2>
            <div className='experience-options-list'>


              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <RiText size={24} color='#ffffff' />
                  <span>TAMANHO DE TEXTO</span>
                </div>
                <div className='text-size-pills'>
                  {['PEQUENO', 'MÉDIO', 'GRANDE'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={textSize === size ? 'active' : ''}
                      onClick={() => setTextSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>


              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <GoDeviceCameraVideo size={24} color='#ffffff' />
                  <span>REDUZIR AS ANIMAÇÕES</span>
                </div>
                <div
                  className={`toggle-switch ${reduceAnimations ? 'active' : ''}`}
                  onClick={() => setReduceAnimations(!reduceAnimations)}
                >
                  <div className='toggle-knob'></div>
                </div>
              </div>

              {/* Exibir Frase do Dia */}
              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <MdSunny size={24} color='#ffffff' />
                  <span>EXIBIR FRASE DO DIA</span>
                </div>
                <div
                  className={`toggle-switch ${showDailyQuote ? 'active' : ''}`}
                  onClick={() => setShowDailyQuote(!showDailyQuote)}
                >
                  <div className='toggle-knob'></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {activeModal === 'NOTIFICAÇÕES' && (
        <div className="modal-overlay fade-in" onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>NOTIFICAÇÕES</h2>

            <div className='experience-options-list'>


              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <FaRegClock size={24} color='#ffffff' />
                  <span>LEMBRETE DE ATIVIDADES DIÁRIOS</span>
                </div>
                <div
                  className={`toggle-switch ${remeberDiary ? 'active' : ''}`}
                  onClick={() => setRemeberDiary(!remeberDiary)}
                >
                  <div className='toggle-knob'></div>
                </div>
              </div>


              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <FaRegBell size={24} color='#ffffff' />
                  <span>FRÊQUENCIA DOS LEMBRETES</span>
                </div>
                <div className='text-size-pills'>
                  {['ÚNICA', '2X', '3X'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      className={notificationFrequency === freq ? 'active' : ''}
                      onClick={() => setNotificationFrequency(freq)}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lembretes do Calendário */}
              <div className='experience-option-item'>
                <div className='experience-label-group'>
                  <FaRegCalendar size={24} color='#ffffff' />
                  <span>LEMBRETES DO CALENDÁRIO</span>
                </div>
                <div
                  className={`toggle-switch ${rememberCalendar ? 'active' : ''}`}
                  onClick={() => setRememberCalendar(!rememberCalendar)}
                >
                  <div className='toggle-knob'></div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}


      {activeModal === 'SOBRE' && (
        <div className="modal-overlay fade-in" onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>SOBRE O LUMINOS</h2>
            <div className="about-content">
              <p>O Luminos é uma ferramenta de gestão pessoal desenvolvida como projeto da disciplina de Engenharia de Software do 5º semestre do curso de Bacharelado em Ciência da Computação do IFCE Campus Tianguá.</p>
              <p>A disciplina é ministrada pela professora Cynthia Pinheiro Santiago. O projeto foi desenvolvido pela equipe composta por David Lucas Rodrigues Feitosa, João Arthur Rodrigues Pontes, João Igor de Sousa Ferro, José Gabriel Soares dos Santos e Vinicius Rolim Aguiar Ibiapina.</p>
              <p>O objetivo do Luminos é oferecer uma plataforma simples, intuitiva e organizada para auxiliar usuários na gestão de anotações, tarefas e informações pessoais, promovendo maior clareza mental e produtividade no dia a dia.</p>
            </div>
          </div>

        </div>
      )}


      {activeModal === 'REDEFINIR-SENHA' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>ALTERAR SENHA</h2>

            <form className="auth-form" onSubmit={handlePasswordRedefinition}>

              <div className="central-card fade-in">
                <div className="form-group relative-group">
                  <label htmlFor="password">DIGITE A SUA NOVA SENHA: </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Digite a senha Desejada"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group relative-group">
                  <label htmlFor="confirmPassword">CONFIRME SUA SENHA:</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirme a senha"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="submit-container">
                  <button type="submit" className="btn-primary btn-capsule">REDEFINIR</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {activeModal === 'GESTAO' && (
        <div className='modal-overlay fade-in' onClick={() => setActiveModal(null)}>
          <div className='modal-container' onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <h2 className='modal-title'>GESTÃO</h2>
            <div className='manager-filters'>
              <button
                type='button'
                className={`manager-filter-btn ${managerFilter === 'ANOTAÇÕES' ? 'active' : ''}`}
                onClick={() => setManagerFilter('ANOTAÇÕES')}
              >
                <FiFileText />
                ANOTAÇÕES
              </button>
              <button
                type='button'
                className={`manager-filter-btn ${managerFilter === 'PASTAS' ? 'active' : ''}`}
                onClick={() => setManagerFilter('PASTAS')}
              >
                <GoFileDirectory />
                PASTAS
              </button>
            </div>
            <div className="manager-divider"></div>
            <div className='manager-rows-list'>
              {managerFilter === 'ANOTAÇÕES' ? (
                Object.keys(getGroupedNotesByLetter()).length > 0 ? (
                  Object.entries(getGroupedNotesByLetter()).map(([letter, items]) => (
                    <div key={letter} className="manager-group-container">
                      <div className="manager-letter-header">{letter}</div>
                      <div className="manager-group-items">
                        {items.map(note => (
                          <div key={note.id} className="manager-note-item">
                            <div className="manager-note-info" style={{ cursor: 'pointer' }} onClick={() => { setActiveModal(null); handleNoteClick(note.id); }}>
                              <FiFileText className="manager-note-icon" />
                              <span className="manager-note-title">{(note.titulo || 'Sem Título').toUpperCase()}</span>
                            </div>
                            <div className="manager-note-actions">
                              <button
                                type="button"
                                className="manager-action-btn edit-btn"
                                onClick={() => handleEditNote(note.id)}
                                title="Editar"
                              >
                                <FiEdit />
                              </button>
                              <button
                                type="button"
                                className="manager-action-btn delete-btn"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Excluir"
                              >
                                <FaRegTrashCan />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-history-message">Nenhuma anotação encontrada.</p>
                )
              ) : (
                Object.entries(getGroupedNotesByFolder()).map(([folder, items]) => (
                  <div key={folder} className="manager-group-container">
                    <div className="manager-folder-header">
                      <GoFileDirectory size={22} style={{ marginRight: '8px', flexShrink: 0 }} />
                      {folder}
                    </div>
                    <div className="manager-group-items">
                      {items.length > 0 ? (
                        items.map(note => (
                          <div key={note.id} className="manager-note-item">
                            <div className="manager-note-info" style={{ cursor: 'pointer' }} onClick={() => { setActiveModal(null); handleNoteClick(note.id); }}>
                              <FiFileText className="manager-note-icon" />
                              <span className="manager-note-title">{(note.titulo || 'Sem Título').toUpperCase()}</span>
                            </div>
                            <div className="manager-note-actions">
                              <button
                                type="button"
                                className="manager-action-btn edit-btn"
                                onClick={() => handleEditNote(note.id)}
                                title="Editar"
                              >
                                <FiEdit />
                              </button>
                              <button
                                type="button"
                                className="manager-action-btn delete-btn"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Excluir"
                              >
                                <FaRegTrashCan />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="no-history-message" style={{ margin: '10px 15px', textAlign: 'left' }}>Nenhuma anotação nesta pasta.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'EDIT_NOTE' && (
        <div className='modal-overlay fade-in' onClick={() => { setActiveModal(null); setEditingNote(null); }} >
          <div className='modal-container' onClick={(e) => e.stopPropagation()}>
            <h2 className='modal-title'>Editar Anotação</h2>
            <form onSubmit={handleUpdateNote} className='modal-form'>
              <div className='modal-row'>
                <div className="modal-form-group flex-3">
                  <label htmlFor="editTitle">NOME DA ANOTAÇÃO:</label>
                  <input
                    type="text"
                    id="editTitle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-form-group">
                <label htmlFor="editDescription">DESCRIÇÃO:</label>
                <textarea
                  className='modal-input-description'
                  id="editDescription"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="editFolder">PASTA:</label>
                <select
                  id="editFolder"
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value)}
                >
                  <option value="">SEM PASTA</option>
                  <option value="pessoal">PESSOAL</option>
                  <option value="trabalho">TRABALHO/FACULDADE</option>
                  <option value="esporte">ESPORTES</option>
                </select>
              </div>
              <div className="modal-actions-container">
                <button type="button" className="btn-cancel" onClick={() => { setActiveModal('GESTAO'); setEditingNote(null); }}>cancelar</button>
                <button type="submit" className="btn-save">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  )
}

export default Home;
