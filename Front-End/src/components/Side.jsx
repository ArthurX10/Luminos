import React from 'react';
import Logo from './Logo'
import './Side.css'
import { GrHomeRounded } from "react-icons/gr";
import { GoFileDirectory } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FiAlignJustify } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { GoGear } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";

function Header() {
  return (
    <div className="side-container">
      <div className="side-header">
        <Logo></Logo> 
        <h1>LUMINOS</h1>
      </div>
        
       <nav>
        <ul className='side-nav-list'>
          <li className='side-nav-item'>
            <GrHomeRounded />
              Home   
             <FaMagnifyingGlass />
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

       <div className="side-add">
        <p> + NOVA ANOTAÇÃO</p>
       </div>


      <div>
        <ul className="side-recent-header">
          <li className="side-nav-item">
            <FiAlignJustify />
            Recentes
          </li>
          {/*Criar uma logica para mostrar os ultimos 5 card*/}
          <li className='side-recent-itens'>
            <FiFileText />
            Título 1
          </li>
          <li className='side-recent-itens'>
            <FiFileText /> 
            Título 2
          </li>
          <li className='side-recent-itens'>
            <FiFileText />
            Título 3
          </li>
          <li className='side-recent-itens'>
            <FiFileText />
            Título 4
          </li>
        </ul>
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

export default Header
