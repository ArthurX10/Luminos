import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCircleExclamation } from 'react-icons/fa6';
import { GrHomeRounded } from 'react-icons/gr';
import './NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <div className="notfound-header-row">
                <FaCircleExclamation className="notfound-icon" />
                <h1 className="notfound-code">ERRO 404</h1>
            </div>

            <h2 className="notfound-title">PÁGINA NÃO ENCONTRADA</h2>
            
            <p className="notfound-message">
                NÃO CONSEGUIMOS ENCONTRAR A PÁGINA QUE VOCÊ DESEJA.
            </p>

            <button 
                onClick={() => navigate('/home')} 
                className="btn-notfound-home"
            >
                <GrHomeRounded size={18} />
                HOME
            </button>
        </div>
    );
}

export default NotFound;
