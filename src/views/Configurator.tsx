import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Heart, Palette, Type, 
  Camera, Plus, Trash2, Calendar, MapPin, Image as ImageIcon, Upload, Clock, Layers, Gamepad2, Check, MousePointer2, Music, Mail, 
  ShoppingBag, Sparkles, Layout
} from 'lucide-react';
import '@/styles/landing/configurator.css';

const THEME_OPTIONS = [
  { id: 'neo-japan', name: 'Neo-Japan', color: '#e31b3f' },
  { id: 'minecraft', name: 'Cubos', color: '#3adb3a' },
  { id: 'y2k-streamer', name: 'Y2K', color: '#ff00ff' },
  { id: 'aesthetic', name: 'Aesthetic', color: '#8b5cf6' },
  { id: 'cute-soft', name: 'Soft', color: '#ff66aa' },
];

const Configurator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedPack, modules, selectedTheme, total } = location.state || { 
    selectedPack: null, 
    modules: [], 
    selectedTheme: 'neo-japan',
    total: 0 
  };

  const [currentStep, setCurrentStep] = useState(0);
  
  // ESTADO GLOBAL DEL PROYECTO
  const [projectConfig, setProjectConfig] = useState({
    pareja: '',
    mensajeBienvenida: '',
    tema: selectedTheme || 'neo-japan',
    // Config Historia
    historiaSubtitle: '',
    memorias: [] as any[],
    // Config Contador
    contador: { titulo: '', subtitulo: '', fecha: '' },
    // Config Tarjetas
    mensajeInicioTarjetas: '',
    tarjetas: [] as any[],
    // Config Trivia
    trivia: {
      preguntas: [] as any[],
      mensajeExito: '',
      mensajeError: ''
    },
    // Config Evasivo
    evasivo: {
      pregunta: '',
      textoSi: '',
      textoNo: '',
      mensajeExito: ''
    },
    // Config Dedicatorias
    mensajeInicioDedic: '',
    dedicatorias: [] as any[]
  });

  // Estados locales para nuevos elementos
  const [newMemoria, setNewMemoria] = useState({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
  const [newTarjeta, setNewTarjeta] = useState({ titulo: '', contenido: '', imagen: '' });
  const [newPregunta, setNewPregunta] = useState({ pregunta: '', opciones: ['', '', '', ''], correcta: 0 });
  const [newDedicatoria, setNewDedicatoria] = useState({ titulo: '', texto: '', musica: '' });

  useEffect(() => {
    if (!modules || modules.length === 0) {
      navigate('/');
    }
  }, [modules, navigate]);

  const steps = [
    { id: 'general', title: 'Identidad y Estilo', icon: <Palette size={20} /> },
    ...modules.map((m: string) => ({ 
      id: m, 
      title: `Configurar ${m.charAt(0).toUpperCase() + m.slice(1)}`,
      icon: m === 'contador' ? <Clock size={20} /> : 
            m === 'tarjetas' ? <Layers size={20} /> : 
            m === 'trivia' ? <Gamepad2 size={20} /> : 
            m === 'evasivo' ? <MousePointer2 size={20} /> : 
            m === 'dedicatorias' ? <Mail size={20} /> : <Type size={20} />
    })),
    { id: 'final', title: 'Resumen y Envío', icon: <CheckCircle2 size={20} /> }
  ];

  const handleNext = () => {
    const step = steps[currentStep];
    if (currentStep === 0 && !projectConfig.pareja) { alert('Indica los nombres de la pareja.'); return; }
    if (step.id === 'historia' && projectConfig.memorias.length === 0) { alert('Añade al menos un momento.'); return; }
    if (step.id === 'contador' && !projectConfig.contador.fecha) { alert('Selecciona una fecha.'); return; }
    if (step.id === 'tarjetas' && projectConfig.tarjetas.length === 0) { alert('Añade al menos una carta.'); return; }
    if (step.id === 'trivia' && projectConfig.trivia.preguntas.length < 3) { alert('Mínimo 3 preguntas en la trivia.'); return; }
    if (step.id === 'evasivo' && (!projectConfig.evasivo.pregunta || !projectConfig.evasivo.textoSi || !projectConfig.evasivo.textoNo)) { alert('Todos los campos son obligatorios.'); return; }
    if (step.id === 'dedicatorias' && projectConfig.dedicatorias.length === 0) { alert('Añade al menos una dedicatoria.'); return; }
    
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/');
  };

  const handleFinish = () => {
    console.log('PEDIDO FINALIZADO:', projectConfig);
    alert('¡Arquitectura completada! Redirigiendo al pago...');
    // Aquí iría la redirección a Stripe o el envío a n8n
  };

  const addMemoria = () => {
    if (projectConfig.memorias.length < 12 && newMemoria.titulo && newMemoria.texto) {
      setProjectConfig({ ...projectConfig, memorias: [...projectConfig.memorias, { ...newMemoria, id: Date.now() }] });
      setNewMemoria({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'general':
        return (
          <div className="form-container">
            <div className="input-group"><label><Heart size={16} /> Nombres de la Pareja</label><input type="text" placeholder="Ej: Said y Dethh" value={projectConfig.pareja} onChange={(e) => setProjectConfig({...projectConfig, pareja: e.target.value})} /></div>
            <div className="input-group"><label>Mensaje de Bienvenida</label><textarea placeholder="Escribe una dedicatoria inicial..." value={projectConfig.mensajeBienvenida} onChange={(e) => setProjectConfig({...projectConfig, mensajeBienvenida: e.target.value})} /></div>
            <div className="input-group">
              <label><Palette size={16} /> Skin Global de la Experiencia</label>
              <div className="theme-grid-config">
                {THEME_OPTIONS.map((t) => (
                  <div key={t.id} className={`theme-option-card ${projectConfig.tema === t.id ? 'active' : ''}`} onClick={() => setProjectConfig({...projectConfig, tema: t.id})}>
                    <div className="theme-color-dot" style={{ background: t.color }}></div>
                    <span>{t.name}</span>
                    {projectConfig.tema === t.id && <CheckCircle2 size={16} className="check-icon" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'historia':
        return (
          <div className="form-container">
            <div className="input-group config-header-field"><label>Subtítulo de la Galería</label><input type="text" placeholder="Ej: Un recorrido por nuestros momentos..." value={projectConfig.historiaSubtitle} onChange={(e) => setProjectConfig({...projectConfig, historiaSubtitle: e.target.value})} /></div>
            <div className="memoria-form-card">
              <div className="card-header-with-limit"><h3><Camera size={18} /> Añadir Nuevo Momento</h3><span className={`limit-badge ${projectConfig.memorias.length >= 12 ? 'danger' : ''}`}>{projectConfig.memorias.length}/12</span></div>
              <div className="upload-placeholder-container"><div className="upload-visual-box"><Upload size={32} /><span>Subir Foto</span></div></div>
              <div className="grid-2-cols">
                <div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Primera cita" value={newMemoria.titulo} onChange={(e) => setNewMemoria({...newMemoria, titulo: e.target.value})} /></div>
                <div className="input-group"><label>Fecha</label><input type="text" placeholder="Ej: 14 Feb" value={newMemoria.fecha} onChange={(e) => setNewMemoria({...newMemoria, fecha: e.target.value})} /></div>
              </div>
              <div className="input-group"><label>Descripción</label><textarea placeholder="Cuenta qué pasó..." value={newMemoria.texto} onChange={(e) => setNewMemoria({...newMemoria, texto: e.target.value})} /></div>
              <button className="btn-add-item" onClick={addMemoria} disabled={projectConfig.memorias.length >= 12}><Plus size={18} /> Guardar Momento</button>
            </div>
            <div className="items-list-container">
              {projectConfig.memorias.map((m) => (
                <div key={m.id} className="item-summary-card"><div className="item-info"><strong>{m.titulo}</strong><span>{m.fecha}</span></div><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, memorias: projectConfig.memorias.filter(x => x.id !== m.id)})}><Trash2 size={16} /></button></div>
              ))}
            </div>
          </div>
        );

      case 'contador':
        return (
          <div className="form-container">
            <div className="input-group"><label><Type size={16} /> Título del Contador</label><input type="text" placeholder="Ej: Nuestro Tiempo Juntos" value={projectConfig.contador.titulo} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, titulo: e.target.value }})} /></div>
            <div className="input-group"><label>Subtítulo de Apoyo</label><input type="text" placeholder="Ej: Cada segundo cuenta..." value={projectConfig.contador.subtitulo} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, subtitulo: e.target.value }})} /></div>
            <div className="input-group"><label><Calendar size={16} /> Fecha Especial (Día Cero)</label><input type="date" className="date-input-full" value={projectConfig.contador.fecha} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, fecha: e.target.value }})} /></div>
          </div>
        );

      case 'tarjetas':
        return (
          <div className="form-container">
            <div className="input-group config-header-field"><label>Mensaje de Inicio (Sobre)</label><input type="text" placeholder="Ej: Nuestras cartas guardadas..." value={projectConfig.mensajeInicioTarjetas} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioTarjetas: e.target.value})} /></div>
            <div className="memoria-form-card">
              <div className="card-header-with-limit"><h3><Layers size={18} /> Añadir Nueva Carta</h3><span className={`limit-badge ${projectConfig.tarjetas.length >= 10 ? 'danger' : ''}`}>{projectConfig.tarjetas.length}/10</span></div>
              <div className="upload-placeholder-container"><div className="upload-visual-box"><Upload size={32} /><span>Imagen de la Carta</span></div></div>
              <div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Para ti" value={newTarjeta.titulo} onChange={(e) => setNewTarjeta({...newTarjeta, titulo: e.target.value})} /></div>
              <div className="input-group"><label>Mensaje</label><textarea placeholder="Algo corto..." value={newTarjeta.contenido} onChange={(e) => setNewTarjeta({...newTarjeta, contenido: e.target.value})} /></div>
              <button className="btn-add-item" onClick={() => { if (projectConfig.tarjetas.length < 10 && newTarjeta.titulo && newTarjeta.contenido) { setProjectConfig({ ...projectConfig, tarjetas: [...projectConfig.tarjetas, { ...newTarjeta, id: Date.now() }] }); setNewTarjeta({ titulo: '', contenido: '', imagen: '' }); } }} disabled={projectConfig.tarjetas.length >= 10}><Plus size={18} /> Guardar Carta</button>
            </div>
            <div className="items-list-container">{projectConfig.tarjetas.map((t) => (<div key={t.id} className="item-summary-card"><div className="item-info"><strong>{t.titulo}</strong></div><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, tarjetas: projectConfig.tarjetas.filter(x => x.id !== t.id)})}><Trash2 size={16} /></button></div>))}</div>
          </div>
        );

      case 'trivia':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group"><label>Mensaje de Victoria</label><input type="text" placeholder="Ej: ¡Sabía que me conocías!" value={projectConfig.trivia.mensajeExito} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeExito: e.target.value }})} /></div>
              <div className="input-group"><label>Mensaje de Error</label><input type="text" placeholder="Ej: ¡Inténtalo de nuevo!" value={projectConfig.trivia.mensajeError} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeError: e.target.value }})} /></div>
            </div>
            <div className="memoria-form-card">
              <div className="card-header-with-limit"><h3><Gamepad2 size={18} /> Añadir Pregunta</h3><span className={`limit-badge ${projectConfig.trivia.preguntas.length >= 10 ? 'danger' : ''}`}>{projectConfig.trivia.preguntas.length}/10</span></div>
              <div className="input-group"><label>La Pregunta</label><input type="text" placeholder="Ej: ¿Mi comida favorita?" value={newPregunta.pregunta} onChange={(e) => setNewPregunta({...newPregunta, pregunta: e.target.value})} /></div>
              <div className="options-config-grid">
                {newPregunta.opciones.map((op, idx) => (
                  <div key={idx} className={`option-input-group ${newPregunta.correcta === idx ? 'is-correct' : ''}`}>
                    <button className="btn-select-correct" onClick={() => setNewPregunta({...newPregunta, correcta: idx})}>{newPregunta.correcta === idx ? <CheckCircle2 size={16} /> : <div className="circle-placeholder" />}</button>
                    <input type="text" placeholder={`Opción ${String.fromCharCode(65 + idx)}`} value={op} onChange={(e) => { const nuevasOp = [...newPregunta.opciones]; nuevasOp[idx] = e.target.value; setNewPregunta({...newPregunta, opciones: nuevasOp}); }} />
                  </div>
                ))}
              </div>
              <button className="btn-add-item" onClick={() => { if (projectConfig.trivia.preguntas.length < 10 && newPregunta.pregunta && !newPregunta.opciones.some(o => !o)) { setProjectConfig({ ...projectConfig, trivia: { ...projectConfig.trivia, preguntas: [...projectConfig.trivia.preguntas, { ...newPregunta, id: Date.now() }] } }); setNewPregunta({ pregunta: '', opciones: ['', '', '', ''], correcta: 0 }); } }} disabled={projectConfig.trivia.preguntas.length >= 10}><Plus size={18} /> Guardar Pregunta</button>
            </div>
            <div className="items-list-container">{projectConfig.trivia.preguntas.map((p) => (<div key={p.id} className="item-summary-card"><div className="item-info"><strong>{p.pregunta}</strong><span>R: {p.opciones[p.correcta]}</span></div><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, preguntas: projectConfig.trivia.preguntas.filter(x => x.id !== p.id) }})}><Trash2 size={16} /></button></div>))}</div>
          </div>
        );

      case 'evasivo':
        return (
          <div className="form-container">
            <div className="input-group"><label><MousePointer2 size={16} /> La Pregunta Trampa</label><input type="text" placeholder="Ej: ¿Me perdonas?" value={projectConfig.evasivo.pregunta} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, pregunta: e.target.value }})} /></div>
            <div className="grid-2-cols">
              <div className="input-group"><label>Texto Botón "SÍ"</label><input type="text" placeholder="Ej: Sí, obvio" value={projectConfig.evasivo.textoSi} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoSi: e.target.value }})} /></div>
              <div className="input-group"><label>Texto Botón "NO"</label><input type="text" placeholder="Ej: No, jamás" value={projectConfig.evasivo.textoNo} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoNo: e.target.value }})} /></div>
            </div>
            <div className="input-group"><label>Mensaje tras aceptar</label><textarea placeholder="Ej: ¡Sabía que dirías que sí!" value={projectConfig.evasivo.mensajeExito} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, mensajeExito: e.target.value }})} /></div>
          </div>
        );

      case 'dedicatorias':
        return (
          <div className="form-container">
            <div className="input-group config-header-field"><label>Mensaje de Inicio (Cofre)</label><input type="text" placeholder="Ej: He preparado algo especial..." value={projectConfig.mensajeInicioDedic} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioDedic: e.target.value})} /></div>
            <div className="memoria-form-card">
              <div className="card-header-with-limit"><h3><Mail size={18} /> Nueva Dedicatoria</h3><span className={`limit-badge ${projectConfig.dedicatorias.length >= 10 ? 'danger' : ''}`}>{projectConfig.dedicatorias.length}/10</span></div>
              <div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Mi promesa" value={newDedicatoria.titulo} onChange={(e) => setNewDedicatoria({...newDedicatoria, titulo: e.target.value})} /></div>
              <div className="input-group"><label>Mensaje</label><textarea placeholder="Escribe aquí..." value={newDedicatoria.texto} onChange={(e) => setNewDedicatoria({...newDedicatoria, texto: e.target.value})} /></div>
              <button className="btn-add-item" onClick={() => { if (projectConfig.dedicatorias.length < 10 && newDedicatoria.titulo && newDedicatoria.texto) { setProjectConfig({ ...projectConfig, dedicatorias: [...projectConfig.dedicatorias, { ...newDedicatoria, id: Date.now() }] }); setNewDedicatoria({ titulo: '', texto: '', musica: '' }); } }} disabled={projectConfig.dedicatorias.length >= 10}><Plus size={18} /> Guardar Dedicatoria</button>
            </div>
            <div className="items-list-container">{projectConfig.dedicatorias.map((d) => (<div key={d.id} className="item-summary-card"><div className="item-info"><strong>{d.titulo}</strong></div><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, dedicatorias: projectConfig.dedicatorias.filter(x => x.id !== d.id)})}><Trash2 size={16} /></button></div>))}</div>
          </div>
        );

      case 'final':
        return (
          <div className="form-container">
            <div className="order-summary-card">
              <div className="summary-header">
                <ShoppingBag size={24} />
                <h3>Resumen de tu Arquitectura</h3>
              </div>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Pareja:</span>
                  <strong>{projectConfig.pareja}</strong>
                </div>
                <div className="summary-row">
                  <span>Pack Elegido:</span>
                  <strong>{selectedPack?.nombre || 'Personalizado'}</strong>
                </div>
                <div className="summary-row">
                  <span>Skin Seleccionada:</span>
                  <div className="theme-preview-mini">
                    <div className="theme-color-dot" style={{ background: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color }}></div>
                    <strong>{THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.name}</strong>
                  </div>
                </div>
              </div>
              
              <div className="summary-modules-list">
                <h4>Módulos Configurados:</h4>
                <ul>
                  {modules.map((m: string) => (
                    <li key={m}>
                      <Layout size={14} />
                      {m.replace('modulo-', '').toUpperCase()}
                      <Check size={14} className="check-icon-green" />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="summary-total">
                <span>Inversión Total:</span>
                <span className="total-amount">${total} MXN</span>
              </div>
            </div>

            <div className="final-notice">
              <Sparkles size={20} />
              <p>Al finalizar, nuestro equipo de producción recibirá vuestros datos y comenzará la construcción de vuestra arquitectura digital exclusiva.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="placeholder-form"><p>Configuración para: <strong>{step.title}</strong></p><p className="hint">Módulo en construcción.</p></div>
        );
    }
  };

  return (
    <div className="configurator-layout">
      <nav className="config-nav">
        <button className="back-btn" onClick={handleBack}><ArrowLeft size={20} /><span>Regresar</span></button>
        <div className="progress-container">
          <div className="progress-bar"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div>
          <span className="step-counter">Paso {currentStep + 1} de {steps.length}</span>
        </div>
        <div className="config-logo">Ravyn Studio</div>
      </nav>
      <main className="config-main">
        <AnimatePresence mode="wait">
          <motion.section key={steps[currentStep].id} className="config-step-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="step-header"><span className="step-tag">Arquitecto Ravyn</span><h1>{steps[currentStep].title}</h1><p>Confirmación de vuestra experiencia digital.</p></div>
            <div className="step-content">{renderStepContent()}</div>
            <div className="step-actions">
              <button className="btn-secondary" onClick={handleBack}><ChevronLeft size={20} /> Atrás</button>
              <button className="btn-primary" onClick={handleNext}>{currentStep === steps.length - 1 ? 'Finalizar Construcción' : 'Siguiente Paso'} <ChevronRight size={20} /></button>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Configurator;
