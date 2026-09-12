import { motion } from 'motion/react'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import ProjectModal from '../ProjectModal'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const projectImages: Record<string, string[]> = {
  klino: [
    '/projects/klino/login.jpeg',
    '/projects/klino/home.jpeg',
    '/projects/klino/expedientes.jpeg',
    '/projects/klino/calendario.jpeg',
    '/projects/klino/ajustes.jpeg',
  ],
  ravynset: [],
  slimergy: [
    '/projects/slimergy/home_despues_slimergy.jpeg',
    '/projects/slimergy/home_antes_slimergy.jpeg',
    '/projects/slimergy/cuartos__despues_slimergy.jpeg',
    '/projects/slimergy/cuartos__antes_slimergy.jpeg',
    '/projects/slimergy/conifg_despues_slimergy.jpeg',
    '/projects/slimergy/config_antes_slimergy.jpeg',
  ],
  'slimergy-landing': [
    '/projects/slimergy/home_despues_slimergy.jpeg',
    '/projects/slimergy/cuartos__despues_slimergy.jpeg',
  ],
  'shield-sense': [
    '/projects/shield-sense/Home.jpg',
    '/projects/shield-sense/Alertas.jpg',
    '/projects/shield-sense/Ajustes.jpg',
  ],
}

const statusColor: Record<string, string> = {
  LIVE: 'var(--color-sprout)',
  BETA: 'var(--color-radish)',
  CRECIENDO: 'var(--color-muted)',
  GROWING: 'var(--color-muted)',
}

export default function Proyectos() {
  const { t } = useLanguage()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const labsProyectos = t.proyectos.items.map(p => ({
    ...p,
    images: projectImages[p.id] || [],
  }))

  const clientProyectos = t.proyectos.clientItems.map(p => ({
    ...p,
    images: projectImages[p.id] || [],
  }))

  const allProjects = [...labsProyectos, ...clientProyectos]
  const selectedProject = allProjects.find(p => p.id === selectedId) || null

  return (
    <section id="labs" className="labs2">
      <div className="container">

        {/* --- Bloque 1: Labs (Productos propios) --- */}
        <div className="labs2-section">
          <div className="labs2-badge-row">
            <span className="labs2-tag">{t.proyectos.tagLabs}</span>
          </div>

          <motion.h2
            className="labs2-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
          >
            {t.proyectos.headingLine1}<br />{t.proyectos.headingLine2}
          </motion.h2>

          <motion.p
            className="labs2-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease, delay: 0.14 }}
          >
            {t.proyectos.intro}
          </motion.p>

          {/* Filas Labs */}
          <div className="labs2-list">
            {labsProyectos.map((p, i) => (
              <motion.button
                type="button"
                key={p.id}
                className={`labs2-row ${(p.status as string) === 'CRECIENDO' || (p.status as string) === 'GROWING' ? 'labs2-row--soft' : ''}`}
                onClick={() => setSelectedId(p.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <span className="labs2-row-name">{p.title}</span>
                <span className="labs2-row-desc">{p.rowDesc}</span>
                <span className="labs2-row-status" style={{ color: statusColor[p.status] || 'var(--color-muted)' }}>
                  <span className="labs2-status-dot" style={{ background: statusColor[p.status] || 'var(--color-muted)' }} />
                  {p.status}
                </span>
                <span className="labs2-row-action">
                  {t.proyectos.ctaRow} <span aria-hidden="true">→</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Separador temático */}
        <div className="labs2-divider" />

        {/* --- Bloque 2: Studio (Semillas que germinamos / Clientes) --- */}
        <div className="labs2-section">
          <div className="labs2-badge-row">
            <span className="labs2-tag labs2-tag--radish">{t.proyectos.tagStudio}</span>
          </div>

          <motion.h2
            className="labs2-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.6, ease, delay: 0.06 }}
          >
            {t.proyectos.headingClientLine1}<br />{t.proyectos.headingClientLine2}
          </motion.h2>

          <motion.p
            className="labs2-intro"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 0.55, ease, delay: 0.14 }}
          >
            {t.proyectos.introClient}
          </motion.p>

          {/* Filas Studio / Clientes */}
          <div className="labs2-list">
            {clientProyectos.map((p, i) => (
              <motion.button
                type="button"
                key={p.id}
                className={`labs2-row ${(p.status as string) === 'CRECIENDO' || (p.status as string) === 'GROWING' ? 'labs2-row--soft' : ''}`}
                onClick={() => setSelectedId(p.id)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.5, ease, delay: i * 0.08 }}
              >
                <span className="labs2-row-name">{p.title}</span>
                <span className="labs2-row-desc">{p.rowDesc}</span>
                <span className="labs2-row-status" style={{ color: statusColor[p.status] || 'var(--color-muted)' }}>
                  <span className="labs2-status-dot" style={{ background: statusColor[p.status] || 'var(--color-muted)' }} />
                  {p.status}
                </span>
                <span className="labs2-row-action">
                  {t.proyectos.ctaRow} <span aria-hidden="true">→</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedId(null)}
        project={selectedProject}
      />

      <style>{`
        .labs2 {
          padding: clamp(80px, 12vh, 130px) 0;
          background: var(--color-cream);
        }

        .labs2-section {
          position: relative;
        }

        .labs2-badge-row {
          margin-bottom: 16px;
        }

        .labs2-tag {
          display: inline-flex;
          align-items: center;
          padding: 4px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(16, 52, 42, 0.06);
          color: var(--color-pine);
          border: 1px solid rgba(16, 52, 42, 0.14);
        }

        .labs2-tag--radish {
          background: rgba(224, 67, 107, 0.08);
          color: var(--color-radish);
          border-color: rgba(224, 67, 107, 0.25);
        }

        .labs2-divider {
          width: 100%;
          height: 1px;
          background: rgba(16, 52, 42, 0.1);
          margin: clamp(56px, 8vh, 88px) 0;
        }

        .labs2-heading {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.03em;
          color: var(--color-pine);
        }

        .labs2-intro {
          font-family: var(--font-sans);
          font-size: clamp(15px, 1.3vw, 16px);
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 460px;
          margin-top: 24px;
          margin-bottom: 56px;
        }

        .labs2-list {
          display: flex;
          flex-direction: column;
        }

        .labs2-row {
          display: grid;
          grid-template-columns: 1.2fr 2fr auto auto;
          align-items: center;
          gap: 32px;
          width: 100%;
          text-align: left;
          padding: 30px 24px;
          background: transparent;
          border: none;
          border-top: 1px solid rgba(16, 52, 42, 0.12);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.25s ease;
          font-family: inherit;
        }
        .labs2-row:last-of-type {
          border-bottom: 1px solid rgba(16, 52, 42, 0.12);
        }
        .labs2-row:hover { background: var(--color-cream-2); }
        .labs2-row--soft { background: rgba(16, 52, 42, 0.025); }
        .labs2-row--soft:hover { background: rgba(16, 52, 42, 0.05); }

        .labs2-row-name {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: clamp(22px, 2.6vw, 32px);
          letter-spacing: -0.02em;
          color: var(--color-pine);
          line-height: 1.1;
        }

        .labs2-row-desc {
          font-family: var(--font-sans);
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }

        .labs2-row-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
        }
        .labs2-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .labs2-row-action {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-sans);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-pine);
          white-space: nowrap;
        }
        .labs2-row-action span { transition: transform 0.22s ease; }
        .labs2-row:hover .labs2-row-action { color: var(--color-radish); }
        .labs2-row:hover .labs2-row-action span { transform: translateX(4px); }

        @media (max-width: 860px) {
          .labs2-row {
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "name   status"
              "desc   desc"
              "action action";
            gap: 14px 16px;
            padding: 26px 18px;
          }
          .labs2-row-name   { grid-area: name; }
          .labs2-row-status { grid-area: status; align-self: start; padding-top: 8px; }
          .labs2-row-desc   { grid-area: desc; }
          .labs2-row-action { grid-area: action; }
          .labs2-intro { max-width: none; }
        }
      `}</style>
    </section>
  )
}
