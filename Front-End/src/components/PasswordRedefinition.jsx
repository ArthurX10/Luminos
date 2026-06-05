import React from 'react'
import { useState, useRef, useEffect } from 'react';
import './AuthForms.css';

function PasswordRedefinition({ onSwitch }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            <div className="form-group">
                <label htmlFor="password">DIGITE A SUA NOVA SENHA: </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Digite a senha Desejada"
                    value={password}
                    onChange ={(e) => setPassword(e.target.value)}
                    required/>
            </div>

            <div className="auth-form" style = {{color: "white", marginTop: '15px', marginBottom:'15px' }}>
                <div className="form-group">
                    <label htmlFor="confirmPassword">CONFIRME SUA SENHA:</label>
                    <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Confirme a senha'
                        value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required/>
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
