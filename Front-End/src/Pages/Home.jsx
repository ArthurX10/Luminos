import React from 'react'
import Side from '../components/Side'
import './Home.css'
import { useState, useEffect } from 'react'
import api from '../api';
import { CiCamera } from "react-icons/ci";
import { FiFileText } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoFunnelOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { FiFilePlus } from "react-icons/fi";
import { LuClipboardPen } from "react-icons/lu";
import { FiFile } from "react-icons/fi";  
import { FaLocationArrow } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";


function Home() {
  const [greeting, setGreeting] = useState('');
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [newBrief, setNewBrief] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [isSeachOpen, setIsSeatchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('acesso');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => (note.titulo && note.titulo.toLowerCase().includes(searchQuery.toLowerCase())) || (note.conteudo && note.conteudo.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setSelectedFolder('');
    setIsModalOpen(false);
  }

  const handleCreateNote = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    api.post(`api/notas/${userId}/`, {
      titulo: newTitle,
      conteudo: newDescription,
    })
      .then(response => {
        setNotes(prevNotes => [response.data, ...prevNotes]);
        setNewTitle('');
        setNewDescription('');
        setSelectedFolder('');

        setIsModalOpen(false);
      })
      .catch(error => console.log("Erro ao criar nota: ", error))
  }


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
        })
        .catch(error => console.error("Erro ao carregar os dados do usuário: ", error));

      api.get(`api/notas/${userId}/`)
        .then(response => {
          const ordenadas = response.data.sort((a, b) =>
            new Date(b.data_criacao) - new Date(a.data_criacao)
          );
          setNotes(ordenadas.slice(0, 4));
        })
        .catch(err => console.log(err));
    }
  }, []);


  return (

    <div className='home-container'>
      <Side notes={notes}
        onNewNote={() => setIsModalOpen(true)}
        onSearchOpen={() => setIsSeatchOpen(true)}
        onHistoryOpen={() => setIsHistoryOpen(true)}
      />

      <main className="home-content">
        {/* Criar uma função para trocar o conteúdo, (Bom dia, boa tarde, boa noite)*/}
        <div className="home-header">
          <h1 className="home-greeting">{greeting.toUpperCase()}, {userName.toUpperCase()}</h1>
        </div>

        <div className="home-section">
          <span className="home-section-title">Ultimas anotações</span>
          <div className="home-section-content">
            {notes.length > 0 ? (
              <div className="home-cards-grid">
                {notes.map((note) => (
                  <div key={note.id} className="note-card" style={{ borderLeft: `5px solid ${note.cor_fundo || '#007aff'}` }}>
                    <h3 className='note-card-title'>{note.titulo}</h3>
                    <p className='note-card-snippet'>{note.conteudo}</p>
                    <span className="note-card-date">{new Date(note.data_criacao).toLocaleDateString('pt-BR')}</span>

                  </div>
                ))}
              </div>) : (
              <p className="no-notes-message">Nenhuma anotação recente encontrada.</p>
            )}
          </div>
        </div>

      </main>

      {isModalOpen && (
        <div className='modal-overlay fade-in' onClick={() => setIsModalOpen(false)} >
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

              <div className="modal-form-group">
                <label>Etiquetas</label>
                <div className="label-selector-container">
                  <button type='button' className="add-label-btn"><span>+</span></button>
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

      {isSeachOpen && (
        <div className='modal-overlay fade-in' onClick={() => setIsSeatchOpen(false)}>
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

            <div className="seach-result-list" style={{ maxHeight: "250px", marginTop: "15px", overflowY: "auto" }}>
              {filteredNotes.length > 0 ? (filteredNotes.map((note) =>
              (<div key={note.id} className='search-result-item'>
                <span className="search-result-icon" >
                  <FiFileText color='#ffffff' />
                </span>
                <span className="search-result-title">{(note.titulo || 'Sem Título').toUpperCase()}</span>
              </div>
              ))) : (
                <p className="no-notes-message">Nenhuma anotação encontrada.</p>
              )}
            </div>


          </div>
        </div>
      )}

      {isHistoryOpen && (
        <div className="modal-overlay fade-in" onClick={() => setIsHistoryOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <h2 className="modal-title">HISTÓRICO</h2>
            <div className="history-filters">
              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'ACESSO'} ? 'active': ''}`}
                onClick={() => setHistoryFilter('ACESSO')}
              >
                <FaRegClock /> ACESSO
              </button>

              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'criação'} ? 'active': ''}`}
                onClick={() => setHistoryFilter('criação')}
              >
                <FiFilePlus /> criação
              </button>

              <button
                type="button"
                className={`history-filter-btn ${historyFilter === 'alteração'} ? 'active': ''}`}
                onClick={() => setHistoryFilter('alteração')}
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
                      <span>DIRETORIO {index + 1}</span>
                    </div>

                    <div className="history-col col-time">
                      <span>{index === 0 ? '5 min Atrás': index === 1 ? '2 horas atrás' : index === 2 ? '3 dias Atrás' : '1 Ano Atrás'}</span>
                    </div>

                    <div className="history-actions">
                      <button 
                        type="button"
                        className="history-action-btn edit-btn"
                        
                      ><FiEdit /></button>
                      <button
                      type="button"
                      className="history-action-btn delete-btn">
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </div>
                ))
              ):(
                <p className="no-history-message">Nenhum anotação encontrada.</p>
              )}

              </div>

            </div>
          </div>
      )}
    </div>
  )
}

export default Home
