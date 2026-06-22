import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo'
import './Side.css'
import { GrHomeRounded } from "react-icons/gr";
import { GoFileDirectory } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { FiAlignJustify } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoAddOutline } from "react-icons/io5";
import api from '../api'



function Side({userName, notes = [], onNewNote, onProfileOpen, onSearchOpen, onHistoryOpen, onSettingsOpen, onGestaoOpen }) {

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/home');
  };


  const handleCalendarClick = () =>{
     navigate('/calendar');
  }


  
  return (
    <div className="side-container">
      <div className="side-header">
        <Logo></Logo> 
        <h1>LUMINOS</h1>
      </div>
        
       <nav>
        <ul className='side-nav-list'>
          <li className="side-nav-item" onClick={onSearchOpen} style={{ cursor: 'pointer' }}>
            <FaMagnifyingGlass />
            Pesquisa
          </li  >
          <li className='side-nav-item' onClick={handleHomeClick} style={{cursor: 'pointer'}}>
            <GrHomeRounded />
               Home   
          </li>
          <li className="side-nav-item" onClick={onGestaoOpen} style={{cursor: 'pointer'}}>
            <GoFileDirectory />
              Gestão
          </li>
          <li className="side-nav-item" onClick={handleCalendarClick} style={{cursor: 'pointer'}}>
            <CiCalendar />
              Calendário
          </li>
        </ul>
       </nav>

       <div className="side-add" onClick={onNewNote}>
        <IoAddOutline />
        NOVA ANOTAÇÃO
       </div>


      <div>
        <ul className="side-recent-header">
          <li className="side-nav-item">
            <FiAlignJustify />
            Recentes
          </li>
          {notes.length > 0 ? (
            notes.slice(0, 4).map((note) => (
              <li 
                key={note.id}
                className='side-recent-itens'
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/create/${note.id}`)}
              >
                <FiFileText />
                {note.titulo || 'Sem Título'}
              </li>
            ))
          ) : (
            <li className='side-recent-itens' style={{ fontStyle: 'italic', cursor: 'default', pointerEvents: 'none', opacity: 0.6 }}>
              Sem notas recentes
            </li>
          )}
        </ul>
      </div>

      <div className="side-history-header" onClick={onHistoryOpen}>
        <GoKebabHorizontal />
        Historico
      </div>



      <div className="side-config" onClick={onSettingsOpen} >
        <GoGear />
        Configurações
      </div>


      <div className="side-user" onClick={onProfileOpen}>
        <FaRegUserCircle />
        <p>{userName}</p>
      </div>
    </div>
  )
}

export default Side
