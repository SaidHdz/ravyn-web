import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

export default function KlinoHero() {
  return (
    <section className="khero">
      {/* Símbolo monumental como textura */}
      <img src="/brand/symbol-pine.png" alt="" aria-hidden="true" className="khero-symbol" />

      <div className="container khero-inner">
        <motion.a
          href="/#labs"
          className="khero-breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease }}
        >
          ← Ravyn Labs
        </motion.a>

        <motion.span
          className="khero-badge"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.05 }}
        >
          <span className="khero-badge-dot" /> Klino · Beta
        </motion.span>

        <motion.h1
          className="khero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
        >
          Habla con tu paciente.<br />Klino escribe la nota.
        </motion.h1>

        <motion.p
          className="khero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
        >
          Klino escucha la consulta y genera la nota clínica completa —
          conforme a NOM-004 y NOM-024. Sin teclear, sin dejar de mirar a quien tienes enfrente.
        </motion.p>

        <motion.div
          className="khero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.26 }}
        >
          <button
            className="khero-btn-primary"
            onClick={() => document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Únete al beta →
          </button>
          <button
            className="khero-btn-secondary"
            onClick={() => document.getElementById('incluye')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Cómo funciona
          </button>
        </motion.div>

        <motion.div
          className="khero-award"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
        >
          🏆 2º lugar Innovatec 2026 · Área de Salud
        </motion.div>
      </div>

      <style>{`
        .khero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          background: var(--color-cream);
          overflow: hidden;
        }

        .khero-symbol {
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

        .khero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 760px;
        }

        .khero-breadcrumb {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 28px;
          transition: color 0.2s;
        }
        .khero-breadcrumb:hover { color: var(--color-pine); }

        .khero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-radish);
          margin-bottom: 24px;
        }
        .khero-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-radish);
          animation: khero-pulse 2.4s ease-in-out infinite;
        }
        @keyframes khero-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

        .khero-title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(40px, 7vw, 88px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: var(--color-pine);
        }

        .khero-sub {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.4vw, 18px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 540px;
          margin-top: 26px;
        }

        .khero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 36px;
        }

        .khero-btn-primary {
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
        .khero-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        .khero-btn-secondary {
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
        .khero-btn-secondary:hover {
          border-color: var(--color-pine);
          background: var(--bg-hover);
        }

        .khero-award {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .khero { padding-top: 110px; padding-bottom: 70px; min-height: auto; }
          .khero-symbol { right: -28%; opacity: 0.05; }
          .khero-sub { max-width: none; }
          .khero-actions { width: 100%; }
          .khero-btn-primary, .khero-btn-secondary { flex: 1; text-align: center; }
        }
      `}</style>
    </section>
  )
}
