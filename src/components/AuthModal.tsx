import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Building2, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [clinicName, setClinicName] = useState('')
  const [clinicPhone, setClinicPhone] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // BLOQUEO DE SCROLL AGRESIVO
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      document.body.style.position = 'fixed'; 
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      return () => {
        const scrollY = document.body.style.top;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        onClose()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              clinic_name: clinicName,
              clinic_phone: clinicPhone,
              clinic_email: email
            }
          }
        })
        if (error) throw error
        
        setError('¡Registro exitoso! Por favor verifica tu correo electrónico.')
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="auth-modal-overlay">
          <motion.div 
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="auth-modal-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="auth-modal-close" onClick={onClose} type="button" aria-label="Cerrar">
              <X className="w-5 h-5" />
            </button>

            <div className="auth-modal-scroll-area">
              <div className="auth-modal-content">
                <div className="auth-modal-header">
                  <h2 className="auth-header-title">
                    {view === 'login' ? 'Bienvenido' : 'Crea tu cuenta'}
                  </h2>
                  <p className="auth-header-sub">
                    {view === 'login' 
                      ? 'Inicia sesión para gestionar tu suscripción.' 
                      : 'Registra tu clínica y comienza a automatizar.'}
                  </p>
                </div>

                {error && (
                  <motion.div 
                    className={`auth-error-badge ${error.includes('exitoso') ? 'is-success' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  {view === 'signup' && (
                    <>
                      <div className="form-group">
                        <label>Nombre del Propietario</label>
                        <div className="input-wrapper">
                          <User className="w-4 h-4 input-icon" />
                          <input 
                            type="text" 
                            placeholder="Tu nombre completo" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre de la Clínica</label>
                        <div className="input-wrapper">
                          <Building2 className="w-4 h-4 input-icon" />
                          <input 
                            type="text" 
                            placeholder="Ej. Clínica Dental Ravyn" 
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Teléfono</label>
                        <div className="input-wrapper">
                          <Phone className="w-4 h-4 input-icon" />
                          <input 
                            type="tel" 
                            placeholder="10 dígitos" 
                            value={clinicPhone}
                            onChange={(e) => setClinicPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label>Correo electrónico</label>
                    <div className="input-wrapper">
                      <Mail className="w-4 h-4 input-icon" />
                      <input 
                        type="email" 
                        placeholder="correo@ejemplo.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Contraseña</label>
                    <div className="input-wrapper">
                      <Lock className="w-4 h-4 input-icon" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {view === 'login' ? 'Entrar' : 'Registrar mi clínica'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="auth-modal-footer">
                  <button 
                    type="button"
                    onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                    className="auth-view-toggle-btn"
                  >
                    {view === 'login' 
                      ? '¿No tienes cuenta? Regístrate aquí' 
                      : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            .auth-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100dvh; /* Altura dinámica para móviles */
              z-index: 10000;
              display: flex;
              align-items: center; 
              justify-content: center;
              padding: 20px;
              pointer-events: auto;
            }

            .auth-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.9);
              backdrop-filter: blur(12px);
              z-index: 0;
            }

            .auth-modal-container {
              position: relative;
              background: #0a0a0a;
              border: 1px solid rgba(255,255,255,0.1);
              width: 100%;
              max-width: 440px;
              max-height: 85vh; /* Limitamos un poco más para asegurar que se vea que flota */
              border-radius: 28px;
              box-shadow: 0 40px 100px -10px rgba(0, 0, 0, 0.8);
              z-index: 1;
              pointer-events: auto;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              /* Eliminamos transformaciones de posición iniciales */
              margin: auto; 
            }

            .auth-modal-scroll-area {
              flex: 1;
              overflow-y: auto;
              padding: 40px;
              /* Scroll suave en iOS */
              -webkit-overflow-scrolling: touch;
            }

            .auth-modal-close {
              position: absolute;
              top: 16px;
              right: 16px;
              color: var(--text-muted);
              transition: color 0.2s;
              z-index: 10;
              background: rgba(255,255,255,0.05);
              border: none;
              cursor: pointer;
              padding: 8px;
              border-radius: 50%;
            }

            .auth-modal-content {
              display: flex;
              flex-direction: column;
            }

            .auth-header-title {
              font-size: 1.75rem;
              font-weight: 700;
              color: #fff;
              margin-bottom: 6px;
              letter-spacing: -0.02em;
            }

            .auth-header-sub {
              font-size: 0.9rem;
              color: var(--text-secondary);
              margin-bottom: 24px;
            }

            .auth-error-badge {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.2);
              color: #f87171;
              padding: 12px 16px;
              border-radius: 12px;
              font-size: 0.85rem;
              margin-bottom: 20px;
            }

            .auth-error-badge.is-success {
              background: rgba(34, 197, 94, 0.1);
              border-color: rgba(34, 197, 94, 0.2);
              color: #4ade80;
            }

            .auth-form { display: flex; flex-direction: column; gap: 14px; }
            .form-group { display: flex; flex-direction: column; gap: 6px; }
            .form-group label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-left: 2px; }

            .input-wrapper { position: relative; display: flex; align-items: center; }
            .input-icon { position: absolute; left: 16px; color: var(--text-muted); pointer-events: none; }
            
            .password-toggle {
              position: absolute;
              right: 16px;
              color: var(--text-muted);
              background: none;
              border: none;
              cursor: pointer;
              padding: 4px;
            }

            .input-wrapper input {
              width: 100%;
              background: #141414;
              border: 1px solid rgba(255,255,255,0.08);
              border-radius: 12px;
              padding: 12px 44px;
              color: #fff;
              font-size: 0.95rem;
            }

            .auth-submit-btn {
              background: #fff;
              color: #000;
              padding: 14px;
              border-radius: 12px;
              font-weight: 700;
              font-size: 0.95rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin-top: 8px;
              border: none;
              cursor: pointer;
            }

            .auth-modal-footer { margin-top: 20px; text-align: center; }

            .auth-view-toggle-btn {
              background: none;
              border: none;
              color: #fff; 
              font-weight: 500;
              font-size: 0.85rem;
              cursor: pointer;
            }

            @media (max-width: 768px) {
              .auth-modal-overlay { 
                padding: 16px; 
                align-items: center !important; /* Forzamos el centrado */
              }
              .auth-modal-container { 
                max-width: 100%; 
                margin: auto !important; 
                max-height: 80dvh; /* Más pequeño para asegurar centrado visual */
              }
              .auth-modal-scroll-area { padding: 32px 20px; }
              .auth-header-title { font-size: 1.5rem; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
