import './Intro.css';

function Intro({ showSplitView, isRegister, onSwitchToRegister }) {
  return (
    <div className="intro-container">
      <div className="intro-content">
        {showSplitView && (
          <div className="static-intro fade-in">
            {isRegister ? (
              <div className="quote-container" style={{ textAlign: 'right' }}>
                <h2 className="quote-text" style={{ textAlign: 'right' }}>
                  “A felicidade da sua<br />vida depende da<br />qualidade dos seus<br />pensamentos”
                </h2>
                <p className="quote-author" style={{ textAlign: 'right', marginTop: '20px' }}>-Marco Aurélio</p>
              </div>
            ) : (
              <div className="quote-container" style={{ textAlign: 'left' }}>
                <h2 className="quote-text" style={{ textAlign: 'left' }}>
                  Você já se sentiu... <br /> mentalmente exausto?
                </h2>
                <p className="quote-sub" style={{ textAlign: 'left', marginTop: '20px', fontWeight: 'bold' }}>
                  Entre no luminous e <br /> clareie seu interior
                </p>
                <div className="btn-register-container" style={{ textAlign: 'left' }}>
                  <button className="btn-register-intro" onClick={onSwitchToRegister}>
                    REGISTRAR-SE
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Intro;
