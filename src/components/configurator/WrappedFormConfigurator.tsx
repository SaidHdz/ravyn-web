import React, { useState } from 'react';
import { FileDown, FileUp, List, Sparkles, SlidersHorizontal, HelpCircle } from 'lucide-react';
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

  const ManualFields = () => (
    <>
      <div className="input-group">
        <label>
          Días Juntos 
          <HelpTip text="Días totales desde que inició su aventura." />
        </label>
        <input type="number" placeholder="Ej: 1095" value={projectConfig.wrapped.diasJuntos} onChange={(e) => handleInputChange('diasJuntos', e.target.value)} />
      </div>
      <div className="input-group">
        <label>
          Canción que los define (Spotify)
          <HelpTip text="Pega el enlace de su canción favorita compartida." />
        </label>
        <input type="text" placeholder="Link o URI de la canción" value={projectConfig.wrapped.cancionSpotify} onChange={(e) => handleInputChange('cancionSpotify', e.target.value)} />
      </div>
      <div className="input-group">
        <label>
          ¿Quién pide perdón primero?
          <HelpTip text="Ese ser de luz que siempre cede por la paz." />
        </label>
        <input type="text" placeholder="Ej: Said" value={projectConfig.wrapped.perdonadorTop} onChange={(e) => handleInputChange('perdonadorTop', e.target.value)} />
      </div>

      <h4><SlidersHorizontal size={16} /> Medidor de Paciencia</h4>
      <div className="grid-1-col">
        <div className="input-group">
          <div className="paciencia-labels">
            <label>Tu paciencia ({projectConfig.wrapped.pacienciaYo}%)</label>
            <label>Su paciencia ({projectConfig.wrapped.pacienciaTu}%)</label>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={projectConfig.wrapped.pacienciaYo} 
            onChange={(e) => handlePacienciaChange(parseInt(e.target.value, 10))} 
            className="basic-range-slider"
          />
        </div>
      </div>

      <h4><Sparkles size={16} /> Premios de la Relación</h4>
      <div className="grid-2-cols">
        <div className="input-group"><label>🏆 Más dramatic@ <HelpTip text="Persona que hace una película de un corto." /></label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio1Ganador} onChange={(e) => handleInputChange('premio1Ganador', e.target.value)} /></div>
        <div className="input-group"><label>🏆 Mejor chef <HelpTip text="Quien domina la cocina o los pedidos por app." /></label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio2Ganador} onChange={(e) => handleInputChange('premio2Ganador', e.target.value)} /></div>
        <div className="input-group"><label>🏆 Se duerme en todo <HelpTip text="La persona que es un koala profesional." /></label><input type="text" placeholder="Nombre" value={projectConfig.wrapped.premio3Ganador} onChange={(e) => handleInputChange('premio3Ganador', e.target.value)} /></div>
      </div>
    </>
  );

  return (
    <div className="form-container wrapped-form">
      <div className="mode-selector">
        <button className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
          <List size={16} /> Modo Manual
        </button>
        <button className={mode === 'analizar' ? 'active' : ''} onClick={() => setMode('analizar')}>
          <FileUp size={16} /> Analizar Chat
        </button>
      </div>

      {mode === 'manual' && (
        <div className="manual-mode-form">
          <p className="hint">Llena todos los campos para crear tu Wrapped personalizado.</p>
          <div className="grid-3-cols">
            <div className="input-group">
              <label>Total Mensajes <HelpTip text="Un número aproximado de lo mucho que hablan." /></label>
              <input type="number" placeholder="Ej: 150480" value={projectConfig.wrapped.totalMensajes} onChange={(e) => handleInputChange('totalMensajes', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Palabra Top <HelpTip text="Esa palabra que no para de salir en el chat." /></label>
              <input type="text" placeholder="Ej: 'Amor'" value={projectConfig.wrapped.palabraTop} onChange={(e) => handleInputChange('palabraTop', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Emoji Top <HelpTip text="El emoji que resume su relación." /></label>
              <input type="text" placeholder="Ej: 🥰" value={projectConfig.wrapped.emojiTop} onChange={(e) => handleInputChange('emojiTop', e.target.value)} />
            </div>
          </div>
          <div className="grid-2-cols">
             <div className="input-group">
               <label>Horario Pico <HelpTip text="¿A qué hora son más intensos?" /></label>
               <input type="text" placeholder="Ej: 3:00 AM" value={projectConfig.wrapped.horarioPico} onChange={(e) => handleInputChange('horarioPico', e.target.value)} />
             </div>
          </div>
          <h4>Temas de Conversación (Top 3)</h4>
          <div className="grid-3-cols">
            <div className="input-group"><label>Tema #1 <HelpTip text="Lo que más ocupa sus mentes." /></label><input type="text" placeholder="Ej: Gatitos" value={projectConfig.wrapped.tema1} onChange={(e) => handleInputChange('tema1', e.target.value)} /></div>
            <div className="input-group"><label>Tema #2</label><input type="text" placeholder="Ej: Comida" value={projectConfig.wrapped.tema2} onChange={(e) => handleInputChange('tema2', e.target.value)} /></div>
            <div className="input-group"><label>Tema #3</label><input type="text" placeholder="Ej: Dormir" value={projectConfig.wrapped.tema3} onChange={(e) => handleInputChange('tema3', e.target.value)} /></div>
          </div>
          <hr className="field-divider" />
          <ManualFields />
        </div>
      )}

      {mode === 'analizar' && (
        <div className="analizar-mode-form">
            <div className="upload-chat-container">
                <h3><FileUp size={24}/> Sube tu Archivo de Chat</h3>
                <p>Exporta tu chat de WhatsApp, Instagram o Messenger y súbelo aquí.</p>
                <div className="upload-dropzone">
                    <FileDown size={40} />
                    <span>Arrastra y suelta el archivo aquí o haz clic para seleccionar</span>
                    <small>Formatos soportados: .zip, .txt, .json</small>
                </div>
            </div>
            <hr className="field-divider" />
            <h3><List size={20} /> Completa los Datos Manuales</h3>
            <p className="hint">Estos datos no se pueden obtener del chat, por favor ingrésalos.</p>
            <ManualFields />
        </div>
      )}
    </div>
  );
};

export default WrappedFormConfigurator;
