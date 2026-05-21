import './AuthForms.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            placeholder='Seu Usuário'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" >SENHA:</label>
          <input 
            type="password"
            id="password"  placeholder='********' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        
        <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>ENTRAR</button>
        
        <div className="auth-footer-links" style={{marginTop: '15px'}}>
          <span className="link-action" onClick={onSwitch}  style={{fontSize: '0.9rem'}}>
            Esqueceu sua senha? Clique aqui!
          </span>
        </div>

      </form>
    </div>
  );
}

export default LoginForm;
