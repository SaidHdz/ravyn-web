import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()

  // Bloquear scroll del body al abrir el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Simulación de demora y validación de usuario test
    setTimeout(async () => {
      if (view === 'login') {
        const success = await login(email, password)
        if (success) {
          setLoading(false)
          onClose()
        } else {
          setError('Credenciales incorrectas (Test: test@ravyn.mx / test)')
          setLoading(false)
        }
      } else {
        // Simulación de registro
        console.log('Registro simulado para:', name)
        setLoading(false)
        onClose()
      }
    }, 1000)
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="auth-modal-close" onClick={onClose} type="button">
              <X className="w-5 h-5" />
            </button>

            <div className="auth-modal-content">
              <div className="auth-modal-header">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {view === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </h2>
                <p className="text-white/50">
                  {view === 'login' 
                    ? 'Inicia sesión para gestionar tu suscripción.' 
                    : 'Únete a Ravyn y profesionaliza tu negocio.'}
                </p>
              </div>

              {error && (
                <motion.div 
                  className="auth-error-badge"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                {view === 'signup' && (
                  <div className="form-group">
                    <label>Nombre completo</label>
                    <div className="input-wrapper">
                      <User className="w-4 h-4 input-icon" />
                      <input 
                        type="text" 
                        placeholder="Tu nombre" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>Correo electrónico</label>
                  <div className="input-wrapper">
                    <Mail className="w-4 h-4 input-icon" />
                    <input 
                      type="email" 
                      placeholder="test@ravyn.mx" 
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
                      {view === 'login' ? 'Entrar' : 'Registrarme'}
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
          </motion.div>

          <style>{`
            .auth-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 10000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
              pointer-events: auto; /* Asegura que el overlay capture eventos */
            }

            .auth-modal-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.85);
              backdrop-filter: blur(10px);
              z-index: 0;
            }

            .auth-modal-container {
              position: relative;
              background: #111; /* Fondo oscuro sólido para el modal */
              border: 1px solid var(--border);
              width: 100%;
              max-width: 440px;
              border-radius: 32px;
              overflow: hidden;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
              z-index: 1; /* Por encima del backdrop */
              pointer-events: auto; /* Asegura que el contenido sea clicable */
            }

            .auth-modal-close {
              position: absolute;
              top: 24px;
              right: 24px;
              color: var(--text-muted);
              transition: color 0.2s;
              z-index: 10;
              background: none;
              border: none;
              cursor: pointer;
              padding: 8px;
            }

            .auth-modal-close:hover {
              color: var(--text);
            }

            .auth-modal-content {
              padding: 48px;
            }

            .auth-modal-header {
              margin-bottom: 32px;
            }

            .auth-error-badge {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.2);
              color: #f87171;
              padding: 12px 16px;
              border-radius: 12px;
              font-size: 0.9rem;
              margin-bottom: 24px;
            }

            .auth-form {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .form-group {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .form-group label {
              font-size: 0.85rem;
              font-weight: 600;
              color: var(--text-secondary);
              margin-left: 4px;
            }

            .input-wrapper {
              position: relative;
              display: flex;
              align-items: center;
            }

            .input-icon {
              position: absolute;
              left: 16px;
              color: var(--text-muted);
            }

            .password-toggle {
              position: absolute;
              right: 16px;
              color: var(--text-muted);
              background: none;
              border: none;
              cursor: pointer;
              transition: color 0.2s;
              padding: 4px;
            }

            .password-toggle:hover {
              color: var(--text);
            }

            .input-wrapper input {
              width: 100%;
              background: #1a1a1a;
              border: 1px solid var(--border);
              border-radius: 16px;
              padding: 14px 44px;
              color: #fff;
              font-size: 1rem;
              transition: all 0.2s;
            }

            .input-wrapper input:focus {
              border-color: var(--accent);
              outline: none;
              box-shadow: 0 0 0 4px var(--accent-dim);
            }

            .auth-submit-btn {
              background: #fff;
              color: #000;
              padding: 16px;
              border-radius: 16px;
              font-weight: 700;
              font-size: 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              margin-top: 12px;
              transition: all 0.3s;
              border: none;
              cursor: pointer;
            }

            .auth-submit-btn:hover:not(:disabled) {
              opacity: 0.9;
              transform: translateY(-2px);
            }

            .auth-submit-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .auth-modal-footer {
              margin-top: 32px;
              text-align: center;
            }

            .auth-view-toggle-btn {
              background: none;
              border: none;
              color: #fff; 
              font-weight: 500;
              font-size: 0.95rem;
              cursor: pointer;
              transition: opacity 0.2s;
            }

            .auth-view-toggle-btn:hover {
              opacity: 0.7;
            }

            @media (max-width: 480px) {
              .auth-modal-content {
                padding: 32px 24px;
              }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
