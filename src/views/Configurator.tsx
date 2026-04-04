import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { 
  X,
  Check,
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  Palette, 
  Type, 
  Camera, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Upload, 
  Clock, 
  Layers, 
  Gamepad2, 
  MousePointer2, 
  Music, 
  Mail, 
  ShoppingBag, 
  Sparkles, 
  Layout, 
  Pencil, 
  Zap, 
  Hourglass, 
  Image as PhotoFrame, 
  HelpCircle, 
  Users, 
  Eye, 
  Loader2, 
  CloudUpload, 
  Wand2
} from 'lucide-react';
import WrappedFormConfigurator from '@/components/configurator/WrappedFormConfigurator';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/lib/supabase';
import ThemeManager from '@/components/ThemeManager';
import LivePreviewModal from '@/components/configurator/LivePreviewModal';
import { transformFormToLienzo } from '@/utils/mapeadorPedido';
import '@/styles/landing/configurator.css';

const N8N_WEBHOOK_URL = 'https://ravyb.app.n8n.cloud/webhook/v1/nueva-experiencia'; 
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || '';

const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
const RESERVED_SLUGS = ['admin', 'configurator', 'success', 'api'];

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

const HelpTip = ({ text }: { text: string }) => (
  <div className="help-tip-container">
    <HelpCircle size={14} className="help-icon-trigger" />
    <span className="help-tooltip-text">{text}</span>
  </div>
);

const LiveCounter = ({ date }: { date: string }) => {
  const [timePassed, setTimePassed] = useState("");

  useEffect(() => {
    if (!date) {
      setTimePassed("");
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(date).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      if (diff < 0) {
        setTimePassed("¡Faltan pocos días para esta fecha especial!");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimePassed(`Resultado: Han pasado ${days.toLocaleString()} días, ${hours} horas, ${minutes} minutos y ${seconds} segundos`);
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  if (!date) return null;

  return (
    <div className="live-counter-preview" style={{ 
      marginTop: '1rem', 
      padding: '1rem', 
      background: '#f0f7ff', 
      borderRadius: '12px',
      border: '1px solid #cce3ff',
      color: '#0056b3',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <Sparkles size={16} />
      <span>{timePassed || "Calculando..."}</span>
    </div>
  );
};

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
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Estados para Identidad Digital (Modo Mantenimiento)
  const [emailCliente, setEmailCliente] = useState('');
  const [chosenSlug, setChosenSlug] = useState('');
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chosenSlug.length < 3) {
        setIsSlugAvailable(null);
        return;
      }
      if (RESERVED_SLUGS.includes(chosenSlug.toLowerCase())) {
        setIsSlugAvailable(false);
        return;
      }
      setIsCheckingSlug(true);
      setTimeout(() => {
        setIsSlugAvailable(true);
        setIsCheckingSlug(false);
      }, 600);
    }, 500);
    return () => clearTimeout(timer);
  }, [chosenSlug]);

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setChosenSlug(val);
  };
  
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const historiaInputRef = useRef<HTMLInputElement>(null);
  const tarjetasInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!modules || modules.length === 0) navigate('/');
  }, [modules, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'historia' | 'tarjetas') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      try {
        if (e.target) e.target.value = ''; 
      } catch (err) {}
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
            if (type === 'historia') {
              setNewMemoria(prevM => ({ ...prevM, foto: reader.result as string }));
            } else {
              setNewTarjeta(prevT => ({ ...prevT, imagen: reader.result as string }));
            }
            setIsUploading(false);
            setUploadProgress(0);
          };
          reader.readAsDataURL(file);
          try {
            if (e.target) e.target.value = '';
          } catch (err) {}
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const [processingOrder, setProcessingOrder] = useState(false);
  const [processingStep, setProcessingStep] = useState<'compressing' | 'uploading' | 'generating' | 'success' | 'error'>('compressing');
  const [uploadProgressText, setUploadProgressText] = useState('');

  const processOrderAndDeploy = async () => {
    setProcessingOrder(true);
    setProcessingStep('compressing');
    setUploadProgressText('Optimizando imágenes...');

    try {
      const finalPedido = transformFormToLienzo(projectConfig, modules);
      const imageOptions = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: true };
      const itemsToProcess: { parent: any; key: string; url: string; name: string }[] = [];
      
      // --- Lógica de recolección de imágenes (Historia, Tarjetas, Diapositivas) ---
      if (finalPedido.historia?.memorias) {
        finalPedido.historia.memorias.forEach((m, i) => {
          if (m.photo_url && (m.photo_url.startsWith('blob:') || m.photo_url.startsWith('data:image'))) {
            itemsToProcess.push({ parent: finalPedido.historia!.memorias[i], key: 'photo_url', url: m.photo_url, name: `historia-${i}` });
          }
        });
      }
      
      if (finalPedido.tarjetas?.cartas) {
        finalPedido.tarjetas.cartas.forEach((c, i) => {
          if (c.imagen && (c.imagen.startsWith('blob:') || c.imagen.startsWith('data:image'))) {
            itemsToProcess.push({ parent: finalPedido.tarjetas!.cartas[i], key: 'imagen', url: c.imagen, name: `tarjeta-${i}` });
          }
        });
      }

      if (finalPedido.wrapped?.diapositivas) {
        finalPedido.wrapped.diapositivas.forEach((d, i) => {
          if (d.datos?.imagen && (d.datos.imagen.startsWith('blob:') || d.datos.imagen.startsWith('data:image'))) {
            itemsToProcess.push({ parent: finalPedido.wrapped!.diapositivas[i].datos, key: 'imagen', url: d.datos.imagen, name: `wrapped-${i}` });
          }
        });
      }

      // 1. PROCESAMIENTO A BASE64
      for (let i = 0; i < itemsToProcess.length; i++) {
        const item = itemsToProcess[i];
        if (!item.url || item.url.startsWith('https')) continue;

        setUploadProgressText(`Procesando recuerdos (${i + 1}/${itemsToProcess.length})...`);
        
        const blob = await fetch(item.url).then(r => r.blob());
        if (!(blob instanceof Blob) || !blob.type.includes('image')) continue;

        const fileType = blob.type || 'image/jpeg';
        const compressedFile = await imageCompression(
          new File([blob], `${item.name}.jpg`, { type: fileType }), 
          imageOptions
        );
        
        const base64Data = await fileToBase64(compressedFile);
        item.parent[item.key] = base64Data;
      }

      setProcessingStep('uploading');
      setUploadProgressText('Guardando borrador...');

      // 2. GUARDAR EN SUPABASE BORRADORES
      const orderId = `RAV-${Date.now()}`;
      const { data: draftData, error: draftError } = await supabase
        .from('borradores')
        .insert({
          config_json: finalPedido,
          email_cliente: emailCliente,
          chosen_slug: chosenSlug,
          order_id: orderId,
          total_mxn: total,
          status: 'pending_payment'
        })
        .select()
        .single();

      if (draftError) throw draftError;

      setProcessingStep('generating');
      setUploadProgressText('Redirigiendo a pago seguro...');

      // 3. SALTAR A STRIPE CHECKOUT (NUEVA LÓGICA 2026)
      console.log("🚀 ENVIANDO DATOS AL BACKEND:", {
        draft_id: draftData?.id,
        email: emailCliente,
        order_id: orderId,
        total: total
      });

      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: draftData.id,
          email: emailCliente,
          order_id: orderId,
          total: total,
          chosen_slug: chosenSlug // Opcional pero recomendado
        }),
      });

      const session = await response.json();
      console.log("📦 RESPUESTA DEL SERVIDOR:", session);
      
      if (!response.ok || session.error) {
        throw new Error(session.error || 'Error al crear la sesión de pago');
      }

      // --- EL CAMBIO MAESTRO ---
      if (session.url) {
        // Mandamos al usuario directo a la pasarela de Stripe
        window.location.href = session.url;
      } else {
        console.error("❌ El servidor no mandó URL. Recibido:", session);
        throw new Error('No se recibió la URL de redirección de Stripe');
      }

    } catch (error: any) {
      console.error('❌ Error en el pipeline de pago:', error);
      setProcessingStep('error');
      // Aquí podrías poner un toast o mensaje para que Said sepa qué falló
    }
  };

  const handleFinish = () => {
    processOrderAndDeploy();
  };

  const renderProcessingModal = () => {
    return (
      <div className="pack-modal-overlay" style={{ zIndex: 10000, background: 'rgba(248, 250, 252, 0.95)', backdropFilter: 'blur(12px)' }}>
        <motion.div 
          className="processing-modal-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            background: '#ffffff', 
            padding: '3.5rem 2rem', 
            borderRadius: '40px', 
            textAlign: 'center', 
            maxWidth: '480px', 
            width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0,0,0,0.05)',
            color: '#0f172a'
          }}
        >
          {processingStep === 'success' ? (
            <div className="success-step">
              <div className="success-icon-anim" style={{ background: '#10b981', color: '#fff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                <Check size={45} strokeWidth={3} />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1A4073' }}>¡Pedido Recibido!</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{uploadProgressText || 'Preparando tu acceso...'}</p>
            </div>
          ) : processingStep === 'error' ? (
            <div className="error-step">
              <div style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '1.5rem' }}>[X]</div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1A4073' }}>Vaya, algo falló</h2>
              <p style={{ color: '#64748b', marginBottom: '2.5rem' }}>Hubo un error al procesar tus fotos. Por favor intenta de nuevo.</p>
              <button onClick={() => setProcessingOrder(false)} className="btn-primary" style={{ background: '#ef4444', color: '#fff', padding: '1rem 2rem', borderRadius: '14px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
            </div>
          ) : (
            <div className="loading-steps">
              <div className="main-loader" style={{ marginBottom: '2.5rem' }}>
                <Loader2 size={64} className="animate-spin" style={{ color: '#ef4444', margin: '0 auto' }} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '2.5rem', color: '#1A4073', letterSpacing: '-0.02em' }}>{uploadProgressText || 'Procesando...'}</h2>
              
              <div className="steps-vertical-list" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 2rem' }}>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: processingStep === 'compressing' ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <div className={`step-dot`} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: processingStep === 'compressing' ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none' }}></div>
                  <Wand2 size={20} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Optimizando recuerdos</span>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: processingStep === 'uploading' ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <div className={`step-dot`} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: processingStep === 'uploading' ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none' }}></div>
                  <CloudUpload size={20} style={{ color: '#ef4444' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Subiendo a la nube</span>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: processingStep === 'generating' ? 1 : 0.3, transition: 'all 0.3s' }}>
                  <div className={`step-dot`} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', boxShadow: processingStep === 'generating' ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none' }}></div>
                  <Sparkles size={20} style={{ color: '#f59e0b' }} />
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Generando link mágico</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

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

  // --- Lógica para Módulo HISTORIA ---
  const handleSaveMemoria = () => {
    if (!newMemoria.titulo || !newMemoria.texto) return alert('El título y la descripción son obligatorios.');
    
    setIsSaving(true);
    
    // Simulamos un breve procesamiento para feedback visual
    setTimeout(() => {
      if (editingMemoriaId) {
        setProjectConfig(prev => ({ ...prev, memorias: prev.memorias.map(m => m.id === editingMemoriaId ? { ...newMemoria, id: editingMemoriaId } : m) }));
      } else if (projectConfig.memorias.length < projectConfig.historia_cantidad) {
        setProjectConfig(prev => ({ ...prev, memorias: [...prev.memorias, { ...newMemoria, id: Date.now() }] }));
      }
      setNewMemoria({ titulo: '', fecha: '', lugar: '', texto: '', foto: '' });
      setEditingMemoriaId(null);
      setIsSaving(false);
    }, 600);
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

    return (
      <>
        <ThemeManager theme={projectConfig.tema} isStandalone={false} />
        
        {/* Preview Sticky para Móvil - Solo en el paso de Resumen/Checkout */}
        {normalizedId === 'final' && (
          <div className="mobile-only mobile-preview-sticky">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="phone-content-skeleton" style={{ fontFamily: projectConfig.tema === 'minecraft' ? 'monospace' : 'inherit' }}>
                  <div className="skeleton-hero" style={{ 
                    background: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color + '22',
                    borderRadius: projectConfig.tema === 'minecraft' ? '0px' : projectConfig.tema === 'cute-soft' ? '20px' : '12px'
                  }}>
                    <div className="mini-web-header">
                      <Heart size={16} style={{ color: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color }} />
                      <span className="mini-couple-name" style={{ color: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color }}>{projectConfig.pareja || 'Tu Historia'}</span>
                    </div>
                    <p className="mini-welcome-text">{projectConfig.mensajeBienvenida || 'Personalizando...'}</p>
                  </div>
                  <div className="mini-modules-stack">
                    {modules.slice(0, 4).map((m: string) => (
                      <div key={m} className="mini-module-preview" style={{ borderLeft: `3px solid ${THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color}` }}>
                        <span className="mini-module-title">{m.replace('modulo-', '').toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(() => {
          switch (normalizedId) {
            case 'general':
              return (
                <div className="form-container">
                  <div className="wrapped-section-card">
                    <div className="section-header">
                      <Users size={18} />
                      <h3>Datos de la Pareja</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                      Personaliza los nombres y el mensaje que tu pareja verá al entrar en la experiencia.
                    </p>
                    
                    <div className="input-group">
                      <label><Heart size={16} /> Nombres de la Pareja <HelpTip text="Ej: Said y Dethh o Tus Momentos" /></label>
                      <input 
                        type="text" 
                        placeholder="Ej: Said y Dethh" 
                        value={projectConfig.pareja} 
                        maxLength={50}
                        onChange={(e) => setProjectConfig({...projectConfig, pareja: e.target.value})} 
                      />
                      <div className={`char-counter ${projectConfig.pareja.length >= 45 ? 'warning' : ''}`}>{projectConfig.pareja.length}/50</div>
                    </div>
                    
                    <div className="input-group" style={{ marginTop: '1rem' }}>
                      <label>Mensaje de Bienvenida <HelpTip text="Una dedicatoria corta que aparecerá en la pantalla principal." /></label>
                      <textarea 
                        placeholder="Escribe una dedicatoria inicial..." 
                        value={projectConfig.mensajeBienvenida} 
                        maxLength={200}
                        onChange={(e) => setProjectConfig({...projectConfig, mensajeBienvenida: e.target.value})} 
                      />
                      <div className={`char-counter ${projectConfig.mensajeBienvenida.length >= 180 ? 'warning' : ''}`}>{projectConfig.mensajeBienvenida.length}/200</div>
                    </div>
                  </div>

                  <div 
                    className={`wrapped-section-card theme-preview-card theme-${projectConfig.tema}`}
                  >
                    <div className="section-header">
                      <Palette size={18} />
                      <h3>Selector de Temas</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                      Desliza y elige la estética visual para tu historia.
                    </p>
                    <div className="theme-grid-config horizontal-scroll-themes">
                      {THEME_OPTIONS.map(t => (
                        <div 
                          key={t.id} 
                          className={`theme-option-card ${projectConfig.tema === t.id ? 'active' : ''}`} 
                          onClick={() => setProjectConfig({...projectConfig, tema: t.id})} 
                          style={projectConfig.tema === t.id ? { 
                            borderColor: t.color,
                            background: `${t.color}10`
                          } : {}}
                        >
                          <div className="theme-color-dot" style={{ background: t.color }}></div>
                          <span>{t.name}</span>
                          {projectConfig.tema === t.id && <CheckCircle2 size={16} className="check-icon" style={{ color: t.color }} />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );

      case 'historia':
        const canSaveMemoria = newMemoria.titulo.trim() !== '' && newMemoria.texto.trim() !== '';

        return (
          <div className="form-container">
            <div className="wrapped-section-card" style={{ marginBottom: '0.5rem' }}>
              <div className="section-header">
                <Camera size={18} />
                <h3>Galería de Momentos</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                Un recorrido visual por tu historia. Añade las fotos más especiales y cuenta qué las hace inolvidables.
              </p>
              <div className="grid-2-cols config-header-field">
                <div className="input-group">
                  <label>Subtítulo de la Galería <HelpTip text="Aparecerá como introducción antes de ver las fotos." /></label>
                  <input type="text" placeholder="Ej: Un recorrido por los mejores momentos..." value={projectConfig.historiaSubtitle} onChange={(e) => setProjectConfig({...projectConfig, historiaSubtitle: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>¿Cuántas memorias quieres?</label>
                  <select value={projectConfig.historia_cantidad} onChange={(e) => setProjectConfig({...projectConfig, historia_cantidad: parseInt(e.target.value, 10)})}>
                    <option value={5}>5 Momentos</option>
                    <option value={8}>8 Momentos</option>
                    <option value={12}>12 Momentos</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={editingMemoriaId ? `edit-${editingMemoriaId}` : `new-${projectConfig.memorias.length}`}
                className={`memoria-form-card ${editingMemoriaId ? 'editing' : ''}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card-header-with-limit">
                  <h3>{editingMemoriaId ? "Editando Momento" : "Añadir Nuevo Momento"}</h3>
                  <span className={`limit-badge ${projectConfig.memorias.length >= projectConfig.historia_cantidad && !editingMemoriaId ? 'danger' : ''}`}>
                    {projectConfig.memorias.length}/{projectConfig.historia_cantidad}
                  </span>
                </div>
                
                <div 
                  className={`upload-placeholder-container ${newMemoria.foto ? 'has-image' : ''} ${isUploading ? 'is-uploading' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isUploading) historiaInputRef.current?.click();
                  }}
                >
                  {isUploading ? (
                    <div className="upload-loading-state">
                      <div className="rabanesco-spinner"></div>
                      <span>Subiendo momento mágico... {uploadProgress}%</span>
                      <div className="upload-progress-bar">
                        <motion.div 
                          className="upload-progress-fill" 
                          initial={{ width: 0 }} 
                          animate={{ width: `${uploadProgress}%` }} 
                        />
                      </div>
                    </div>
                  ) : newMemoria.foto ? (
                    <div className="upload-preview-wrapper">
                      <img src={newMemoria.foto} alt="Preview" className="upload-image-preview" />
                      <div className="upload-overlay">
                        <div className="upload-actions">
                          <button 
                            className="btn-change-photo"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              historiaInputRef.current?.click();
                            }}
                          >
                            <ImageIcon size={16} /> Cambiar Foto
                          </button>
                          <button 
                            className="btn-delete-photo"
                            title="Eliminar foto"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewMemoria(prev => ({ ...prev, foto: '' }));
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-visual-box">
                      <Upload size={32} />
                      <span>Subir Foto</span>
                      <span className="upload-hints">Formatos: JPG, PNG • Máx 5MB</span>
                    </div>
                  )}
                </div>

                <div className="grid-2-cols">
                  <div className="input-group">
                    <label>Título</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Primera cita" 
                      value={newMemoria.titulo} 
                      maxLength={50}
                      onChange={(e) => setNewMemoria({...newMemoria, titulo: e.target.value})} 
                    />
                    <div className={`char-counter ${newMemoria.titulo.length >= 45 ? 'warning' : ''}`}>
                      {newMemoria.titulo.length}/50
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Fecha <HelpTip text="Ej: 14 Feb o El día que nos conocimos" /></label>
                    <input 
                      type="text" 
                      placeholder="Ej: 14 Feb" 
                      value={newMemoria.fecha} 
                      onChange={(e) => setNewMemoria({...newMemoria, fecha: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Descripción</label>
                  <textarea 
                    placeholder="Cuenta qué pasó y por qué es un momento especial..." 
                    value={newMemoria.texto} 
                    maxLength={300}
                    onChange={(e) => setNewMemoria({...newMemoria, texto: e.target.value})} 
                  />
                  <div className={`char-counter ${newMemoria.texto.length >= 270 ? 'warning' : ''}`}>
                    {newMemoria.texto.length}/300
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                  {editingMemoriaId && (<button className="btn-cancel-edit" onClick={cancelEditMemoria}>Cancelar</button>)}
                  
                  {projectConfig.memorias.length >= projectConfig.historia_cantidad && !editingMemoriaId ? (
                    <div className="limit-reached-message">
                      <Sparkles size={14} /> ¡Espacio lleno! Ya tienes {projectConfig.historia_cantidad} momentos.
                    </div>
                  ) : (
                    <button 
                      className="btn-add-item" 
                      onClick={handleSaveMemoria} 
                      disabled={!canSaveMemoria || isSaving}
                    >
                      {isSaving ? (
                        <><div className="rabanesco-spinner mini"></div> Procesando...</>
                      ) : (
                        editingMemoriaId ? 'Actualizar Momento' : <><Plus size={18} /> Guardar Momento</>
                      )}
                    </button>
                  )}
                </div>
                {!canSaveMemoria && newMemoria.titulo.trim() !== '' && projectConfig.memorias.length < projectConfig.historia_cantidad && (
                  <p className="validation-hint" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'right' }}>
                    Escribe un título y una descripción para guardar el momento.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="items-list-container">
              <AnimatePresence initial={false}>
                {projectConfig.memorias.map(m => (
                  <motion.div 
                    key={m.id} 
                    className="item-summary-card"
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 20
                    }}
                  >
                    <div className="item-info">
                      <strong>{m.titulo}</strong>
                      <span>{m.fecha}</span>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit-item" onClick={() => handleEditMemoria(m.id)}><Pencil size={16} /></button>
                      <button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, memorias: projectConfig.memorias.filter(x => x.id !== m.id)})}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      
      case 'tarjetas':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group">
                <label>Mensaje de Inicio (Sobre)</label>
                <input type="text" placeholder="Ej: Tus cartas guardadas..." value={projectConfig.mensajeInicioTarjetas} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioTarjetas: e.target.value})} />
              </div>              <div className="input-group">
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
              <div className="card-header-with-limit">
                <h3><Layers size={18} /> {editingTarjetaId ? 'Editando Carta' : 'Añadir Nueva Carta'}</h3>
                <span className={`limit-badge ${projectConfig.tarjetas.length >= projectConfig.tarjetas_cantidad && !editingTarjetaId ? 'danger' : ''}`}>
                  {projectConfig.tarjetas.length}/{projectConfig.tarjetas_cantidad}
                </span>
              </div>
              
              <div 
                className={`upload-placeholder-container ${newTarjeta.imagen ? 'has-image' : ''} ${isUploading ? 'is-uploading' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isUploading) tarjetasInputRef.current?.click();
                }}
              >
                {isUploading ? (
                  <div className="upload-loading-state">
                    <div className="rabanesco-spinner"></div>
                    <span>Preparando tu carta... {uploadProgress}%</span>
                    <div className="upload-progress-bar">
                      <motion.div 
                        className="upload-progress-fill" 
                        initial={{ width: 0 }} 
                        animate={{ width: `${uploadProgress}%` }} 
                      />
                    </div>
                  </div>
                ) : newTarjeta.imagen ? (
                  <div className="upload-preview-wrapper">
                    <img src={newTarjeta.imagen} alt="Preview" className="upload-image-preview" />
                    <div className="upload-overlay">
                      <div className="upload-actions">
                        <button 
                          className="btn-change-photo"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            tarjetasInputRef.current?.click();
                          }}
                        >
                          <ImageIcon size={16} /> Cambiar Imagen
                        </button>
                        <button 
                          className="btn-delete-photo"
                          title="Eliminar imagen"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewTarjeta(prev => ({ ...prev, imagen: '' }));
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="upload-visual-box">
                    <Upload size={32} />
                    <span>Imagen de la Carta</span>
                    <span className="upload-hints">Formatos: JPG, PNG • Máx 5MB</span>
                  </div>
                )}
              </div>

              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label>Título</label>
                <input 
                  type="text" 
                  placeholder="Ej: Para ti" 
                  value={newTarjeta.titulo} 
                  maxLength={50}
                  onChange={(e) => setNewTarjeta({...newTarjeta, titulo: e.target.value})} 
                />
                <div className={`char-counter ${newTarjeta.titulo.length >= 45 ? 'warning' : ''}`}>
                  {newTarjeta.titulo.length}/50
                </div>
              </div>
              
              <div className="input-group">
                <label>Mensaje</label>
                <textarea 
                  placeholder="Escribe el mensaje de la carta..." 
                  value={newTarjeta.contenido} 
                  maxLength={300}
                  onChange={(e) => setNewTarjeta({...newTarjeta, contenido: e.target.value})} 
                />
                <div className={`char-counter ${newTarjeta.contenido.length >= 270 ? 'warning' : ''}`}>
                  {newTarjeta.contenido.length}/300
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                {editingTarjetaId && (<button className="btn-cancel-edit" onClick={cancelEditTarjeta}>Cancelar</button>)}
                
                {projectConfig.tarjetas.length >= projectConfig.tarjetas_cantidad && !editingTarjetaId ? (
                  <div className="limit-reached-message">
                    <Sparkles size={14} /> ¡Espacio lleno! Ya tienes {projectConfig.tarjetas_cantidad} cartas.
                  </div>
                ) : (
                  <button 
                    className="btn-add-item" 
                    onClick={handleSaveTarjeta} 
                    disabled={!newTarjeta.titulo || !newTarjeta.contenido}
                  >
                    {editingTarjetaId ? 'Actualizar Carta' : <><Plus size={18} /> Guardar Carta</>}
                  </button>
                )}
              </div>
            </div>
            <div className="items-list-container">{projectConfig.tarjetas.map(t => (<div key={t.id} className="item-summary-card"><div className="item-info"><strong>{t.titulo}</strong></div><div className="item-actions"><button className="btn-edit-item" onClick={() => handleEditTarjeta(t.id)}><Pencil size={16} /></button><button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, tarjetas: projectConfig.tarjetas.filter(x => x.id !== t.id)})}><Trash2 size={16} /></button></div></div>))}</div>
          </div>
        );

      case 'trivia':
        const filledOptionsCount = newPregunta.opciones.filter(op => op.trim() !== '').length;
        const isCorrectOptionFilled = newPregunta.opciones[newPregunta.correcta].trim() !== '';
        const canSavePregunta = newPregunta.pregunta.trim() !== '' && filledOptionsCount >= 2 && isCorrectOptionFilled;

        return (
          <div className="form-container">
            <div className="wrapped-section-card" style={{ marginBottom: '0.5rem' }}>
              <div className="section-header">
                <Gamepad2 size={18} />
                <h3>Configuración de la Trivia</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                Personaliza los mensajes que verá tu pareja al ganar o fallar, y define cuántas preguntas quieres incluir.
              </p>
              <div className="grid-3-cols config-header-field">
                <div className="input-group">
                  <label>Mensaje de Victoria <HelpTip text="Aparece cuando completan la trivia correctamente." /></label>
                  <input type="text" placeholder="Ej: ¡Sabía que me conocías!" value={projectConfig.trivia.mensajeExito} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeExito: e.target.value }})} />
                </div>
                <div className="input-group">
                  <label>Mensaje de Error <HelpTip text="Aparece si fallan alguna respuesta." /></label>
                  <input type="text" placeholder="Ej: ¡Inténtalo de nuevo!" value={projectConfig.trivia.mensajeError} onChange={(e) => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, mensajeError: e.target.value }})} />
                </div>
                <div className="input-group">
                  <label>¿Cuántas preguntas?</label>
                  <select value={projectConfig.trivia.cantidad} onChange={(e) => setProjectConfig({...projectConfig, trivia: {...projectConfig.trivia, cantidad: parseInt(e.target.value, 10)}})}>
                    <option value={3}>3 Preguntas</option>
                    <option value={5}>5 Preguntas</option>
                    <option value={10}>10 Preguntas</option>
                  </select>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={editingPreguntaId ? `edit-${editingPreguntaId}` : `new-${projectConfig.trivia.preguntas.length}`}
                className={`memoria-form-card ${editingPreguntaId ? 'editing' : ''}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className="card-header-with-limit">
                  <h3>{editingPreguntaId ? 'Editando Pregunta' : 'Añadir Pregunta'}</h3>
                  <span className={`limit-badge ${projectConfig.trivia.preguntas.length >= projectConfig.trivia.cantidad && !editingPreguntaId ? 'danger' : ''}`}>
                    {projectConfig.trivia.preguntas.length}/{projectConfig.trivia.cantidad}
                  </span>
                </div>
                
                <div className="input-group">
                  <label>Texto de la Pregunta</label>
                  <input 
                    type="text" 
                    placeholder="Ej: ¿Cuál es mi comida favorita?" 
                    value={newPregunta.pregunta} 
                    maxLength={100}
                    onChange={(e) => setNewPregunta({...newPregunta, pregunta: e.target.value})} 
                  />
                  <div className={`char-counter ${newPregunta.pregunta.length >= 90 ? 'warning' : ''}`}>
                    {newPregunta.pregunta.length}/100
                  </div>
                </div>

                <div className="input-group" style={{ marginTop: '1rem' }}>
                  <label>Opciones <HelpTip text="Escribe al menos 2 opciones y marca la correcta con el círculo." /></label>
                  <div className="options-config-grid">
                    {newPregunta.opciones.map((op, idx) => (
                      <div key={idx} className={`option-input-group ${newPregunta.correcta === idx ? 'is-correct' : ''}`}>
                        <button 
                          className="btn-select-correct" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNewPregunta({...newPregunta, correcta: idx}); }}
                          title="Marcar como correcta"
                        >
                          {newPregunta.correcta === idx ? <CheckCircle2 size={18} /> : <div className="circle-placeholder" />}
                        </button>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <input 
                            type="text" 
                            placeholder={`Opción ${idx + 1}`} 
                            value={op} 
                            maxLength={50}
                            onChange={(e) => { 
                              const n = [...newPregunta.opciones]; 
                              n[idx] = e.target.value; 
                              setNewPregunta({...newPregunta, opciones: n}); 
                            }} 
                          />
                          <div className={`char-counter ${op.length >= 45 ? 'warning' : ''}`} style={{ fontSize: '0.65rem', marginTop: '-10px' }}>
                            {op.length}/50
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions" style={{ marginTop: '1.5rem' }}>
                  {editingPreguntaId && (<button className="btn-cancel-edit" onClick={cancelEditPregunta}>Cancelar</button>)}
                  
                  {projectConfig.trivia.preguntas.length >= projectConfig.trivia.cantidad && !editingPreguntaId ? (
                    <div className="limit-reached-message">
                      <Sparkles size={14} /> ¡Espacio lleno! Ya tienes {projectConfig.trivia.cantidad} preguntas.
                    </div>
                  ) : (
                    <button 
                      className="btn-add-item" 
                      onClick={handleSavePregunta} 
                      disabled={(!canSavePregunta)}
                    >
                      {editingPreguntaId ? 'Actualizar Pregunta' : <><Plus size={18} /> Guardar Pregunta</>}
                    </button>
                  )}
                </div>
                {!canSavePregunta && newPregunta.pregunta.trim() !== '' && projectConfig.trivia.preguntas.length < projectConfig.trivia.cantidad && (
                  <p className="validation-hint" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.5rem', textAlign: 'right' }}>
                    Escribe la pregunta, al menos 2 opciones y marca la correcta.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="items-list-container">
              <AnimatePresence initial={false}>
                {projectConfig.trivia.preguntas.map(p => (
                  <motion.div 
                    key={p.id} 
                    className="item-summary-card"
                    initial={{ opacity: 0, scale: 0.3, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 20
                    }}
                  >
                    <div className="item-info">
                      <strong>{p.pregunta}</strong>
                      <span style={{ color: '#2ed573', fontWeight: '600' }}>R: {p.opciones[p.correcta]}</span>
                    </div>
                    <div className="item-actions">
                      <button className="btn-edit-item" onClick={() => handleEditPregunta(p.id)}><Pencil size={16} /></button>
                      <button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, trivia: { ...projectConfig.trivia, preguntas: projectConfig.trivia.preguntas.filter(x => x.id !== p.id) }})}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'dedicatorias':
        return (
          <div className="form-container">
            <div className="grid-2-cols config-header-field">
              <div className="input-group"><label>Mensaje de Inicio (Cofre)</label><input type="text" placeholder="Ej: Ábrelo cuando me extrañes..." value={projectConfig.mensajeInicioDedic} onChange={(e) => setProjectConfig({...projectConfig, mensajeInicioDedic: e.target.value})} /></div>
              <div className="input-group"><label>¿Cuántas dedicatorias?</label><select value={projectConfig.dedicatorias_cantidad} onChange={(e) => setProjectConfig({...projectConfig, dedicatorias_cantidad: parseInt(e.target.value, 10)})}><option value={1}>1 Dedicatoria</option><option value={3}>3 Dedicatorias</option><option value={5}>5 Dedicatorias</option></select></div>
            </div>
            <motion.div 
              key={editingDedicatoriaId || 'new'}
              className={`memoria-form-card ${editingDedicatoriaId ? 'editing' : ''} ${projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId ? 'is-locked' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="card-header-with-limit"><h3><Mail size={18} /> {editingDedicatoriaId ? 'Editando Dedicatoria' : 'Nueva Dedicatoria'}</h3><span className={`limit-badge ${projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId ? 'danger' : ''}`}>{projectConfig.dedicatorias.length}/{projectConfig.dedicatorias_cantidad}</span></div>
              <div className="input-group">
                <label>Título</label>
                <input 
                  type="text" 
                  placeholder="Ej: Para mi persona favorita" 
                  value={newDedicatoria.titulo} 
                  onChange={(e) => setNewDedicatoria({...newDedicatoria, titulo: e.target.value})} 
                  disabled={projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId}
                />
              </div>
              <div className="input-group">
                <label>Mensaje</label>
                <textarea 
                  placeholder="Escribe aquí lo que a veces no te digo por WhatsApp..." 
                  value={newDedicatoria.texto} 
                  maxLength={500}
                  onChange={(e) => setNewDedicatoria({...newDedicatoria, texto: e.target.value})} 
                  disabled={projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId}
                />
                <div className={`char-counter ${newDedicatoria.texto.length >= 450 ? 'warning' : ''}`}>
                  {newDedicatoria.texto.length}/500
                </div>
              </div>
              <div className="form-actions">
                {editingDedicatoriaId && (
                  <button className="btn-cancel-edit" onClick={cancelEditDedicatoria}>Cancelar</button>
                )}
                
                {projectConfig.dedicatorias.length >= projectConfig.dedicatorias_cantidad && !editingDedicatoriaId ? (
                  <div className="limit-reached-message">
                    <Sparkles size={14} /> ¡Espacio lleno! Solo tienes {projectConfig.dedicatorias_cantidad} espacios.
                  </div>
                ) : (
                  <button className="btn-add-item" onClick={handleSaveDedicatoria}>
                    {editingDedicatoriaId ? 'Actualizar Dedicatoria' : <><Plus size={18} /> Guardar Dedicatoria</>}
                  </button>
                )}
              </div>
            </motion.div>

            <div className="items-list-container">
              <AnimatePresence>
                {projectConfig.dedicatorias.map(d => (
                  <motion.div 
                    key={d.id} 
                    className="item-summary-card"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <div className="item-info"><strong>{d.titulo}</strong></div>
                    <div className="item-actions">
                      <button className="btn-edit-item" onClick={() => handleEditDedicatoria(d.id)}><Pencil size={16} /></button>
                      <button className="btn-remove-item" onClick={() => setProjectConfig({...projectConfig, dedicatorias: projectConfig.dedicatorias.filter(x => x.id !== d.id)})}><Trash2 size={16} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      
      // --- OTROS MÓDULOS ---
      case 'contador':
        return (
          <div className="form-container">
            <div className="wrapped-section-card">
              <div className="section-header">
                <Clock size={18} />
                <h3>Configuración del Contador</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem' }}>
                Define el título y la fecha desde la cual empezaremos a contar tu historia.
              </p>
              
              <div className="grid-2-cols">
                <div className="input-group">
                  <label>Título del Contador <HelpTip text="Ej: Tiempo Juntos" /></label>
                  <input 
                    type="text" 
                    placeholder="Ej: Tiempo Juntos" 
                    value={projectConfig.contador.titulo} 
                    maxLength={50}
                    onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, titulo: e.target.value }})} 
                  />
                  <div className={`char-counter ${projectConfig.contador.titulo.length >= 45 ? 'warning' : ''}`}>{projectConfig.contador.titulo.length}/50</div>
                </div>
                <div className="input-group">
                  <label>Subtítulo de Apoyo <HelpTip text="Una frase corta que acompañe al contador." /></label>
                  <input 
                    type="text" 
                    placeholder="Ej: Cada segundo cuenta..." 
                    value={projectConfig.contador.subtitulo} 
                    maxLength={100}
                    onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, subtitulo: e.target.value }})} 
                  />
                  <div className={`char-counter ${projectConfig.contador.subtitulo.length >= 90 ? 'warning' : ''}`}>{projectConfig.contador.subtitulo.length}/100</div>
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label><Calendar size={16} /> Fecha Especial (Día Cero) <HelpTip text="La fecha en la que comenzó el viaje." /></label>
                <input 
                  type="date" 
                  value={projectConfig.contador.fecha} 
                  onChange={(e) => setProjectConfig({...projectConfig, contador: { ...projectConfig.contador, fecha: e.target.value }})} 
                />
                
                <LiveCounter date={projectConfig.contador.fecha} />
              </div>
            </div>
          </div>
        );
      case 'evasivo':
        return (
          <div className="form-container">
            <div className="wrapped-section-card">
              <div className="section-header">
                <MousePointer2 size={18} />
                <h3>La Pregunta Trampa</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.75rem', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                Ideal para propuestas o perdones: el botón <strong>"NO"</strong> escapará del cursor, obligando a tu pareja a decir que sí.
              </p>
              
              <div className="input-group">
                <label>Pregunta Principal <HelpTip text="Esta es la pregunta que aparecerá con el botón que huye." /></label>
                <input 
                  type="text" 
                  placeholder="Ej: ¿Me perdonas? o ¿Quieres ser mi novia?" 
                  value={projectConfig.evasivo.pregunta} 
                  maxLength={100}
                  onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, pregunta: e.target.value }})} 
                />
                <div className={`char-counter ${projectConfig.evasivo.pregunta.length >= 95 ? 'warning' : ''}`}>{projectConfig.evasivo.pregunta.length}/100</div>
              </div>

              <div className="grid-2-cols" style={{ marginTop: '1.5rem' }}>
                <div className="input-group">
                  <label><Heart size={14} /> Botón "SÍ" <HelpTip text="Texto del botón que se puede clickear normalmente." /></label>
                  <input 
                    type="text" 
                    placeholder="Ej: Sí, obvio" 
                    value={projectConfig.evasivo.textoSi} 
                    maxLength={20}
                    onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoSi: e.target.value }})} 
                  />
                  <div className={`char-counter ${projectConfig.evasivo.textoSi.length >= 18 ? 'warning' : ''}`}>{projectConfig.evasivo.textoSi.length}/20</div>
                </div>
                <div className="input-group">
                  <label><Zap size={14} /> Botón "NO" <HelpTip text="Texto del botón evasivo que escapará del cursor." /></label>
                  <input 
                    type="text" 
                    placeholder="Ej: No, jamás" 
                    value={projectConfig.evasivo.textoNo} 
                    maxLength={20}
                    onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, textoNo: e.target.value }})} 
                  />
                  <div className={`char-counter ${projectConfig.evasivo.textoNo.length >= 18 ? 'warning' : ''}`}>{projectConfig.evasivo.textoNo.length}/20</div>
                </div>
              </div>

              <div className="input-group" style={{ marginTop: '1.5rem' }}>
                <label>Mensaje de Éxito <HelpTip text="Lo que aparecerá después de que logren darle al SÍ." /></label>
                <textarea 
                  placeholder="Ej: ¡Sabía que no podrías decir que no! 🥰" 
                  value={projectConfig.evasivo.mensajeExito} 
                  maxLength={300}
                  onChange={(e) => setProjectConfig({...projectConfig, evasivo: { ...projectConfig.evasivo, mensajeExito: e.target.value }})} 
                />
                <div className={`char-counter ${projectConfig.evasivo.mensajeExito.length >= 270 ? 'warning' : ''}`}>{projectConfig.evasivo.mensajeExito.length}/300</div>
              </div>
            </div>
          </div>
        );
      case 'wrapped':
        return <WrappedFormConfigurator projectConfig={projectConfig} setProjectConfig={setProjectConfig} />;
      case 'final':
        return (
          <div className="summary-view-container">
            <div className="order-summary-card">
              <div className="summary-header"><ShoppingBag size={24} /><h3>Resumen de tu Experiencia</h3></div>
              <div className="summary-details">
                <div className="summary-row"><span>Pareja:</span><strong>{projectConfig.pareja}</strong></div>
                <div className="summary-row"><span>Pack Elegido:</span><strong>{selectedPack?.nombre || 'Personalizado'}</strong></div>
                <div className="summary-row"><span>Tema Seleccionado:</span>
                  <div className="theme-preview-mini">
                    <div className="theme-color-dot" style={{ background: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color }}></div>
                    <strong>{THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.name}</strong>
                  </div>
                </div>
              </div>
              
              <div className="summary-modules-list">
                <h4>Módulos Configurados:</h4>
                <ul>
                  {modules.map((m: string, index: number) => (
                    <li key={m}>
                      <Layout size={14} />
                      {m.replace('modulo-', '').toUpperCase()}
                      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 + (index * 0.1) }}>
                        <Check size={14} className="check-icon-green" />
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nueva Sección: Identidad Digital */}
              <div className="digital-identity-section" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <h3 style={{ color: '#1A4073', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
                  <Sparkles size={20} color="#ef4444" /> Último Paso: Tu Identidad Digital
                </h3>
                
                <div className="input-group">
                  <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Correo Electrónico para el Envío</label>
                  <input 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    style={{ 
                      borderColor: emailCliente && !emailCliente.includes('@') ? '#ef4444' : '#1A4073',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      width: '100%',
                      marginTop: '0.5rem'
                    }}
                  />
                </div>

                <div className="input-group" style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Elige tu link personalizado</label>
                  <div className="slug-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '12px', padding: '0 1rem', border: '1px solid #cbd5e1', marginTop: '0.5rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>ravynstudio.mx/</span>
                    <input 
                      type="text" 
                      placeholder="nombre-de-tu-historia" 
                      value={chosenSlug}
                      onChange={handleSlugChange}
                      style={{ background: 'transparent', border: 'none', padding: '0.8rem 0.5rem', fontWeight: 700, color: '#1A4073', flex: 1, outline: 'none' }}
                    />
                  </div>
                  
                  <div className="slug-status" style={{ marginTop: '0.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {isCheckingSlug ? (
                      <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}><Loader2 size={14} className="animate-spin" /> Verificando...</span>
                    ) : isSlugAvailable === true ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Disponible</span>
                    ) : isSlugAvailable === false ? (
                      <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ No disponible / Reservado</span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="summary-total" style={{ marginTop: '2rem' }}><span>Inversión Total:</span><span className="total-amount">${total} MXN</span></div>
              
              {/* Botón de Preview Integrado (Ghost Button) */}
              <button 
                className="btn-preview-ghost" 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreviewModal(true); }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  width: '100%',
                  padding: '0.8rem',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  background: 'transparent',
                  border: `1px solid ${THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || 'var(--primary-color)'}`,
                  color: THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || 'var(--primary-color)',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: `${THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || 'var(--primary-color)'}10`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || 'var(--primary-color)'}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || 'var(--primary-color)'}10`;
                }}
              >
                <Eye size={18} /> Vista Previa de mi Web
              </button>

              <div className="payment-trust-badges">
                <span className="trust-label">Pago Seguro vía Stripe</span>
                <div className="badges-row" style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="https://cdn.simpleicons.org/visa/00579F" alt="Visa" style={{ height: '24px' }} />
                  <img src="https://cdn.simpleicons.org/mastercard/EB001B" alt="Mastercard" style={{ height: '24px' }} />
                  <img src="https://cdn.simpleicons.org/americanexpress/002663" alt="Amex" style={{ height: '24px' }} />
                  <img src="https://cdn.simpleicons.org/stripe/008CDD" alt="Stripe" className="stripe-badge" style={{ height: '24px' }} />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="placeholder-form"><p>Configuración para: <strong>{step.title}</strong></p><p className="hint">Módulo en construcción.</p></div>;
    }
  })()}</>
    );
  };

  const currentThemeColor = THEME_OPTIONS.find(t => t.id === projectConfig.tema)?.color || '#1A4073';

  return (
    <div className="configurator-layout">
      <nav className="config-nav">
        <button className="back-btn" onClick={handleBack} title="Regresar"><ArrowLeft size={20} /></button>
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }} 
              animate={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                backgroundColor: currentThemeColor
              }} 
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="step-counter">Paso {currentStep + 1} de {steps.length}</span>
        </div>
        <div className="config-logo">Ravyn Studio</div>
      </nav>
      <main className="config-main">
        <AnimatePresence mode="wait">
          <motion.section key={steps[currentStep].id} className="config-step-section" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="step-header"><span className="step-tag">Ravyn Studio</span><h1>{steps[currentStep].title}</h1><p>Confirmación de tu experiencia digital.</p></div>
            <div className="step-content">{renderStepContent()}</div>
            <div className="step-actions">
              <button className="btn-secondary" onClick={handleBack}><ChevronLeft size={20} /> <span>Atrás</span></button>
              <div className="primary-action-wrapper">
                {currentStep === steps.length - 1 && (
                  <motion.div 
                    className="delivery-badge"
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                  >
                    <Zap size={14} fill="currentColor" /> Entrega estimada: &lt; 10 min
                  </motion.div>
                )}
                <button 
                  className={`btn-primary theme-${projectConfig.tema}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNext(); }}
                  style={{ backgroundColor: currentThemeColor }}
                >
                  {currentStep === steps.length - 1 ? 'Pagar y Construir Experiencia' : 'Siguiente Paso'} 
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>

      <LivePreviewModal 
        isOpen={showPreviewModal} 
        onClose={() => setShowPreviewModal(false)} 
        projectConfig={projectConfig} 
        activeModules={modules} 
      />

      <input 
        type="file" 
        ref={historiaInputRef}
        hidden 
        accept="image/png, image/jpeg"
        onChange={(e) => handleImageUpload(e, 'historia')} 
      />
      <input 
        type="file" 
        ref={tarjetasInputRef}
        hidden 
        accept="image/png, image/jpeg"
        onChange={(e) => handleImageUpload(e, 'tarjetas')} 
      />

      {processingOrder && renderProcessingModal()}
    </div>
  );
};

export default Configurator;
