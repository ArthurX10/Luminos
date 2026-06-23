import './AuthForms.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('api/login', {email, password});
      localStorage.setItem('user_id', response.data.user_id);
      navigate('/home');
    } catch (error){
      alert(error.response.data.error);
    }
  };

  return (
    <div className="auth-box fade-in">
      <h1 className="auth-title">LOGIN</h1>
      <form className="auth-form" onSubmit={handleLogin}>
        
        <div className="form-group">
          <label htmlFor="email">EMAIL:</label>
          <input 
            type="email" 
            id="email" 
            placeholder='Digite seu Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group relative-group">
          <label htmlFor="password">SENHA:</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password"
              placeholder='********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button 
              type="button" 
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
          <div className="forgot-password-container">
            <span className="forgot-password-link" onClick={() => onSwitch('forgotPassword')}>
              ESQUECEU A SENHA?
            </span>
          </div>
        </div>
        
        <div className="submit-container">
          <button type="submit" className="btn-primary btn-capsule">ENTRAR</button>
        </div>
        
        <div className="auth-footer-links" style={{marginTop: '15px'}}>
          <span style = {{fontSize: '1rem'}}>NÃO TEM UMA CONTA? <span className=" link-action register-link" onClick={() => onSwitch('register')}>REGISTRE-SE</span></span>
        </div>

      </form>
    </div>
  );
}

export default LoginForm;
