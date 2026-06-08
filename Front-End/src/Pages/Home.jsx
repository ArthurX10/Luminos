import React from 'react'
import Side from '../components/Side'
import './Home.css'
import { useState, useEffect } from 'react'
import api from '../api';


function Home() {
  const [greeting, setGreeting] = useState('');
  const [notes, setNotes] = useState([]);
  const [userName, setUserName] = useState('');

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
      <Side notes={notes} />
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
                  <div key={note.id} className="note-card" style = {{borderLeft: `5px solid ${note.cor_fundo || '#007aff'}`}}>
                    <h3 className='note-card-title'>{note.titulo}</h3>
                    <p className='note-card-snippet'>{note.conteudo}</p>
                    <span className="note-card-date">{new Date(note.data_criacao).toLocaleDateString('pt-BR')}</span>

                  </div>
                ))}
              </div> ) : (
              <p className="no-notes-message">Nenhuma anotação recente encontrada.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}

export default Home
