import { useState, useEffect } from 'react';
import Intro from '../components/Intro';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import ForgotPassword from '../components/forgotPassword';
import CodeRedefinition from '../components/CodeRedefinition';
import PasswordRedefinition from '../components/PasswordRedefinition';
import './AuthPage.css';

const phrases = [
  "Você já se sentiu com a cabeça cheia?",
  "Já tentou organizar seus pensamentos e aliviar a mente?",
  "Faça Login. Nós te ajudaremos..."
];

function AuthPage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSwitch = (newMode) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setAuthMode(newMode);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
  };

  const handleSwitchToRegister = () => handleSwitch('register');
  const handleSwitchToLogin = () => handleSwitch('login');
  
  useEffect(() => {
    if (introComplete) return;

    const currentFullText = phrases[currentPhraseIndex];
    const isLastPhrase = currentPhraseIndex === phrases.length - 1;
    const typingSpeed = isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayedText !== currentFullText) {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      } else if (!isDeleting && displayedText === currentFullText) {
        if (isLastPhrase) {
          setTimeout(() => setIntroComplete(true), 1000);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else if (isDeleting && displayedText !== '') {
        setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
      } else if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => prev + 1);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentPhraseIndex, introComplete]);

  if (!introComplete) {
    return (
      <div className="typewriter-overlay">
        <button className="skip-intro-btn" onClick={() => setIntroComplete(true)}>
          Pular &rarr;
        </button>
        <p className="typewriter-text">
          {displayedText}
          <span className="typewriter-cursor">|</span>
        </p>
      </div>
    );
  }

  if (authMode === 'forgotPassword') {
    return (
      <div className="auth-page-container auth-page-enter central-layout">
        <div key="forgot-password" className={`central-panel-wrapper fade-content ${isTransitioning ? 'blurred' : ''}`}>
          <ForgotPassword onSwitch={handleSwitch} />
        </div>
      </div>
    );
  }

  if (authMode === 'CodeRedefinition') {
    return (
      <div className="auth-page-container auth-page-enter central-layout">
        <div key="code-redefinition" className={`central-panel-wrapper fade-content ${isTransitioning ? 'blurred' : ''}`}>
          <CodeRedefinition onSwitch={handleSwitch} />
        </div>
      </div>
    );
  }

  if(authMode === 'resetPassword'){
    return(
      <div className="auth-page-container auth-page-enter central-layout">
        <div key="password-redefinition" className={`central-panel-wrapper fade-content ${isTransitioning ? 'blurred' : ''}`}>
          <PasswordRedefinition onSwitch={handleSwitch} />
        </div>
      </div>
    )
  }

  const showLoginOrForgot = authMode === 'login';

  return (
    <div className="auth-page-container auth-page-enter">
      <div className={`side-panel panel-left ${showLoginOrForgot ? 'panel-dark' : 'panel-light'}`}>
        <div key={`left-${authMode}`} className={`fade-content ${isTransitioning ? 'blurred' : ''}`}>
          {showLoginOrForgot ? (
            <Intro 
              showSplitView={true} 
              isRegister={false}
              onSwitchToRegister={handleSwitchToRegister}
            />
          ) : (
            <RegisterForm onSwitch={handleSwitchToLogin} />
          )}
        </div>
      </div>

      <div className={`side-panel panel-right ${showLoginOrForgot ? 'panel-light' : 'panel-dark'}`}>
        <div key={`right-${authMode}`} className={`fade-content ${isTransitioning ? 'blurred' : ''}`}>
          {authMode === 'login' ? (
            <LoginForm onSwitch={handleSwitch} />
          ) : (
            <Intro 
              showSplitView={true} 
              isRegister={true}
              onSwitchToRegister={handleSwitchToRegister}
            />
          )}
        </div>
      </div>

    </div>
  );
}

export default AuthPage;
