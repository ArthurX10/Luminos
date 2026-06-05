import './AuthForms.css';
import api from '../api';
import { useState } from 'react';

function RegisterForm({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword){
      alert('Senhas não coincidem!');
      return;
    }

    try {
      await api.post('api/cadastro/', {email, password})
      alert('Conta criada com sucesso!')
      onSwitch();
    } catch (error){
      alert(error.response.data.error);
    }
  }

  return (
  
    <div className="auth-box fade-in">
      <h1 className="auth-title">NOVA CONTA</h1>
      <form className="auth-form" style={{ gap: '15px' }} onSubmit = {handleRegister}> 
        <div className="form-group">
          <label htmlFor="username">NOME DE USUÁRIO:</label>
          <input 
          type="text" 
          id="username" 
          placeholder='Seu Melhor nome' 
          value = {username}
          onChange = {(e) => setUsername(e.target.value)}
          required />
        </div>
        <div className="form-group">
          <label htmlFor="email">EMAIL:</label>
          <input 
          type="email" 
          id="email" 
          placeholder='Seu Melhor Email'
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          required />
        </div>

        <div className="form-group relative-group">
          <label htmlFor="password">SENHA:</label>
          <div className="password-input-wrapper">
          <input 
          type={showPassword ? "text" : "password"} 
          id="password" 
          placeholder='********'
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required />

        <button
          type = "button"
          className="password-toggle-btn"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar a senha"}
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
          <label htmlFor="confirm-password">CONFIRMAR SENHA:</label>
          <div className="password-input-wrapper">
          <input 
          type={showPassword ? "text" : "password"}
          id="confirm-password" 
          placeholder='********'
          value = {confirmPassword}
          onChange = {(e) => setConfirmPassword(e.target.value)}
          required />

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
         

        <div className="checkbox-group" style={{marginTop: '5px'}}>
          <label htmlFor="terms" style={{ fontSize: '0.9rem', letterSpacing: '0.1rem'  }}>Ao criar uma conta você está aceitando nossos <span className="register-link">termos de serviço e política de privacidade</span></label>
        </div>

        <div className="submit-container">
          <button type="submit" className="btn-primary btn-capsule">REGISTRAR-SE</button>
        </div>
        
        
        <div className="auth-footer-links" style={{ marginTop: '15px' }}>
          <span style={{fontSize: '1rem'}}>JÁ TEM UMA CONTA? <span className="link-action register-link" onClick={onSwitch}>ENTRE</span></span>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
