import React, { useState } from 'react';
import { Trivia as TriviaType } from '@/types/pedido';

interface TriviaProps {
  data: TriviaType;
}

const Trivia: React.FC<TriviaProps> = ({ data }) => {
  const [scene, setScene] = useState<'intro' | 'game' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const startGame = () => {
    setScene('game');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnimating(false);
    setIsFadingOut(false);
    setIsShaking(false);
  };

  const handleOptionClick = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedOption(index);

    const isCorrect = index === data.preguntas[currentQuestionIndex].correcta;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }

    setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        if (currentQuestionIndex + 1 < data.preguntas.length) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsAnimating(false);
          setIsFadingOut(false);
        } else {
          setScene('results');
        }
      }, 300);
    }, 1500);
  };

  const currentQuestion = data.preguntas[currentQuestionIndex];
  const progressPercentage = (currentQuestionIndex / data.preguntas.length) * 100;

  const getResultsMessage = () => {
    const total = data.preguntas.length;
    const percentage = score / total;
    if (percentage === 1) return "¡Eres el amor de mi vida, lo sabes todo!";
    if (percentage >= 0.7) return "¡Casi perfecto! Nos conocemos muy bien.";
    return "¡Uy! Necesitamos otra cita para repasar datos.";
  };

  return (
    <section className="modulo-ravyn fondo-trivia" style={{ padding: '40px 0', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div id="trivia-module" className={`trivia-card ${isShaking ? 'shake-anim' : ''}`} style={{ maxWidth: '600px', width: '90%', margin: '0 auto' }}>
        
        {/* SCENE: INTRO */}
        {scene === 'intro' && (
          <div id="trivia-intro" className="fade-transition" style={{ textAlign: 'center' }}>
            <h1 className="header-title" style={{ marginBottom: '10px', fontSize: '2.5rem' }}>Nuestra Trivia</h1>
            <p className="intro-text" style={{ marginBottom: '30px' }}>{data.config.mensaje_inicio}</p>
            <button className="option-btn" onClick={startGame}>Empezar a jugar</button>
          </div>
        )}

        {/* SCENE: GAME */}
        {scene === 'game' && (
          <div id="trivia-game" className="fade-transition">
            <div className="progress-container" style={{ marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', overflow: 'hidden' }}>
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${progressPercentage}%`, 
                  height: '10px', 
                  backgroundColor: '#ff4757', 
                  transition: 'width 0.3s ease' 
                }}
              ></div>
            </div>
            
            <div className={`question-container ${isFadingOut ? 'fade-out' : ''}`} style={{ transition: 'opacity 0.3s' }}>
              <h2 className="question-header" style={{ fontSize: '1.8rem', marginBottom: '25px', textAlign: 'center' }}>
                {currentQuestion.pregunta}
              </h2>
              <div className="options-grid" style={{ display: 'grid', gap: '15px' }}>
                {currentQuestion.opciones.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = index === currentQuestion.correcta;
                  const buttonClass = isSelected 
                    ? (isCorrect ? 'correct' : 'incorrect') 
                    : (isAnimating && isCorrect ? 'correct' : '');

                  return (
                    <button 
                      key={index} 
                      className={`option-btn ${buttonClass}`} 
                      onClick={() => handleOptionClick(index)}
                      disabled={isAnimating}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SCENE: RESULTS */}
        {scene === 'results' && (
          <div id="trivia-results" className="fade-transition" style={{ textAlign: 'center' }}>
            <h2 className="header-title" style={{ marginBottom: '10px', fontSize: '2.5rem' }}>
              {score} / {data.preguntas.length}
            </h2>
            <p className="intro-text" style={{ marginBottom: '30px' }}>{getResultsMessage()}</p>
            <button className="option-btn" onClick={startGame}>Volver a jugar</button>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default Trivia;
