import './AuthForms.css';
import api from '../api';
import { useState } from 'react';

function RegisterForm({ onSwitch }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      <h1 className="auth-title">REGISTRO</h1>
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
        <div className="form-group">
          <label htmlFor="password">SENHA:</label>
          <input 
          type="password" 
          id="password" 
          placeholder='********'
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          required />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">CONFIRMAR SENHA:</label>
          <input 
          type="password" 
          id="confirm-password" 
          placeholder='********'
          value = {confirmPassword}
          onChange = {(e) => setConfirmPassword(e.target.value)}
          required />
        </div>

        <div className="checkbox-group" style={{marginTop: '5px'}}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms" style={{ fontSize: '0.9rem' }}>CONCORDO COM OS TERMOS E CONCORDÂNCIAS</label>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '14px' }}>REGISTRAR-SE</button>
        
        <div className="auth-footer-links" style={{ marginTop: '15px' }}>
          <span className="link-action" onClick={onSwitch} style={{fontSize: '0.9rem'}}>JÁ TEM UMA CONTA? FAÇA LOGIN</span>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
