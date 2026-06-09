import { motion } from 'motion/react'
import { useState } from 'react'
import ProjectModal from '../ProjectModal'

const ease = [0.22, 1, 0.36, 1] as const
const viewport = { once: true, amount: 0.3 }

const proyectos = [
  {
    id: 'klino',
    title: 'Klino',
    status: 'BETA',
    color: '#10342A',
    rowDesc: 'Documenta la consulta médica por voz. Nota clínica automática conforme a NOM.',
    pageHref: '/klino',
    description: 'App móvil que transcribe la consulta médica por voz y genera la nota clínica estructurada conforme a NOM-004 y NOM-024, sin escritura manual.',
    problem: 'El médico pasa gran parte de la consulta escribiendo en lugar de mirar al paciente. La documentación clínica es obligatoria por normativa, pero le roba al médico lo más valioso: la atención.',
    solution: 'Klino escucha la consulta y genera automáticamente la nota clínica completa — antecedentes, exploración física — en formato estructurado conforme a NOM-004 y NOM-024. El médico habla con su paciente; Klino documenta.',
    result: '2do Lugar Innovatec Local 2026 — Área de Salud. Piloto en curso con médicos.',
    tech: ['Speech-to-Text', 'IA', 'Web App', 'Expediente Digital', 'Expo', 'n8n', 'Supabase'],
    images: [
      '/projects/klino/Home.jpg',
      '/projects/klino/Expedientes.jpg',
      '/projects/klino/Hardware.jpg',
      '/projects/klino/Ajustes.jpg',
    ],
  },
  {
    id: 'ravynset',
    title: 'Ravynset',
    status: 'LIVE',
    color: '#E0436B',
    rowDesc: 'CRM para clínicas: agenda, expedientes y WhatsApp en un solo lugar.',
    pageHref: '/ravynset',
    description: 'CRM para clínicas que centraliza la gestión de citas y pacientes en un solo lugar, con agenda inteligente y comunicación automática por WhatsApp.',
    problem: 'La gestión de citas y pacientes vive dispersa entre cuadernos, WhatsApp del recepcionista y hojas de Excel. Las clínicas pierden tiempo, citas y seguimiento de pacientes.',
    solution: 'Un CRM diseñado para clínicas: agenda 24/7 sincronizada con WhatsApp, expedientes de pacientes centralizados y motor automático de reseñas en Google Maps.',
    result: 'Plataforma diseñada para resolver los puntos reales de fricción en la operación diaria de una clínica.',
    tech: ['React', 'n8n', 'WhatsApp API', 'Google Maps API', 'CRM'],
    images: [],
  },
  {
    id: 'shield-sense',
    title: 'Shield Sense',
    status: 'CRECIENDO',
    color: '#34C759',
    rowDesc: 'Wearable IoT que detecta impactos en la cabeza y alerta al cuidador.',
    pageHref: null,
    description: 'Wearable IoT integrado en un gorro que detecta impactos en la cabeza de adultos mayores y alerta al cuidador en tiempo real.',
    problem: 'Los golpes en la cabeza son la lesión más peligrosa en caídas de adultos mayores, pero los wearables tradicionales detectan movimiento del cuerpo, no el impacto real en el cráneo.',
    solution: 'Sensores de impacto colocados directamente sobre la cabeza, integrados discretamente en un gorro. Detectan la intensidad del golpe y envían alerta vía Bluetooth al celular del cuidador — sin internet.',
    result: '1er Lugar Innovatec Local 2026 — Área de Salud. Prototipo funcional reconocido por jurado médico y técnico.',
    tech: ['IoT', 'Sensores de impacto', 'App Móvil', 'Alertas en tiempo real', 'Expo', 'Three.js'],
    images: [
      '/projects/shield-sense/Home.jpg',
      '/projects/shield-sense/Alertas.jpg',
      '/projects/shield-sense/Ajustes.jpg',
    ],
  },
]

const statusColor: Record<string, string> = {
  LIVE: 'var(--color-sprout)',
  BETA: 'var(--color-radish)',
  CRECIENDO: 'var(--color-muted)',
}

export default function Proyectos() {
  const [selectedProject, setSelectedProject] = useState<typeof proyectos[0] | null>(null)

  return (
    <section id="labs" className="labs2">
      <div className="container">



        <motion.h2
          className="labs2-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
        >
          Productos que<br />sembramos nosotros.
        </motion.h2>

        <motion.p
          className="labs2-intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.55, ease, delay: 0.14 }}
        >
          Además del trabajo con clientes, corremos nuestros propios proyectos.
          Algunos ya están vivos, otros creciendo.
        </motion.p>

        {/* Filas de productos */}
        <div className="labs2-list">
          {proyectos.map((p, i) => (
            <motion.button
              type="button"
              key={p.id}
              className={`labs2-row ${p.status === 'CRECIENDO' ? 'labs2-row--soft' : ''}`}
              onClick={() => setSelectedProject(p)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.5, ease, delay: i * 0.08 }}
            >
              <span className="labs2-row-name">{p.title}</span>
              <span className="labs2-row-desc">{p.rowDesc}</span>
              <span className="labs2-row-status" style={{ color: statusColor[p.status] }}>
                <span className="labs2-status-dot" style={{ background: statusColor[p.status] }} />
                {p.status}
              </span>
              <span className="labs2-row-action">
                Conocer más <span aria-hidden="true">→</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      <style>{`
        .labs2 {
          padding: clamp(80px, 12vh, 130px) 0;
          background: var(--color-cream);
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
          grid-template-columns: 1.1fr 2fr auto auto;
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
          font-size: clamp(24px, 2.8vw, 34px);
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
