import React, { useState } from 'react';
import { 
  FileDown, FileUp, List, Sparkles, SlidersHorizontal, 
  HelpCircle, MessageSquare, Heart, Users 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WrappedFormConfiguratorProps {
  projectConfig: any;
  setProjectConfig: (config: any) => void;
}

const HelpTip = ({ text }: { text: string }) => (
  <div className="help-tip-container">
    <HelpCircle size={14} className="help-icon-trigger" />
    <span className="help-tooltip-text">{text}</span>
  </div>
);

const WrappedFormConfigurator: React.FC<WrappedFormConfiguratorProps> = ({ projectConfig, setProjectConfig }) => {
  const [mode, setMode] = useState<'manual' | 'analizar'>('manual');

  const handleInputChange = (field: string, value: any) => {
    setProjectConfig((prev: any) => ({
      ...prev,
      wrapped: {
        ...prev.wrapped,
        [field]: value,
      },
    }));
  };

  const handlePacienciaChange = (yo: number) => {
    const tu = 100 - yo;
    setProjectConfig((prev: any) => ({
      ...prev,
      wrapped: {
        ...prev.wrapped,
        pacienciaYo: yo,
        pacienciaTu: tu,
      },
    }));
  };

  const getPacienciaStatus = (val: number) => {
    if (val <= 10) return { label: "Peligro: Explosión inminente 🌋", color: "#d32f2f" };
    if (val <= 30) return { label: "Mecha corta 🧨", color: "#f57c00" };
    if (val <= 50) return { label: "Humano promedio ☕", color: "#1a4073" };
    if (val <= 70) return { label: "Resistencia nivel Zen 🧘", color: "#388e3c" };
    if (val <= 90) return { label: "Nivel: Santo 😇", color: "#00c853" };
    return { label: "Inmortal / Paciencia infinita ✨", color: "#7b1fa2" };
  };

  const pacienciaStatus = getPacienciaStatus(projectConfig.wrapped.pacienciaYo);

  const manualFieldsContent = (
    <>
      <div className="wrapped-section-card">
        <div className="section-header">
          <Heart size={18} />
          <h3>Nuestra Historia</h3>
        </div>
        <div className="grid-2-cols">
          <div className="input-group">
            <label>Días Juntos <HelpTip text="Días totales de su aventura." /></label>
            <input type="number" placeholder="Ej: 1095" value={projectConfig.wrapped.diasJuntos} onChange={(e) => handleInputChange('diasJuntos', e.target.value)} />
          </div>
          <div className="input-group">
            <label>Canción que los define <HelpTip text="Enlace de su canción en Spotify." /></label>
            <input type="text" placeholder="Ej: El enlace de su canción" value={projectConfig.wrapped.cancionSpotify} onChange={(e) => handleInputChange('cancionSpotify', e.target.value)} />
          </div>
        </div>
        <h4 className="sub-section-title">Temas de Conversación (Top 3)</h4>
        <div className="grid-3-cols">
          <div className="input-group"><label>Tema #1</label><input type="text" placeholder="Ej: Chisme del Tec" value={projectConfig.wrapped.tema1} onChange={(e) => handleInputChange('tema1', e.target.value)} /></div>
          <div className="input-group"><label>Tema #2</label><input type="text" placeholder="Ej: Qué cenar" value={projectConfig.wrapped.tema2} onChange={(e) => handleInputChange('tema2', e.target.value)} /></div>
          <div className="input-group"><label>Tema #3</label><input type="text" placeholder="Ej: Minecraft" value={projectConfig.wrapped.tema3} onChange={(e) => handleInputChange('tema3', e.target.value)} /></div>
        </div>
      </div>

      <div className="wrapped-section-card">
        <div className="section-header">
          <Users size={18} />
          <h3>Dinámica de Pareja</h3>
        </div>
        <div className="input-group">
          <label>¿Quién pide perdón primero? <HelpTip text="Esa persona que siempre cede por la paz." /></label>
          <input type="text" placeholder="Ej: Said" value={projectConfig.wrapped.perdonadorTop} onChange={(e) => handleInputChange('perdonadorTop', e.target.value)} />
        </div>

        <div className="paciencia-meter-container">
          <label className="meter-label"><SlidersHorizontal size={14} /> Medidor de Paciencia</label>
          <div className="paciencia-labels">
            <span>Tu paciencia ({projectConfig.wrapped.pacienciaYo}%)</span>
            <span>Su paciencia ({projectConfig.wrapped.pacienciaTu}%)</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={projectConfig.wrapped.pacienciaYo} 
            onChange={(e) => handlePacienciaChange(parseInt(e.target.value, 10))} 
            className="ravyn-paciencia-slider"
          />
          <div className="paciencia-dynamic-status" style={{ color: pacienciaStatus.color, fontWeight: '700', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center' }}>
            {pacienciaStatus.label}
          </div>
        </div>

        <h4 className="sub-section-title"><Sparkles size={14} /> Premios de la Relación</h4>
        <div className="grid-3-cols">
          <div className="input-group"><label>🏆 Más dramatic@</label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio1Ganador} onChange={(e) => handleInputChange('premio1Ganador', e.target.value)} /></div>
          <div className="input-group"><label>🏆 Mejor chef</label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio2Ganador} onChange={(e) => handleInputChange('premio2Ganador', e.target.value)} /></div>
          <div className="input-group"><label>🏆 Se duerme en todo</label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio3Ganador} onChange={(e) => handleInputChange('premio3Ganador', e.target.value)} /></div>
        </div>
      </div>
    </>
  );

  return (
    <div className="form-container wrapped-form-modern">
      <div className="mode-selector">
        <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
          <List size={16} /> Modo Manual
        </button>
        <button className={mode === 'analizar' ? 'active' : ''} onClick={() => setMode('analizar')}>
          <FileUp size={16} /> Analizar Chat
        </button>
      </div>

      <div className="wrapped-section-card">
        <div className="section-header">
          <MessageSquare size={18} />
          <h3>Estadísticas de Chat</h3>
        </div>
        
        {mode === 'analizar' ? (
          <div className="upload-chat-container">
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
              Tus datos son eliminados tras extraer las métricas. <strong>Nosotros nunca guardamos su información privada.</strong>
            </p>
            <div className="upload-dropzone">
              <FileDown size={40} />
              <span>Arrastra y suelta el archivo de chat aquí</span>
              <small>Soportamos .zip, .txt y .json</small>
            </div>
          </div>
        ) : (
          <div className="grid-3-cols">
            <div className="input-group">
              <label>Total Mensajes <HelpTip text="Número aproximado de mensajes." /></label>
              <input type="number" placeholder="Ej: 150480" value={projectConfig.wrapped.totalMensajes} onChange={(e) => handleInputChange('totalMensajes', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Palabra Top <HelpTip text="La palabra que más repiten." /></label>
              <input type="text" placeholder="Ej: 'Te amo' o 'Tengo hambre'" value={projectConfig.wrapped.palabraTop} onChange={(e) => handleInputChange('palabraTop', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Emoji Top <HelpTip text="El emoji que resume su relación." /></label>
              <input type="text" placeholder="Ej: 🥰 o 🤡" value={projectConfig.wrapped.emojiTop} onChange={(e) => handleInputChange('emojiTop', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Horario Pico <HelpTip text="¿A qué hora hablan más?" /></label>
              <input type="text" placeholder="Ej: 3:00 AM (Desvelados)" value={projectConfig.wrapped.horarioPico} onChange={(e) => handleInputChange('horarioPico', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {manualFieldsContent}
    </div>
  );
};

export default WrappedFormConfigurator;
