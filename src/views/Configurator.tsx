import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Heart, Palette, Type, 
  Camera, Plus, Trash2, Calendar, MapPin, Image as ImageIcon, Upload, Clock, Layers, Gamepad2, Check, MousePointer2, Music, Mail, 
  ShoppingBag, Sparkles, Layout, Pencil
} from 'lucide-react';
import WrappedFormConfigurator from '@/components/configurator/WrappedFormConfigurator';
import '@/styles/landing/configurator.css';

const THEME_OPTIONS = [
  { id: 'y2k-streamer', name: 'Y2K', color: '#ff66cc' },
  { id: 'neo-japan', name: 'Neo Japan', color: '#e31b3f' },
  { id: 'minecraft', name: 'Cubos', color: '#3adb3a' },
  { id: 'cute-soft', name: 'Cute', color: '#ff66aa' },
  { id: 'aesthetic', name: 'Aesthetic', color: '#8b5cf6' },
  { id: 'finn', name: 'Heroe', color: '#4CB7FF' },
  { id: 'jake', name: 'Mejor Amigo', color: '#FFD230' },
  { id: 'lsp', name: 'Grumos', color: '#B39DDB' },
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
  
  const [projectConfig, setProjectConfig] = useState({
    pareja: '',
    mensajeBienvenida: '',
    tema: selectedTheme || 'neo-japan',
    historiaSubtitle: '',
    memorias: [] as any[],
    historia_cantidad: 5,
    contador: { titulo: '', subtitulo: '', fecha: '' },
    mensajeInicioTarjetas: '',
    tarjetas: [] as any[],
    tarjetas_cantidad: 5,
    trivia: {
      preguntas: [] as any[],
      mensajeExito: '',
      mensajeError: '',
      cantidad: 3,
    },
    evasivo: {
      pregunta: '',
      textoSi: '',
      textoNo: '',
      mensajeExito: ''
    },
    wrapped: {
      totalMensajes: '', diasJuntos: '', palabraTop: '', emojiTop: '', horarioPico: '',
      cancionSpotify: '', perdonadorTop: '', tema1: '', tema1Porcentaje: 50,
      tema2: '', tema2Porcentaje: 30, tema3: '', tema3Porcentaje: 20,
      pacienciaYo: 50, pacienciaTu: 50, premio1Ganador: '', premio2Ganador: '', premio3Ganador: ''
    },
    mensajeInicioDedic: '',
    dedicatorias: [] as any[],
    dedicatorias_cantidad: 3,
  });

  const [newMemoria, setNewMemoria] = useState({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
  const [editingMemoriaId, setEditingMemoriaId] = useState<number | null>(null);

  const [newTarjeta, setNewTarjeta] = useState({ titulo: '', contenido: '', imagen: '' });
  const [editingTarjetaId, setEditingTarjetaId] = useState<number | null>(null);
  
  const [newPregunta, setNewPregunta] = useState({ pregunta: '', opciones: ['', '', '', ''], correcta: 0 });
  const [editingPreguntaId, setEditingPreguntaId] = useState<number | null>(null);

  const [newDedicatoria, setNewDedicatoria] = useState({ titulo: '', texto: '', musica: '' });
  const [editingDedicatoriaId, setEditingDedicatoriaId] = useState<number | null>(null);

  useEffect(() => {
    if (!modules || modules.length === 0) navigate('/');
  }, [modules, navigate]);

  const steps = [
    { id: 'general', title: 'Identidad y Estilo', icon: <Palette size={20} /> },
    ...modules.map((m: string) => ({ 
      id: m, 
      title: `Configurar ${m.charAt(0).toUpperCase() + m.slice(1)}`,
      icon: m === 'contador' ? <Clock size={20} /> : m === 'tarjetas' ? <Layers size={20} /> : 
            m === 'trivia' ? <Gamepad2 size={20} /> : m === 'evasivo' ? <MousePointer2 size={20} /> : 
            m === 'dedicatorias' ? <Mail size={20} /> : m === 'wrapped' ? <Sparkles size={20} /> : <Type size={20} />
    })),
    { id: 'final', title: 'Resumen y Envío', icon: <CheckCircle2 size={20} /> }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else handleFinish();
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
    else navigate('/');
  };

  const handleFinish = () => {
    console.log('PEDIDO FINALIZADO:', projectConfig);
    alert('¡Experiencia completada! Redirigiendo al pago...');
  };

  // --- Lógica para Módulo HISTORIA ---
  const handleSaveMemoria = () => {
    if (!newMemoria.titulo || !newMemoria.texto) return alert('El título y la descripción son obligatorios.');
    if (editingMemoriaId) {
      setProjectConfig(prev => ({ ...prev, memorias: prev.memorias.map(m => m.id === editingMemoriaId ? { ...newMemoria, id: editingMemoriaId } : m) }));
    } else if (projectConfig.memorias.length < projectConfig.historia_cantidad) {
      setProjectConfig(prev => ({ ...prev, memorias: [...prev.memorias, { ...newMemoria, id: Date.now() }] }));
    }
    setNewMemoria({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
    setEditingMemoriaId(null);
  };
  const handleEditMemoria = (id: number) => {
    const item = projectConfig.memorias.find(m => m.id === id);
    if (item) {
      setNewMemoria(item);
      setEditingMemoriaId(id);
      window.scrollTo(0, 0);
    }
  };
  const cancelEditMemoria = () => {
    setNewMemoria({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
    setEditingMemoriaId(null);
  };

  // --- Lógica para Módulo TARJETAS ---
  const handleSaveTarjeta = () => {
    if (!newTarjeta.titulo || !newTarjeta.contenido) return alert('El título y el contenido son obligatorios.');
    if (editingTarjetaId) {
      setProjectConfig(prev => ({ ...prev, tarjetas: prev.tarjetas.map(t => t.id === editingTarjetaId ? { ...newTarjeta, id: editingTarjetaId } : t) }));
    } else if (projectConfig.tarjetas.length < 10) {
      setProjectConfig(prev => ({ ...prev, tarjetas: [...prev.tarjetas, { ...newTarjeta, id: Date.now() }] }));
    }
    setNewTarjeta({ titulo: '', contenido: '', imagen: '' });
    setEditingTarjetaId(null);
  };
  const handleEditTarjeta = (id: number) => {
    const item = projectConfig.tarjetas.find(t => t.id === id);
    if (item) {
      setNewTarjeta(item);
      setEditingTarjetaId(id);
      window.scrollTo(0, 0);
    }
  };
  const cancelEditTarjeta = () => {
    setNewTarjeta({ titulo: '', contenido: '', imagen: '' });
    setEditingTarjetaId(null);
  };

  // --- Lógica para Módulo TRIVIA ---
  const handleSavePregunta = () => {
    if (!newPregunta.pregunta || newPregunta.opciones.some(o => !o)) return alert('La pregunta y todas sus opciones son obligatorias.');
    if (editingPreguntaId) {
      setProjectConfig(prev => ({ ...prev, trivia: { ...prev.trivia, preguntas: prev.trivia.preguntas.map(p => p.id === editingPreguntaId ? { ...newPregunta, id: editingPreguntaId } : p) } }));
    } else if (projectConfig.trivia.preguntas.length < projectConfig.trivia.cantidad) {
      setProjectConfig(prev => ({ ...prev, trivia: { ...prev.trivia, preguntas: [...prev.trivia.preguntas, { ...newPregunta, id: Date.now() }] } }));
    }
    setNewPregunta({ pregunta: '', opciones: ['', '', '', ''], correcta: 0 });
    setEditingPreguntaId(null);
  };
  const handleEditPregunta = (id: number) => {
    const item = projectConfig.trivia.preguntas.find(p => p.id === id);
    if (item) {
      setNewPregunta(item);
      setEditingPreguntaId(id);
      window.scrollTo(0, 0);
    }
  };
  const cancelEditPregunta = () => {
    setNewPregunta({ pregunta: '', opciones: ['', '', '', ''], correcta: 0 });
    setEditingPreguntaId(null);
  };

  // --- Lógica para Módulo DEDICATORIAS ---
  const handleSaveDedicatoria = () => {
    if (!newDedicatoria.titulo || !newDedicatoria.texto) return alert('El título y el texto son obligatorios.');
    if (editingDedicatoriaId) {
      setProjectConfig(prev => ({ ...prev, dedicatorias: prev.dedicatorias.map(d => d.id === editingDedicatoriaId ? { ...newDedicatoria, id: editingDedicatoriaId } : d) }));
    } else if (projectConfig.dedicatorias.length < projectConfig.dedicatorias_cantidad) {
      setProjectConfig(prev => ({ ...prev, dedicatorias: [...prev.dedicatorias, { ...newDedicatoria, id: Date.now() }] }));
    }
    setNewDedicatoria({ titulo: '', texto: '', musica: '' });
    setEditingDedicatoriaId(null);
  };
  const handleEditDedicatoria = (id: number) => {
    const item = projectConfig.dedicatorias.find(d => d.id === id);
    if (item) {
      setNewDedicatoria(item);
      setEditingDedicatoriaId(id);
      window.scrollTo(0, 0);
    }
  };
  const cancelEditDedicatoria = () => {
    setNewDedicatoria({ titulo: '', texto: '', musica: '' });
    setEditingDedicatoriaId(null);
  };


  const renderStepContent = () => {
    const step = steps[currentStep];
    const normalizedId = step.id.replace('modulo-', '');

    switch (normalizedId) {
      case 'general':
        return (
          <div className="form-container">
            <div className="input-group"><label><Heart size={16} /> Nombres de la Pareja</label><input type="text" placeholder="Ej: Said y Dethh" value={projectConfig.pareja} onChange={(e) => setProjectConfig({...projectConfig, pareja: e.target.value})} /></div>
            <div className="input-group"><label>Mensaje de Bienvenida</label><textarea placeholder="Escribe una dedicatoria inicial..." value={projectConfig.mensajeBienvenida} onChange={(e) => setProjectConfig({...projectConfig, mensajeBienvenida: e.target.value})} /></div>
            <div className="input-group">
              <label><Palette size={16} /> Tema Global de la Experiencia</label>
              <div className="theme-grid-config">{THEME_OPTIONS.map(t => (<div key={t.id} className={`theme-option-card ${projectConfig.tema === t.id ? 'active' : ''}`} onClick={() => setProjectConfig({...projectConfig, tema: t.id})} style={projectConfig.tema === t.id ? { borderColor: t.color } : {}}><div className="theme-color-dot" style={{ background: t.color }}></div><span>{t.name}</span>{projectConfig.tema === t.id && <CheckCircle2 size={16} className="check-icon" />}</div>))}</div>
            </div>
          </div>
        );

      case 'historia':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group"><label>Subtítulo de la Galería</label><input type="text" placeholder="Ej: Un recorrido por nuestros momentos..." value={projectConfig.historiaSubtitle} onChange={(e) => setProjectConfig({...projectConfig, historiaSubtitle: e.target.value})} /></div>
              <div className="input-group"><label>¿Cuántos momentos quieres?</label><select value={projectConfig.historia_cantidad} onChange={(e) => setProjectConfig({...projectConfig, historia_cantidad: parseInt(e.target.value, 10)})}><option value={5}>5 Momentos</option><option value={8}>8 Momentos</option><option value={12}>12 Momentos</option></select></div>
            </div>
            <div className={`memoria-form-card ${editingMemoriaId ? 'editing' : ''}`}>
              <div className="card-header-with-limit"><h3><Camera size={18} /> {editingMemoriaId ? "Editando Momento" : "Añadir Nuevo Momento"}</h3><span className={`limit-badge ${projectConfig.memorias.length >= projectConfig.historia_cantidad && !editingMemoriaId ? 'danger' : ''}`}>{projectConfig.memorias.length}/{projectConfig.historia_cantidad}</span></div>
              <div className="upload-placeholder-container"><div className="upload-visual-box"><Upload size={32} /><span>Subir Foto</span></div></div>
              <div className="grid-2-cols"><div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Primera cita" value={newMemoria.titulo} onChange={(e) => setNewMemoria({...newMemoria, titulo: e.target.value})} /></div><div className="input-group"><label>Fecha</label><input type="text" placeholder="Ej: 14 Feb" value={newMemoria.fecha} onChange={(e) => setNewMemoria({...newMemoria, fecha: e.target.value})} /></div></div>
              <div className="input-group"><label>Descripción</label><textarea placeholder="Cuenta qué pasó..." value={newMemoria.texto} onChange={(e) => setNewMemoria({...newMemoria, texto: e.target.value})} /></div>
              <div className="form-actions">{editingMemoriaId && (<button className="btn-cancel-edit" onClick={cancelEditMemoria}>Cancelar</button>)}<button className="btn-add-item" onClick={handleSaveMemoria} disabled={projectConfig.memorias.length >= projectConfig.historia_cantidad && !editingMemoriaId}>{editingMemoriaId ? 'Actualizar Momento' : <><Plus size={18} /> Guardar Momento</>}</button></div>
            </div>
            <div className="items-list-container">{projectConfig.memorias.map(m => (<div key={m.id} className="item-summary-card"><div className="item-info"><strong>{m.titulo}</strong><span>{m.fecha}</span></div><div className="item-actions"><button className="btn-edit-item" onClick={() => handleEditMemoria(m.id)}><Pencil size={16} /></button><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, memorias: projectConfig.memorias.filter(x => x.id !== m.id)})}><Trash2 size={16} /></button></div></div>))}</div>
          </div>
        );
      
      case 'tarjetas':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group">
                <label>Mensaje de Inicio (Sobre)</label>
                <input type="text" placeholder="Ej: Nuestras cartas guardadas..." value={projectConfig.mensajeInicioTarjetas} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioTarjetas: e.target.value})} />
              </div>
              <div className="input-group">
                <label>¿Cuántas cartas quieres?</label>
                <select value={projectConfig.tarjetas_cantidad} onChange={(e) => setProjectConfig({...projectConfig, tarjetas_cantidad: parseInt(e.target.value, 10)})}>
                  <option value={3}>3 Cartas</option>
                  <option value={5}>5 Cartas</option>
                  <option value={8}>8 Cartas</option>
                  <option value={10}>10 Cartas</option>
                </select>
              </div>
            </div>
            <div className={`memoria-form-card ${editingTarjetaId ? 'editing' : ''}`}>
              <div className="card-header-with-limit"><h3><Layers size={18} /> {editingTarjetaId ? 'Editando Carta' : 'Añadir Nueva Carta'}</h3><span className={`limit-badge ${projectConfig.tarjetas.length >= projectConfig.tarjetas_cantidad && !editingTarjetaId ? 'danger' : ''}`}>{projectConfig.tarjetas.length}/{projectConfig.tarjetas_cantidad}</span></div>
              <div className="upload-placeholder-container"><div className="upload-visual-box"><Upload size={32} /><span>Imagen de la Carta</span></div></div>
              <div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Para ti" value={newTarjeta.titulo} onChange={(e) => setNewTarjeta({...newTarjeta, titulo: e.target.value})} /></div>
              <div className="input-group"><label>Mensaje</label><textarea placeholder="Algo corto..." value={newTarjeta.contenido} onChange={(e) => setNewTarjeta({...newTarjeta, contenido: e.target.value})} /></div>
              <div className="form-actions">{editingTarjetaId && (<button className="btn-cancel-edit" onClick={cancelEditTarjeta}>Cancelar</button>)}<button className="btn-add-item" onClick={handleSaveTarjeta} disabled={projectConfig.tarjetas.length >= projectConfig.tarjetas_cantidad && !editingTarjetaId}>{editingTarjetaId ? 'Actualizar Carta' : <><Plus size={18} /> Guardar Carta</>}</button></div>
            </div>
            <div className="items-list-container">{projectConfig.tarjetas.map(t => (<div key={t.id} className="item-summary-card"><div className="item-info"><strong>{t.titulo}</strong></div><div className="item-actions"><button className="btn-edit-item" onClick={() => handleEditTarjeta(t.id)}><Pencil size={16} /></button><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, tarjetas: projectConfig.tarjetas.filter(x => x.id !== t.id)})}><Trash2 size={16} /></button></div></div>))}</div>
          </div>
        );

      case 'trivia':
        return (
          <div className="form-container">
            <div className="grid-3-cols config-header-field">
              <div className="input-group"><label>Mensaje de Victoria</label><input type="text" placeholder="Ej: ¡Sabía que me conocías!" value={projectConfig.trivia.mensajeExito} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeExito: e.target.value }})} /></div>
              <div className="input-group"><label>Mensaje de Error</label><input type="text" placeholder="Ej: ¡Inténtalo de nuevo!" value={projectConfig.trivia.mensajeError} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeError: e.target.value }})} /></div>
              <div className="input-group"><label>¿Cuántas preguntas?</label><select value={projectConfig.trivia.cantidad} onChange={(e) => setProjectConfig({...projectConfig, trivia: {...projectConfig.trivia, cantidad: parseInt(e.target.value, 10)}})}><option value={3}>3 Preguntas</option><option value={5}>5 Preguntas</option><option value={10}>10 Preguntas</option></select></div>
            </div>
            <div className={`memoria-form-card ${editingPreguntaId ? 'editing' : ''}`}>
              <div className="card-header-with-limit"><h3><Gamepad2 size={18} /> {editingPreguntaId ? 'Editando Pregunta' : 'Añadir Pregunta'}</h3><span className={`limit-badge ${projectConfig.trivia.preguntas.length >= projectConfig.trivia.cantidad && !editingPreguntaId ? 'danger' : ''}`}>{projectConfig.trivia.preguntas.length}/{projectConfig.trivia.cantidad}</span></div>
              <div className="input-group"><label>Texto de la Pregunta</label><input type="text" placeholder="Ej: ¿Mi comida favorita?" value={newPregunta.pregunta} onChange={(e) => setNewPregunta({...newPregunta, pregunta: e.target.value})} /></div>
              <div className="input-group"><label>Opciones (marca la correcta)</label><div className="options-config-grid">{newPregunta.opciones.map((op, idx) => (<div key={idx} className={`option-input-group ${newPregunta.correcta === idx ? 'is-correct' : ''}`}><button className="btn-select-correct" onClick={() => setNewPregunta({...newPregunta, correcta: idx})}>{newPregunta.correcta === idx ? <CheckCircle2 /> : <div className="circle-placeholder" />}</button><input type="text" placeholder={`Opción ${idx + 1}`} value={op} onChange={(e) => { const n = [...newPregunta.opciones]; n[idx] = e.target.value; setNewPregunta({...newPregunta, opciones: n}); }} /></div>))}</div></div>
              <div className="form-actions">{editingPreguntaId && (<button className="btn-cancel-edit" onClick={cancelEditPregunta}>Cancelar</button>)}<button className="btn-add-item" onClick={handleSavePregunta} disabled={projectConfig.trivia.preguntas.length >= projectConfig.trivia.cantidad && !editingPreguntaId}>{editingPreguntaId ? 'Actualizar Pregunta' : <><Plus size={18} /> Guardar Pregunta</>}</button></div>
            </div>
            <div className="items-list-container">{projectConfig.trivia.preguntas.map(p => (<div key={p.id} className="item-summary-card"><div className="item-info"><strong>{p.pregunta}</strong><span>R: {p.opciones[p.correcta]}</span></div><div className="item-actions"><button className="btn-edit-item" onClick={() => handleEditPregunta(p.id)}><Pencil size={16} /></button><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, preguntas: projectConfig.trivia.preguntas.filter(x => x.id !== p.id) }})}><Trash2 size={16} /></button></div></div>))}</div>
          </div>
        );

      case 'dedicatorias':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group"><label>Mensaje de Inicio (Cofre)</label><input type="text" placeholder="Ej: He preparado algo especial..." value={projectConfig.mensajeInicioDedic} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioDedic: e.target.value})} /></div>
              <div className="input-group"><label>¿Cuántas dedicatorias?</label><select value={projectConfig.dedicatorias_cantidad} onChange={(e) => setProjectConfig({...projectConfig, dedicatorias_cantidad: parseInt(e.target.value, 10)})}><option value={1}>1 Dedicatoria</option><option value={3}>3 Dedicatorias</option><option value={5}>5 Dedicatorias</option></select></div>
            </div>
            <div className={`memoria-form-card ${editingDedicatoriaId ? 'editing' : ''}`}>
              <div className="card-header-with-limit"><h3><Mail size={18} /> {editingDedicatoriaId ? 'Editando Dedicatoria' : 'Nueva Dedicatoria'}</h3><span className={`limit-badge ${projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId ? 'danger' : ''}`}>{projectConfig.dedicatorias.length}/{projectConfig.dedicatorias_cantidad}</span></div>
              <div className="input-group"><label>Título</label><input type="text" placeholder="Ej: Mi promesa" value={newDedicatoria.titulo} onChange={(e) => setNewDedicatoria({...newDedicatoria, titulo: e.target.value})} /></div>
              <div className="input-group"><label>Mensaje</label><textarea placeholder="Escribe aquí..." value={newDedicatoria.texto} onChange={(e) => setNewDedicatoria({...newDedicatoria, texto: e.target.value})} /></div>
              <div className="form-actions">{editingDedicatoriaId && (<button className="btn-cancel-edit" onClick={cancelEditDedicatoria}>Cancelar</button>)}<button className="btn-add-item" onClick={handleSaveDedicatoria} disabled={projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId}>{editingDedicatoriaId ? 'Actualizar Dedicatoria' : <><Plus size={18} /> Guardar Dedicatoria</>}</button></div>
            </div>
            <div className="items-list-container">{projectConfig.dedicatorias.map(d => (<div key={d.id} className="item-summary-card"><div className="item-info"><strong>{d.titulo}</strong></div><div className="item-actions"><button className="btn-edit-item" onClick={() => handleEditDedicatoria(d.id)}><Pencil size={16} /></button><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, dedicatorias: projectConfig.dedicatorias.filter(x => x.id !== d.id)})}><Trash2 size={16} /></button></div></div>))}</div>
          </div>
        );
      
      // --- OTROS MÓDULOS ---
      case 'contador':
        return (
          <div className="memoria-form-card">
            <h3><Clock size={18} /> Configuración del Contador</h3>
            <div className="grid-2-cols">
              <div className="input-group">
                <label>Título del Contador</label>
                <input type="text" placeholder="Ej: Nuestro Tiempo Juntos" value={projectConfig.contador.titulo} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, titulo: e.target.value }})} />
              </div>
              <div className="input-group">
                <label>Subtítulo de Apoyo</label>
                <input type="text" placeholder="Ej: Cada segundo cuenta..." value={projectConfig.contador.subtitulo} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, subtitulo: e.target.value }})} />
              </div>
            </div>
            <div className="input-group">
              <label>Fecha Especial (Día Cero)</label>
              <input type="date" value={projectConfig.contador.fecha} onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, fecha: e.target.value }})} />
            </div>
          </div>
        );
      case 'evasivo':
        return <div className="form-container"><div className="input-group"><label><MousePointer2 size={16} /> La Pregunta Trampa</label><input type="text" placeholder="Ej: ¿Me perdonas?" value={projectConfig.evasivo.pregunta} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, pregunta: e.target.value }})} /></div><div className="grid-2-cols"><div className="input-group"><label>Texto Botón "SÍ"</label><input type="text" placeholder="Ej: Sí, obvio" value={projectConfig.evasivo.textoSi} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoSi: e.target.value }})} /></div><div className="input-group"><label>Texto Botón "NO"</label><input type="text" placeholder="Ej: No, jamás" value={projectConfig.evasivo.textoNo} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoNo: e.target.value }})} /></div></div><div className="input-group"><label>Mensaje tras aceptar</label><textarea placeholder="Ej: ¡Sabía que dirías que sí!" value={projectConfig.evasivo.mensajeExito} onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, mensajeExito: e.target.value }})} /></div></div>;
      case 'wrapped':
        return <WrappedFormConfigurator projectConfig={projectConfig} setProjectConfig={setProjectConfig} />;
      case 'final':
        return <div className="form-container"><div className="order-summary-card"><div className="summary-header"><ShoppingBag size={24} /><h3>Resumen de tu Experiencia</h3></div><div className="summary-details"><div className="summary-row"><span>Pareja:</span><strong>{projectConfig.pareja}</strong></div><div className="summary-row"><span>Pack Elegido:</span><strong>{selectedPack?.nombre || 'Personalizado'}</strong></div><div className="summary-row"><span>Tema Seleccionado:</span><div className="theme-preview-mini"><div className="theme-color-dot" style={{ background: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color }}></div><strong>{THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.name}</strong></div></div></div><div className="summary-modules-list"><h4>Módulos Configurados:</h4><ul>{modules.map((m: string) => (<li key={m}><Layout size={14} />{m.replace('modulo-', '').toUpperCase()}<Check size={14} className="check-icon-green" /></li>))}</ul></div><div className="summary-total"><span>Inversión Total:</span><span className="total-amount">${total} MXN</span></div></div><div className="final-notice"><Sparkles size={20} /><p>Al finalizar, nuestro equipo de producción recibirá vuestros datos y comenzará la construcción de vuestra experiencia digital exclusiva.</p></div></div>;
      default:
        return <div className="placeholder-form"><p>Configuración para: <strong>{step.title}</strong></p><p className="hint">Módulo en construcción.</p></div>;
    }
  };

  return (
    <div className="configurator-layout">
      <nav className="config-nav">
        <button className="back-btn" onClick={handleBack}><ArrowLeft size={20} /><span>Regresar</span></button>
        <div className="progress-container"><div className="progress-bar"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} /></div><span className="step-counter">Paso {currentStep + 1} de {steps.length}</span></div>
        <div className="config-logo">Ravyn Studio</div>
      </nav>
      <main className="config-main">
        <AnimatePresence mode="wait">
          <motion.section key={steps[currentStep].id} className="config-step-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="step-header"><span className="step-tag">Ravyn Studio</span><h1>{steps[currentStep].title}</h1><p>Confirmación de vuestra experiencia digital.</p></div>
            <div className="step-content">{renderStepContent()}</div>
            <div className="step-actions"><button className="btn-secondary" onClick={handleBack}><ChevronLeft size={20} /> Atrás</button><button className="btn-primary" onClick={handleNext}>{currentStep === steps.length - 1 ? 'Finalizar Construcción' : 'Siguiente Paso'} <ChevronRight size={20} /></button></div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Configurator;
