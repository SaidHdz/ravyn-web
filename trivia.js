let triviaConfig = {};
let triviaQuestions = [];

const state = { currentQuestionIndex: 0, score: 0, isAnimating: false };

const elements = {
  introContainer: document.getElementById('trivia-intro'),
  gameContainer: document.getElementById('trivia-game'),
  resultsContainer: document.getElementById('trivia-results'),
  introMessage: document.getElementById('intro-message'),
  questionContainer: document.getElementById('question-container'),
  questionText: document.getElementById('question-text'),
  optionsGrid: document.getElementById('options-grid'),
  progressBar: document.getElementById('progress-bar'),
  finalScore: document.getElementById('final-score'),
  finalMessage: document.getElementById('final-message'),
  startBtn: document.getElementById('start-btn'),
  restartBtn: document.getElementById('restart-btn')
};

// === LÓGICA DE INYECCIÓN DE TEMA (Igual que en tu galería) ===
// === LÓGICA DE INYECCIÓN DE TEMA ===
function loadTheme(themeName) {
    const head = document.head;
    
    // 1. Limpiar el CSS anterior si existe (Para evitar que se encimen si cambias de tema)
    const existingLink = document.getElementById('dynamic-theme');
    if (existingLink) {
        existingLink.remove();
    }

    // 2. Crear y conectar el nuevo CSS
    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    
    // Ahora busca el archivo normal, ej: css/theme-minecraft.css
    link.href = `css/theme-${themeName}.css`; 
    
    head.appendChild(link);
    document.body.className = `theme-${themeName}`;
}

// === CARGA DE DATOS ASÍNCRONA ===
function iniciarTrivia(data) {
    triviaConfig = data.config;
    triviaQuestions = data.preguntas;
    
    elements.introMessage.textContent = triviaConfig.mensaje_inicio;
}

// === LÓGICA DE LA TRIVIA ===
function startGame() {
  elements.introContainer.classList.add('hidden');
  elements.gameContainer.classList.remove('hidden');
  elements.resultsContainer.classList.add('hidden');
  
  state.currentQuestionIndex = 0;
  state.score = 0;
  updateProgress();
  loadQuestion();
}

function loadQuestion() {
  const currentData = triviaQuestions[state.currentQuestionIndex];
  elements.questionContainer.classList.remove('fade-out');
  elements.questionText.textContent = currentData.pregunta;
  elements.optionsGrid.innerHTML = '';

  currentData.opciones.forEach((opcion, index) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = opcion;
    btn.onclick = () => handleOptionClick(index, currentData.correcta, btn);
    elements.optionsGrid.appendChild(btn);
  });
  state.isAnimating = false;
}

function handleOptionClick(selectedIndex, correctIndex, selectedBtn) {
  if (state.isAnimating) return;
  state.isAnimating = true;

  const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
  buttons.forEach(btn => btn.disabled = true);

  if (selectedIndex === correctIndex) {
    selectedBtn.classList.add('correct');
    state.score++;
  } else {
    selectedBtn.classList.add('incorrect');
    buttons[correctIndex].classList.add('correct');
  }

  setTimeout(() => {
    elements.questionContainer.classList.add('fade-out'); 
    setTimeout(() => {
      state.currentQuestionIndex++;
      updateProgress();
      if (state.currentQuestionIndex < triviaQuestions.length) {
        loadQuestion();
      } else {
        showResults();
      }
    }, 300); 
  }, 1500);
}

function updateProgress() {
  const progressPercentage = (state.currentQuestionIndex / triviaQuestions.length) * 100;
  elements.progressBar.style.width = `${progressPercentage}%`;
}

function showResults() {
  elements.gameContainer.classList.add('hidden');
  elements.resultsContainer.classList.remove('hidden');
  
  const total = triviaQuestions.length;
  elements.finalScore.textContent = `${state.score} / ${total}`;

  const percentage = state.score / total;
  let message = percentage === 1 ? "¡Eres el amor de mi vida, lo sabes todo!" : 
                percentage >= 0.7 ? "¡Casi perfecto! Nos conocemos muy bien." : 
                "¡Uy! Necesitamos otra cita para repasar datos.";

  elements.finalMessage.textContent = message;
}
