import './AuthForms.css';

function LoginForm({ onSwitch }) {
  return (
    <div className="auth-box fade-in">
      <h1 className="auth-title">LOGIN</h1>
      <form className="auth-form">
        
        <div className="form-group">
          <label htmlFor="email">EMAIL:</label>
          <input type="email" id="email" placeholder='Seu Usuário'required />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" >SENHA:</label>
          <input type="password" id="password"  placeholder='********'required />
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
