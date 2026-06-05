import { useState, useRef, useEffect } from 'react';
import './AuthForms.css';

function CodeRedefinition({ onSwitch }) {
  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus the first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    // Only allow digits
    const cleanedValue = value.replace(/[^0-9]/g, '');
    if (cleanedValue === '') {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    // Handle paste of multiple characters (e.g. paste '123456')
    if (cleanedValue.length > 1) {
      const digits = cleanedValue.split('').slice(0, 6);
      const newCode = [...code];
      
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      
      setCode(newCode);
      
      // Focus on last pasted input or the 6th input
      const targetIndex = Math.min(index + digits.length - 1, 5);
      if (inputRefs.current[targetIndex]) {
        inputRefs.current[targetIndex].focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = cleanedValue;
    setCode(newCode);

    // Auto-focus next input if current one is filled
    if (index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        // Clear previous input and focus it
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      } else {
        // Clear current input
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    if (verificationCode.length < 6) {
      alert('Por favor, preencha todos os 6 dígitos do código.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSwitch('resetPassword');
    }, 1200);
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    alert('Um novo código de redefinição foi enviado para o seu e-mail.');
  };

  return (
    <div className="central-card fade-in">
      <h1 className="auth-title" style={{ color: "white", marginTop: "15px", marginBottom: "25px" }}>
        RECUPERAR A SENHA
      </h1>

      <form className="auth-form" onSubmit={handleVerifyCode}>
        <div className="code-form-group">
          <label htmlFor="code-input-0">CÓDIGO:</label>
          <div className="code-inputs-container">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-input-${index}`}
                type="text"
                maxLength={6} // Allow pasting long strings to handle it in onChange
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="code-input-field"
                required
              />
            ))}
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="btn-primary btn-capsule" disabled={loading}>
            Confirmar
          </button>
        </div>

        <div className="auth-footer-links" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
            NÃO RECEBEU O CÓDIGO? <span className="link-action register-link" onClick={handleResendCode}>CLIQUE AQUI</span>
          </span>
        </div>
      </form>
    </div>
  );
}

export default CodeRedefinition;
