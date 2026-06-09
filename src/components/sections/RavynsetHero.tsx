import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export default function RavynsetHero() {
  return (
    <section className="rhero">
      {/* Símbolo monumental como textura */}
      <img src="/brand/symbol-pine.png" alt="" aria-hidden="true" className="rhero-symbol" />

      <div className="container rhero-inner">
        <motion.a
          href="/#labs"
          className="rhero-breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          ← Ravyn Labs
        </motion.a>

        <motion.span
          className="rhero-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.05 }}
        >
          <span className="rhero-badge-dot" /> Ravynset · Live
        </motion.span>

        <motion.h1
          className="rhero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
        >
          Tu clínica pierde citas todos los días.<br />Nosotros las recuperamos.
        </motion.h1>

        <motion.p
          className="rhero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
        >
          Un CRM diseñado para clínicas que centraliza la gestión de pacientes, 
          con agenda 24/7 y comunicación automática por WhatsApp.
        </motion.p>

        <motion.div
          className="rhero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.26 }}
        >
          <button
            className="rhero-btn-primary"
            onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Empieza hoy →
          </button>
          <button
            className="rhero-btn-secondary"
            onClick={() => document.getElementById('incluye')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Conocer el sistema
          </button>
        </motion.div>
      </div>

      <style>{`
        .rhero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          background: var(--color-cream);
          overflow: hidden;
        }

        .rhero-symbol {
          position: absolute;
          top: 50%;
          right: -8%;
          transform: translateY(-50%);
          width: clamp(360px, 44vw, 580px);
          height: auto;
          opacity: 0.06;
          pointer-events: none;
          user-select: none;
          z-index: 1;
        }

        .rhero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 760px;
        }

        .rhero-breadcrumb {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .rhero-breadcrumb:hover { color: var(--color-pine); }

        .rhero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-sprout);
          margin-bottom: 24px;
        }
        .rhero-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-sprout);
          animation: rhero-pulse 2.4s ease-in-out infinite;
        }
        @keyframes rhero-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

        .rhero-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(40px, 6vw, 80px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: var(--color-pine);
        }

        .rhero-sub {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 18px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 540px;
          margin-top: 26px;
        }

        .rhero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 36px;
        }

        .rhero-btn-primary {
          background: var(--color-radish);
          color: var(--color-cream);
          padding: 14px 30px;
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--color-radish);
          transition: opacity 0.2s, transform 0.2s;
        }
        .rhero-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .rhero-btn-secondary {
          background: transparent;
          color: var(--color-pine);
          padding: 14px 28px;
          border-radius: var(--radius-pill);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--border-strong);
          transition: border-color 0.2s, background 0.2s;
        }
        .rhero-btn-secondary:hover {
          border-color: var(--color-pine);
          background: var(--bg-hover);
        }

        @media (max-width: 768px) {
          .rhero { padding-top: 110px; padding-bottom: 70px; min-height: auto; }
          .rhero-symbol { right: -28%; opacity: 0.05; }
          .rhero-sub { max-width: none; }
          .rhero-actions { width: 100%; }
          .rhero-btn-primary, .rhero-btn-secondary { flex: 1; text-align: center; }
        }
      `}</style>
    </section>
  )
}
