import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, Building2, Phone, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/context/LanguageContext'
import { translateAuthError } from '@/lib/authErrors'

type View = 'login' | 'signup' | 'forgot'
type FeedbackType = 'error' | 'success' | 'info'
interface Feedback { type: FeedbackType; message: string }

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'login' | 'signup'
}

const MIN_PASSWORD = 6

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth()
  const { t, language } = useLanguage()
  const [view, setView] = useState<View>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    setFullName('')
    setCompanyName('')
    setPhone('')
    setShowPassword(false)
    setFeedback(null)
  }

  // Reset everything when modal closes (regardless of how it closed)
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        resetForm()
        setView(initialView)
      }, 250)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, initialView])

  // Clear feedback when user starts typing or switches view
  const clearFeedbackOnEdit = () => {
    if (feedback && feedback.type === 'error') setFeedback(null)
  }

  const switchView = (next: View) => {
    if (loading) return
    setFeedback(null)
    setShowPassword(false)
    setPasswordConfirm('')
    setView(next)
  }

  const safeClose = () => {
    if (loading) return
    onClose()
  }

  // Aggressive scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollBarWidth}px`
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
      return () => {
        const scrollY = document.body.style.top
        document.documentElement.style.overflow = ''
        document.body.style.overflow = originalStyle
        document.body.style.paddingRight = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
  }, [isOpen])

  const validate = (): string | null => {
    if (!email.trim()) return language === 'es' ? 'Ingresa tu correo electrónico.' : 'Please enter your email address.'
    if (view !== 'forgot') {
      if (!password) return language === 'es' ? 'Ingresa tu contraseña.' : 'Please enter your password.'
      if (view === 'signup' && password.length < MIN_PASSWORD) {
        return language === 'es'
          ? `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`
          : `Password must be at least ${MIN_PASSWORD} characters.`
      }
      if (view === 'signup' && password !== passwordConfirm) {
        return language === 'es' ? 'Las contraseñas no coinciden.' : 'Passwords do not match.'
      }
    }
    if (view === 'signup') {
      if (!fullName.trim()) return language === 'es' ? 'Ingresa tu nombre.' : 'Please enter your full name.'
      if (!companyName.trim()) return language === 'es' ? 'Ingresa el nombre de tu empresa o negocio.' : 'Please enter your company or business name.'
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
        return language === 'es' ? 'El teléfono debe tener 10 dígitos.' : 'Phone must have 10 digits.'
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const validationError = validate()
    if (validationError) {
      setFeedback({ type: 'error', message: validationError })
      return
    }

    setLoading(true)
    setFeedback(null)

    try {
      if (view === 'login') {
        const { error } = await signIn(email.trim(), password)
        if (error) throw error
        setFeedback({ type: 'success', message: language === 'es' ? '¡Bienvenido de vuelta!' : 'Welcome back!' })
        setTimeout(() => {
          onClose()
        }, 600)
      } else if (view === 'signup') {
        const { error } = await signUp(email.trim(), password, {
          full_name: fullName.trim(),
          company_name: companyName.trim(),
          phone: phone.replace(/\D/g, ''),
          clinic_name: companyName.trim(),
          clinic_phone: phone.replace(/\D/g, ''),
        })
        if (error) throw error
        setFeedback({
          type: 'success',
          message: language === 'es'
            ? '¡Cuenta creada! Revisa tu correo para confirmar tu registro.'
            : 'Account created! Check your email to confirm your registration.',
        })
      } else if (view === 'forgot') {
        const { error } = await resetPassword(email.trim())
        if (error) throw error
        setFeedback({
          type: 'success',
          message: language === 'es'
            ? 'Te enviamos un enlace para restablecer tu contraseña.'
            : 'We sent a link to reset your password.',
        })
      }
    } catch (err) {
      setFeedback({ type: 'error', message: translateAuthError(err) })
    } finally {
      setLoading(false)
    }
  }

  const submitLabel =
    view === 'login' ? t.authModal.loginBtn :
    view === 'signup' ? t.authModal.signupBtn :
    t.authModal.forgotBtn

  const loadingLabel =
    view === 'login' ? t.authModal.loadingLogin :
    view === 'signup' ? t.authModal.loadingSignup :
    t.authModal.loadingForgot

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="auth-modal-overlay">
          <motion.div
            className="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={safeClose}
          />
          <motion.div
            className="auth-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="auth-modal-close"
              onClick={safeClose}
              type="button"
              aria-label="Cerrar"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="auth-modal-scroll-area">
              <div className="auth-modal-content">
                <div className="auth-modal-header">
                  {view !== 'login' && (
                    <button
                      type="button"
                      className="auth-back-btn"
                      onClick={() => switchView('login')}
                      disabled={loading}
                    >
                      <ArrowLeft className="w-4 h-4" /> {t.authModal.backToLogin}
                    </button>
                  )}
                  <h2 className="auth-header-title">
                    {view === 'login' && t.authModal.loginTitle}
                    {view === 'signup' && t.authModal.signupTitle}
                    {view === 'forgot' && t.authModal.forgotTitle}
                  </h2>
                  <p className="auth-header-sub">
                    {view === 'login' && t.authModal.loginSubtitle}
                    {view === 'signup' && t.authModal.signupSubtitle}
                    {view === 'forgot' && t.authModal.forgotSubtitle}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      key={feedback.message}
                      className={`auth-feedback-badge is-${feedback.type}`}
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                    >
                      {feedback.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                      <span>{feedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="auth-form">
                  <fieldset disabled={loading} className="auth-fieldset">
                    {view === 'signup' && (
                      <>
                        <div className="form-group">
                          <label>{t.authModal.fullNameLabel}</label>
                          <div className="input-wrapper">
                            <User className="w-4 h-4 input-icon" />
                            <input
                              type="text"
                              placeholder={t.authModal.fullNamePlaceholder}
                              value={fullName}
                              onChange={(e) => { setFullName(e.target.value); clearFeedbackOnEdit() }}
                              autoComplete="name"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>{t.authModal.companyNameLabel}</label>
                          <div className="input-wrapper">
                            <Building2 className="w-4 h-4 input-icon" />
                            <input
                              type="text"
                              placeholder={t.authModal.companyNamePlaceholder}
                              value={companyName}
                              onChange={(e) => { setCompanyName(e.target.value); clearFeedbackOnEdit() }}
                              autoComplete="organization"
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>{t.authModal.phoneLabel}</label>
                          <div className="input-wrapper">
                            <Phone className="w-4 h-4 input-icon" />
                            <input
                              type="tel"
                              placeholder={t.authModal.phonePlaceholder}
                              value={phone}
                              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); clearFeedbackOnEdit() }}
                              inputMode="numeric"
                              autoComplete="tel"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>{t.authModal.emailLabel}</label>
                      <div className="input-wrapper">
                        <Mail className="w-4 h-4 input-icon" />
                        <input
                          type="email"
                          placeholder={t.authModal.emailPlaceholder}
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); clearFeedbackOnEdit() }}
                          autoComplete={view === 'signup' ? 'email' : 'username'}
                          required
                        />
                      </div>
                    </div>

                    {view !== 'forgot' && (
                      <div className="form-group">
                        <label>{t.authModal.passwordLabel}</label>
                        <div className="input-wrapper">
                          <Lock className="w-4 h-4 input-icon" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={view === 'signup' ? `Min ${MIN_PASSWORD}` : t.authModal.passwordPlaceholder}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearFeedbackOnEdit() }}
                            autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
                            minLength={view === 'signup' ? MIN_PASSWORD : undefined}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {view === 'signup' && (
                      <div className="form-group">
                        <label>{t.authModal.passwordConfirmLabel}</label>
                        <div className="input-wrapper">
                          <Lock className="w-4 h-4 input-icon" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t.authModal.passwordConfirmPlaceholder}
                            value={passwordConfirm}
                            onChange={(e) => { setPasswordConfirm(e.target.value); clearFeedbackOnEdit() }}
                            autoComplete="new-password"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {view === 'login' && (
                      <div className="auth-row-right">
                        <button
                          type="button"
                          className="auth-link-btn"
                          onClick={() => switchView('forgot')}
                        >
                          {t.authModal.forgotPassLink}
                        </button>
                      </div>
                    )}
                  </fieldset>

                  <button type="submit" className="auth-submit-btn" disabled={loading}>
                    <AnimatePresence mode="wait" initial={false}>
                      {loading ? (
                        <motion.span
                          key="loading"
                          className="auth-submit-inner"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {loadingLabel}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          className="auth-submit-inner"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                        >
                          {submitLabel}
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </form>

                {view !== 'forgot' && (
                  <div className="auth-modal-footer">
                    <button
                      type="button"
                      onClick={() => switchView(view === 'login' ? 'signup' : 'login')}
                      className="auth-view-toggle-btn"
                      disabled={loading}
                    >
                      {view === 'login'
                        ? `${t.authModal.noAccount} ${t.authModal.createOne}`
                        : `${t.authModal.haveAccount} ${t.authModal.loginHere}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <style>{`
            .auth-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100dvh;
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
              background: var(--color-cream);
              border: 1px solid var(--border);
              width: 100%;
              max-width: 440px;
              max-height: 90vh;
              border-radius: 28px;
              box-shadow: 0 40px 100px -10px rgba(16, 52, 42, 0.15);
              z-index: 1;
              pointer-events: auto;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              margin: auto;
            }

            .auth-modal-scroll-area {
              flex: 1;
              overflow-y: auto;
              padding: 40px 32px;
              -webkit-overflow-scrolling: touch;
            }

            .auth-modal-close {
              position: absolute;
              top: 16px;
              right: 16px;
              color: var(--text-muted);
              transition: color 0.2s, background 0.2s;
              z-index: 10;
              background: var(--bg-surface);
              border: 1px solid var(--border);
              cursor: pointer;
              padding: 8px;
              border-radius: 50%;
            }
            .auth-modal-close:hover:not(:disabled) { color: var(--color-pine); background: var(--bg-hover); }
            .auth-modal-close:disabled { opacity: 0.4; cursor: not-allowed; }

            .auth-modal-content { display: flex; flex-direction: column; }

            .auth-back-btn {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              background: transparent;
              border: none;
              color: var(--text-muted);
              font-size: 0.8rem;
              cursor: pointer;
              padding: 0;
              margin-bottom: 12px;
            }
            .auth-back-btn:hover:not(:disabled) { color: var(--color-pine); }
            .auth-back-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            .auth-header-title {
              font-family: var(--font-display);
              font-size: 1.75rem;
              font-weight: 600;
              color: var(--color-pine);
              margin-bottom: 6px;
              letter-spacing: -0.02em;
            }

            .auth-header-sub {
              font-size: 0.9rem;
              color: var(--text-secondary);
              margin-bottom: 20px;
            }

            .auth-feedback-badge {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 14px;
              border-radius: 12px;
              font-size: 0.85rem;
              line-height: 1.35;
              margin-bottom: 16px;
            }
            .auth-feedback-badge.is-error {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.25);
              color: #fca5a5;
            }
            .auth-feedback-badge.is-success {
              background: rgba(34, 197, 94, 0.1);
              border: 1px solid rgba(34, 197, 94, 0.25);
              color: #86efac;
            }
            .auth-feedback-badge.is-info {
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.25);
              color: #93c5fd;
            }

            .auth-form { display: flex; flex-direction: column; gap: 14px; }
            .auth-fieldset { display: flex; flex-direction: column; gap: 14px; border: none; padding: 0; margin: 0; min-width: 0; }
            .auth-fieldset:disabled { opacity: 0.6; }
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
              transition: color 0.2s;
            }
            .password-toggle:hover { color: var(--color-pine); }

            .input-wrapper input {
              width: 100%;
              background: #fff;
              border: 1px solid rgba(16, 52, 42, 0.15);
              border-radius: 12px;
              padding: 12px 44px;
              color: var(--text);
              font-family: var(--font-sans);
              font-size: 0.95rem;
              transition: border-color 0.2s;
            }
            .input-wrapper input::placeholder { color: var(--text-muted); opacity: 0.6; }
            .input-wrapper input:focus { outline: none; border-color: var(--color-pine); }
            .input-wrapper input:disabled { cursor: not-allowed; }

            .auth-row-right { display: flex; justify-content: flex-end; margin-top: -4px; }
            .auth-link-btn {
              background: none;
              border: none;
              color: var(--color-pine);
              font-family: var(--font-sans);
              font-size: 0.78rem;
              font-weight: 600;
              cursor: pointer;
              padding: 0;
            }
            .auth-link-btn:hover { text-decoration: underline; }

            .auth-submit-btn {
              background: var(--color-radish);
              color: var(--color-cream);
              padding: 14px;
              border-radius: 100vw;
              font-family: var(--font-sans);
              font-weight: 600;
              font-size: 0.95rem;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              margin-top: 8px;
              border: 1px solid var(--color-radish);
              cursor: pointer;
              min-height: 50px;
              position: relative;
              overflow: hidden;
              transition: opacity 0.2s, transform 0.1s;
            }
            .auth-submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
            .auth-submit-btn:active:not(:disabled) { transform: scale(0.99); }
            .auth-submit-btn:disabled { cursor: progress; opacity: 0.85; transform: none; }
            .auth-submit-inner { display: inline-flex; align-items: center; gap: 10px; }

            .auth-modal-footer { margin-top: 20px; text-align: center; }

            .auth-view-toggle-btn {
              background: none;
              border: none;
              color: var(--color-pine);
              font-family: var(--font-sans);
              font-weight: 500;
              font-size: 0.85rem;
              cursor: pointer;
              padding: 4px 8px;
              transition: opacity 0.2s;
            }
            .auth-view-toggle-btn:hover:not(:disabled) { opacity: 0.7; }
            .auth-view-toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }

            @media (max-width: 768px) {
              .auth-modal-overlay { padding: 16px; align-items: center !important; }
              .auth-modal-container { max-width: 100%; margin: auto !important; max-height: 88dvh; }
              .auth-modal-scroll-area { padding: 32px 20px; }
              .auth-header-title { font-size: 1.5rem; }
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
