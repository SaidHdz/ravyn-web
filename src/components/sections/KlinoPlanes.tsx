import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const funciones = [
  'Transcripción por voz ilimitada',
  'Notas conforme a NOM-004 y NOM-024',
  'Antecedentes, exploración y diagnóstico estructurados',
  'Expediente digital por paciente',
  'Plantillas por especialidad',
  'Revisión y firma antes de guardar',
  'Exportación de datos en cualquier momento',
  'Soporte directo por WhatsApp',
]

export default function KlinoPlanes() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 800))
    setStatus('done')
  }

  return (
    <section id="planes" className="kpl">
      <div className="container">
        <motion.span
          className="kpl-label"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.4, ease }}
        >
          Beta abierto
        </motion.span>
        <motion.h2
          className="kpl-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          Entra gratis.<br />Ayuda a moldear Klino.
        </motion.h2>

        <div className="kpl-layout">
          <motion.div
            className="kpl-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease }}
          >
            <span className="kpl-badge">BETA</span>
            <p className="kpl-plan-name">Acceso anticipado</p>
            <div className="kpl-price-row">
              <span className="kpl-price">Gratis</span>
              <span className="kpl-period">durante el beta</span>
            </div>
            <p className="kpl-price-note">Precio estimado al lanzar: $600 MXN/mes</p>

            <div className="kpl-divider" />

            <ul className="kpl-list">
              {funciones.map((f, i) => (
                <li key={i} className="kpl-item">
                  <Check style={{ width: 15, height: 15, color: 'var(--color-sprout)', flexShrink: 0, marginTop: 3 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="kpl-waitlist"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            <h3 className="kpl-waitlist-title">Únete al beta</h3>
            <p className="kpl-waitlist-desc">
              Klino está en acceso anticipado para médicos y clínicas. Deja tu correo
              y te contactamos para activar tu cuenta.
            </p>

            {status === 'done' ? (
              <div className="kpl-success">
                <span className="kpl-success-dot" />
                Listo. Te escribimos pronto para activar tu cuenta. 🌱
              </div>
            ) : (
              <form className="kpl-form" onSubmit={handleWaitlist}>
                <input
                  type="email"
                  className="kpl-input"
                  placeholder="tu@clinica.mx"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="kpl-submit" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Guardando…' : 'Quiero acceso beta →'}
                </button>
              </form>
            )}

            <p className="kpl-waitlist-footer">
              También puedes escribirnos por{' '}
              <a href="https://wa.me/528361168007" target="_blank" rel="noopener noreferrer" className="kpl-wa-link">
                WhatsApp
              </a>
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .kpl { padding: clamp(80px, 12vh, 130px) 0; background: var(--color-cream); }
        .kpl-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .kpl-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(32px, 4.2vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.03em;
          color: var(--color-pine);
          margin-bottom: 56px;
        }
        .kpl-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        .kpl-card {
          border: 1.5px solid var(--color-pine);
          border-radius: var(--radius-lg);
          background: var(--color-cream-2);
          padding: 40px 36px;
        }
        .kpl-badge {
          display: inline-block;
          background: var(--color-radish);
          color: var(--color-cream);
          padding: 4px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: 18px;
        }
        .kpl-plan-name {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }
        .kpl-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
        .kpl-price {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 600;
          letter-spacing: -0.04em;
          color: var(--color-pine);
          line-height: 1;
        }
        .kpl-period { font-size: 0.9rem; color: var(--text-muted); }
        .kpl-price-note { font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-muted); }
        .kpl-divider { height: 1px; background: rgba(16,52,42,0.12); margin: 24px 0; }
        .kpl-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .kpl-item {
          display: flex;
          gap: 12px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .kpl-waitlist {
          padding: 40px 36px;
          background: var(--color-pine);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .kpl-waitlist-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          color: var(--color-cream);
        }
        .kpl-waitlist-desc { font-family: var(--font-sans); font-size: 0.92rem; color: rgba(250,246,238,0.66); line-height: 1.65; }
        .kpl-form { display: flex; flex-direction: column; gap: 12px; }
        .kpl-input {
          background: rgba(250,246,238,0.06);
          border: 1px solid rgba(250,246,238,0.18);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-cream);
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .kpl-input::placeholder { color: rgba(250,246,238,0.4); }
        .kpl-input:focus { border-color: var(--color-radish); background: rgba(250,246,238,0.1); }
        .kpl-submit {
          background: var(--color-radish);
          color: var(--color-cream);
          padding: 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s, transform 0.2s;
        }
        .kpl-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .kpl-submit:disabled { opacity: 0.5; cursor: default; }
        .kpl-success {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-cream);
          padding: 16px;
          background: rgba(250,246,238,0.06);
          border-radius: var(--radius-md);
        }
        .kpl-success-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-sprout); flex-shrink: 0; }
        .kpl-waitlist-footer { font-size: 0.8rem; color: rgba(250,246,238,0.5); }
        .kpl-wa-link {
          color: var(--color-cream);
          text-decoration: underline;
          text-decoration-color: rgba(250,246,238,0.4);
          transition: text-decoration-color 0.2s;
        }
        .kpl-wa-link:hover { text-decoration-color: var(--color-cream); }
        @media (max-width: 768px) {
          .kpl-layout { grid-template-columns: 1fr; }
          .kpl-card, .kpl-waitlist { padding: 32px 24px; }
        }
      `}</style>
    </section>
  )
}
