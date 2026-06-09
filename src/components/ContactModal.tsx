import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

const WEBHOOK = 'https://n8n.srv1574981.hstgr.cloud/webhook/contacto-ravyn'

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', interest: 'web', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify(formData),
      })
      if (res.ok || res.status === 200) {
        setStatus('success')
        setFormData({ name: '', email: '', interest: 'web', message: '' })
        setTimeout(() => { setStatus('idle'); onClose() }, 2200)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const submitLabel =
    status === 'loading' ? 'Sembrando…' :
    status === 'success' ? '¡Recibido!' :
    status === 'error'   ? 'Algo no germinó' :
    'Siembra tu proyecto'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="cm-overlay">
          <motion.div
            className="cm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="cm-content"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.4, ease }}
          >
            <button className="cm-close" onClick={onClose} aria-label="Cerrar">
              <X size={18} strokeWidth={2.25} />
            </button>

            <div className="cm-head">
              <span className="cm-tag">Cuéntanos</span>
              <h2 className="cm-title">Siembra tu proyecto.</h2>
              <p className="cm-sub">
                Respondemos en menos de 24 horas. Si no sabes por dónde empezar,
                también — para eso estamos.
              </p>
            </div>

            <form className="cm-form" onSubmit={handleSubmit}>
              <div className="cm-field">
                <label className="cm-label" htmlFor="cm-name">Nombre</label>
                <input
                  id="cm-name" name="name" type="text" required
                  className="cm-input" placeholder="Tu nombre"
                  value={formData.name} onChange={handleChange}
                />
              </div>

              <div className="cm-field">
                <label className="cm-label" htmlFor="cm-email">Email</label>
                <input
                  id="cm-email" name="email" type="email" required
                  className="cm-input" placeholder="tu@email.com"
                  value={formData.email} onChange={handleChange}
                />
              </div>

              <div className="cm-field">
                <label className="cm-label" htmlFor="cm-interest">Interés</label>
                <select
                  id="cm-interest" name="interest"
                  className="cm-input cm-select"
                  value={formData.interest} onChange={handleChange}
                >
                  <option value="web">Desarrollo web y de apps</option>
                  <option value="iot">Soluciones IoT</option>
                  <option value="automation">Automatización de procesos</option>
                </select>
              </div>

              <div className="cm-field">
                <label className="cm-label" htmlFor="cm-message">Mensaje</label>
                <textarea
                  id="cm-message" name="message" required
                  className="cm-input cm-textarea" placeholder="¿Qué quieres construir?"
                  value={formData.message} onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn-primary cm-submit" disabled={status === 'loading'}>
                {submitLabel}{status === 'idle' && <span> →</span>}
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="cm-success"
                >
                  Nos ponemos en contacto contigo pronto. 🌱
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="cm-error"
                >
                  Algo no germinó. Inténtalo de nuevo o escríbenos por WhatsApp.
                </motion.p>
              )}
            </form>
          </motion.div>

          <style>{`
            .cm-overlay {
              position: fixed;
              inset: 0;
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .cm-backdrop {
              position: absolute;
              inset: 0;
              background: rgba(16, 52, 42, 0.55);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }
            .cm-content {
              position: relative;
              width: 100%;
              max-width: 520px;
              max-height: 90vh;
              overflow-y: auto;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.10);
              border-radius: var(--radius-lg);
              box-shadow: 0 40px 90px rgba(16, 52, 42, 0.30);
              padding: clamp(32px, 5vw, 48px);
            }

            .cm-close {
              position: absolute;
              top: 20px;
              right: 20px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: var(--color-cream);
              border: 1px solid rgba(16, 52, 42, 0.15);
              color: var(--color-pine);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: background 0.25s, transform 0.25s, border-color 0.25s;
            }
            .cm-close:hover {
              background: var(--color-cream-2);
              border-color: var(--color-pine);
              transform: rotate(90deg);
            }

            .cm-head { margin-bottom: 28px; }
            .cm-tag {
              font-family: var(--font-mono);
              font-size: 0.68rem;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--color-radish);
            }
            .cm-title {
              font-family: var(--font-display);
              font-weight: 600;
              font-size: clamp(28px, 5vw, 38px);
              letter-spacing: -0.03em;
              color: var(--color-pine);
              line-height: 1.05;
              margin: 12px 0 12px;
            }
            .cm-sub {
              font-family: var(--font-sans);
              font-size: 0.92rem;
              color: var(--text-secondary);
              line-height: 1.6;
            }

            .cm-form { display: flex; flex-direction: column; gap: 18px; }
            .cm-field { display: flex; flex-direction: column; gap: 7px; }
            .cm-label {
              font-family: var(--font-mono);
              font-size: 0.64rem;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: var(--text-muted);
            }
            .cm-input {
              width: 100%;
              font-family: var(--font-sans);
              font-size: 0.95rem;
              color: var(--color-pine);
              background: var(--color-cream-2);
              border: 1px solid rgba(16, 52, 42, 0.12);
              border-radius: var(--radius-md);
              padding: 13px 15px;
              transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
              appearance: none;
            }
            .cm-input::placeholder { color: var(--text-muted); }
            .cm-input:focus {
              outline: none;
              border-color: var(--color-radish);
              background: var(--color-cream);
              box-shadow: 0 0 0 3px rgba(224, 67, 107, 0.12);
            }
            .cm-select {
              cursor: pointer;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235C7268' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 14px center;
              padding-right: 42px;
            }
            .cm-textarea { min-height: 110px; resize: vertical; }

            .cm-submit {
              width: 100%;
              justify-content: center;
              margin-top: 4px;
              padding: 15px;
            }

            .cm-success {
              font-family: var(--font-mono);
              font-size: 0.74rem;
              color: var(--color-sprout);
              text-align: center;
            }
            .cm-error {
              font-family: var(--font-mono);
              font-size: 0.74rem;
              color: var(--color-radish);
              text-align: center;
            }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  )
}
