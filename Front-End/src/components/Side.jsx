import React, { useState }from 'react';
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


function Side({ userName, notes = [], onNewNote, onSearchOpen, onHistoryOpen }) {

  const handleHomeClick = () => {
    navigate('/home');
  };


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
            Pesquisar
          </li  >
          <li className='side-nav-item' onClick={handleHomeClick}>
            <GrHomeRounded />
               Home   
          </li>
          <li className="side-nav-item">
            <GoFileDirectory />
              Gestão
          </li>
          <li className="side-nav-item">
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
                className='side-recent-itens'>
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



      <div className="side-config">
        <GoGear />
        Configurações
      </div>


      <div className="side-user">
        {/*Criar uma logica para mostrar o nome do usuário*/}
        {/*Criar uma logica para mostrar a foto do usuário*/}
        <FaRegUserCircle />
        Nome do Usuário
      </div>
    </div>
  )
}

export default Side
