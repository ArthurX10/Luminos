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
                <h2 className="quote-text" style={{ textAlign: 'left', fontFamily: "'Courier Prime', monospace", fontWeight: 'normal', textTransform: 'none' }}>
                  Sua mente já está cheia<br />demais.
                  <br /><br />
                  Deixa o resto com O<br />Luminos.
                </h2>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Intro;
