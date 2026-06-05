import React from 'react'
import { useState } from 'react';
import './AuthForms.css';
import EyeIcon from './EyeIcon';
import EyeOffIcon from './EyeOffIcon';


function PasswordRedefinition({ onSwitch }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordRedefinition = (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            alert('Senhas não coincidem!')
            return;
        }

        if(password.length < 6){
            alert('Senha deve ter pelo menos 6 caracteres!')
            return;
        }

        alert('Senha redefinida com sucesso!')
        onSwitch('login')
    }

  return (
    <div className="central-card fade-in">
        <h1 className='auth-title' style = {{color: 'white', marginTop: '15px', marginBottom: '15px' }}>
            RECUPERAR SENHA
        </h1>
        <form className = "auth-form" onSubmit={handlePasswordRedefinition}>
            <div className="form-group relative-group">
                <label htmlFor="password">DIGITE A SUA NOVA SENHA: </label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Digite a senha Desejada"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                     <button 
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
        </form>
    </div>
  )
}

export default PasswordRedefinition

