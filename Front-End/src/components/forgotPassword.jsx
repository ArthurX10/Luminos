import './AuthForms.css';
import { useState } from 'react';

function ForgotPassword({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();
    onSwitch('CodeRedefinition');
  };

  return (
    <div className='central-card fade-in'>
      <h1 className='auth-title' style={{ color: "white", marginTop: "15px", marginBottom: "25px" }}>
        RECUPERAR SENHA
      </h1>
      
      <p style={{ color: "#aaaaaa", textAlign: "center", marginBottom: "30px", fontSize: "0.95rem", lineHeight: "1.5", fontFamily: "sans-serif" }}>
        Insira o seu e-mail cadastrado abaixo para receber as instruções de redefinição de senha.
      </p>

      <form className="auth-form" onSubmit={handleResetPassword}>
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

        <div className="submit-container">
          <button type="submit" className="btn-primary btn-capsule" disabled={loading}>
            Enviar
          </button>
        </div>

        <div className="auth-footer-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '1rem' }}>
            LEMBROU A SENHA? <span className="link-action register-link" onClick={() => onSwitch('login')}>ENTRAR</span>
          </span>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;

