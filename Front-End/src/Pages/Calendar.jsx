import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './caledar.css';
import { FiClock, FiBriefcase, FiTag } from 'react-icons/fi';
import { SlPresent } from 'react-icons/sl';
import { FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GoFileDirectory } from 'react-icons/go';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaGoogle } from "react-icons/fa";
import api from '../api'

const CATEGORY_COLORS = {
  LEMBRETE:    '#FFCC00',
  REUNIAO:     '#007AFF',
  EVENTO:      '#34C759',
  ANIVERSARIO: '#FF2D55',
  AVALIACAO:   '#AF52DE',
  GOOGLE:      '#EA4335',  // vermelho do Google
};

const CATEGORY_LABELS = {
  LEMBRETE:    'LEMBRETE',
  REUNIAO:     'REUNIÃO',
  EVENTO:      'EVENTO',
  ANIVERSARIO: 'ANIVERSÁRIO',
  AVALIACAO:   'AVALIAÇÃO',
  GOOGLE:      'GOOGLE AGENDA',
};


function Calendar() {
  const navigate = useNavigate();

  const handleGoogleConnect = async () =>{
    const response = await api.get(`api/google/login/?user_id=${userId}`);
    const { auth_url } = response.data;
  
    window.location.href = auth_url;
  };

  const [currentDate,    setCurrentDate]    = useState(new Date());
  const [events,         setEvents]         = useState([]);
  const [selectedDay,    setSelectedDay]    = useState(null);
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [googleConectado, setGoogleConectado] = useState(false);

  const [eventTitle,    setEventTitle]    = useState('');
  const [eventDesc,     setEventDesc]     = useState('');
  const [eventCategory, setEventCategory] = useState('EVENTO');
  const [eventTime,     setEventTime]     = useState('12:00');


  const userId = localStorage.getItem('user_id')

  useEffect(() => {
    if (!userId) return;

    api.get(`api/eventos/${userId}/`)
      .then(response => {
        const mappedEvents = response.data.map(ev => {
          if (ev.descricao && ev.descricao.startsWith('[GOOGLE]')) {
            return {
              ...ev,
              tipo: 'GOOGLE',
              descricao: ev.descricao.replace(/^\[GOOGLE\]\n?/, ''),
              origem: 'google'
            };
          }
          return ev;
        });
        setEvents(mappedEvents);
        if (mappedEvents.some(ev => ev.tipo === 'GOOGLE')) {
          setGoogleConectado(true);
        }
      })
      .catch(error => {
        console.error("Erro ao buscar eventos do backend:", error);
      });
  }, [userId]);

  // Detecta retorno do Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('google') === 'conectado') {
      setGoogleConectado(true);
      window.history.replaceState({}, '', '/calendar');
    }
  }, []);


  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth    = new Date(year, month, 1).getDay();
  const totalDays          = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      dayNumber: prevMonthTotalDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthTotalDays - i),
    });
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push({
      dayNumber: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      dayNumber: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  // Filtra eventos (os do Google Agenda agora vêm diretamente do backend)
  const filteredEvents = events.filter(ev =>
    activeCategory === 'TODOS' || ev.tipo === activeCategory
  );

  const getEventsForDay = (date) => {
    const key = date.toLocaleDateString('sv-SE');
    return filteredEvents.filter(ev => ev.data_inicio?.startsWith(key));
  };

  const handleDayClick = (day) => setSelectedDay(day);

  const openModal = () => {
    if (!selectedDay) return;
    setEventTitle('');
    setEventDesc('');
    setEventCategory('EVENTO');
    setEventTime('12:00');
    setShowAddModal(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if(!eventTitle.trim() || !selectedDay || !userId) return;

    const datePart = selectedDay.date.toLocaleDateString('sv-SE');

    const newEvent= { 
      titulo: eventTitle,
      descricao: eventDesc,
      tipo: eventCategory,
      data_inicio: `${datePart}T${eventTime}:00`,
      data_fim: null,
    };
    api.post(`api/eventos/${userId}/`, newEvent)
    .then(response => {
      setEvents([...events, response.data]);
      setShowAddModal(false);
    })
    .catch(error => {
      console.error("Erro ao salvar o compromisso no banco de dados", error);
    });
  };

  const handleDeleteEvent = (id) => {
    api.delete(`api/evento/${id}/`)
    .then(() => {
      setEvents(events.filter(ev => ev.id !== id));
    })
    .catch(error => { console.error("error ao deletar compromisso", error);
    });
  };

  const monthNames = [
    'JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO',
    'JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO',
  ];

  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay.date) : [];
  const today = new Date().toDateString();

  const categories = [
    { key: 'LEMBRETE',    label: 'LEMBRETE',    Icon: FiClock      },
    { key: 'REUNIAO',     label: 'REUNIÃO',     Icon: FiBriefcase  },
    { key: 'EVENTO',      label: 'EVENTO',      Icon: FiTag        },
    { key: 'ANIVERSARIO', label: 'ANIVERSÁRIO', Icon: SlPresent    },
    { key: 'AVALIACAO',   label: 'AVALIAÇÃO',   Icon: FiFileText   },
    { key: 'GOOGLE',      label: 'GOOGLE AGENDAS',      Icon: FaGoogle     },
  ];

  return (
    <div className="cal-container">

      <aside className="cal-sidebar">
        <div className="cal-logo">
          <span className="cal-logo-icon">⊹</span>
          <h1 className="cal-logo-text">LUMINOS</h1>
        </div>

        <div className="cal-btn-back" onClick={() => navigate('/home')}>
           <IoMdArrowRoundBack className="cal-nav-icon"/> VOLTAR
        </div>

        <nav className="cal-nav">
          <button
            className={`cal-nav-item ${activeCategory === 'TODOS' ? 'active' : ''}`}
            onClick={() => setActiveCategory('TODOS')}
          >
            <GoFileDirectory className="cal-nav-icon" />
            MOSTRAR TUDO
          </button>

          {categories.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={`cal-nav-item ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <Icon
                className="cal-nav-icon"
                style={{ color: activeCategory === key ? CATEGORY_COLORS[key] : undefined }}
              />
              {label}
            </button>
          ))}
        </nav>

        <button
          className={`cal-btn-google ${googleConectado ? 'conectado' : ''}`}
          onClick={handleGoogleConnect}
          disabled={googleConectado}
        >
          {googleConectado ? 'Google Agenda Conectado ✓' : 'Conectar Google Agenda'}
        </button>
      </aside>

      <main className="cal-main">

        <h1 className="cal-page-title">CALENDÁRIO</h1>
        <div className="cal-card">
          <div className="cal-month-nav">
            <button className="cal-month-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
              <FiChevronLeft />
            </button>
            <span className="cal-month-label">{monthNames[month]} {year}</span>
            <button className="cal-month-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
              <FiChevronRight />
            </button>
          </div>

          <div className="cal-weekdays">
            {['D','S','T','Q','Q','S','S'].map((d, i) => (
              <span key={i} className="cal-weekday">{d}</span>
            ))}
          </div>

          <div className="cal-grid">
            {days.map((day, idx) => {
              const dayEvents = getEventsForDay(day.date);
              const isToday    = day.date.toDateString() === today;
              const isSelected = selectedDay?.date.toDateString() === day.date.toDateString();

              return (
                <div key={idx} className="cal-cell" onClick={() => handleDayClick(day)}>
                  <button
                    className={[
                      'cal-day',
                      day.isCurrentMonth ? 'cur' : 'oth',
                      isToday    ? 'today'    : '',
                      isSelected ? 'selected' : '',
                    ].join(' ')}
                  >
                    {day.dayNumber}
                  </button>

                  {dayEvents.length > 0 && (
                    <div className="cal-dots">
                      {dayEvents.slice(0, 3).map(ev => (
                        <span
                          key={ev.id}
                          className="cal-dot"
                          style={{ backgroundColor: CATEGORY_COLORS[ev.tipo] }}
                          title={ev.titulo}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        
        {selectedDay && (
          <div className="cal-agenda">
            <div className="cal-agenda-header">
              <h2 className="cal-agenda-title">
                {selectedDay.date.toLocaleDateString('pt-BR', {
                  weekday: 'long', day: '2-digit', month: 'long',
                }).toUpperCase()}
              </h2>
              <button className="cal-btn-add" onClick={openModal}>
                + NOVO COMPROMISSO
              </button>
            </div>

            {selectedDayEvents.length === 0 ? (
              <p className="cal-no-events">Nenhum compromisso para este dia.</p>
            ) : (
              <ul className="cal-agenda-list">
                {selectedDayEvents.map(ev => (
                  <li
                    key={ev.id}
                    className="cal-agenda-item"
                    style={{ borderLeftColor: CATEGORY_COLORS[ev.tipo] }}
                  >
                    <div className="cal-agenda-item-info">
                      <span className="cal-agenda-time">
                        {ev.data_inicio.split('T')[1]?.slice(0, 5) || '12:00'}
                      </span>
                      <span
                        className="cal-agenda-cat"
                        style={{ color: CATEGORY_COLORS[ev.tipo] }}
                      >
                        {CATEGORY_LABELS[ev.tipo]}
                      </span>
                      <span className="cal-agenda-event-title">{ev.titulo}</span>
                      {ev.descricao && (
                        <span className="cal-agenda-desc">{ev.descricao}</span>
                      )}
                    </div>
                    <button className="cal-btn-delete" onClick={() => handleDeleteEvent(ev.id)}>
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {showAddModal && selectedDay && (
        <div className="cal-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="cal-modal" onClick={e => e.stopPropagation()}>

            <h2 className="cal-modal-title">NOVO COMPROMISSO</h2>
            <p className="cal-modal-subtitle">
              {selectedDay.date.toLocaleDateString('pt-BR')}
            </p>

            <form onSubmit={handleCreateEvent} className="cal-modal-form">

              <div className="cal-field">
                <label className="cal-label" htmlFor="evTitle">TÍTULO</label>
                <input
                  id="evTitle"
                  className="cal-input"
                  type="text"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  placeholder="Ex: Reunião de Software"
                  required
                />
              </div>

              <div className="cal-field">
                <label className="cal-label" htmlFor="evDesc">DESCRIÇÃO</label>
                <textarea
                  id="evDesc"
                  className="cal-input cal-textarea"
                  value={eventDesc}
                  onChange={e => setEventDesc(e.target.value)}
                  placeholder="Ex: Alinhamento de projeto no Teams"
                />
              </div>

              <div className="cal-row">
                <div className="cal-field">
                  <label className="cal-label" htmlFor="evCat">CATEGORIA</label>
                  <select
                    id="evCat"
                    className="cal-input"
                    value={eventCategory}
                    onChange={e => setEventCategory(e.target.value)}
                  >
                    <option value="EVENTO">Evento</option>
                    <option value="LEMBRETE">Lembrete</option>
                    <option value="REUNIAO">Reunião</option>
                    <option value="ANIVERSARIO">Aniversário</option>
                    <option value="AVALIACAO">Avaliação</option>
                  </select>
                </div>

                <div className="cal-field">
                  <label className="cal-label" htmlFor="evTime">HORÁRIO</label>
                  <input
                    id="evTime"
                    className="cal-input"
                    type="time"
                    value={eventTime}
                    onChange={e => setEventTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="cal-modal-actions">
                <button
                  type="button"
                  className="cal-btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  CANCELAR
                </button>
                <button type="submit" className="cal-btn-save">
                  SALVAR
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
