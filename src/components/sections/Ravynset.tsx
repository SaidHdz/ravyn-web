import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import BorderGlow from '../BorderGlow/BorderGlow'
import BlurText from '../animations/BlurText'

const ease = [0.16, 1, 0.3, 1] as const

export default function RavynsetCTA() {
  return (
    <section id="ravynset" className="section ravynset-promo-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <BorderGlow
            glowColor="45 100 60"
            colors={['#F59E0B', '#D97706', '#FBBF24']}
            backgroundColor="var(--bg-surface)"
            borderRadius={32}
            glowRadius={60}
            edgeSensitivity={30}
            glowIntensity={1.5}
            animated={true}
          >
            <div className="ravynset-promo-card">
              <div className="promo-content">
                <BlurText
                  text="¿Pierdes citas cada semana?"
                  className="promo-title"
                  delay={50}
                  animateBy="words"
                />
                <p className="promo-text">
                  Automatizamos tu agenda, tus recordatorios y tu reputación en Google. 
                  Tú solo atiendes pacientes.
                </p>
                <div className="promo-actions">
                  <Link to="/ravynset" className="promo-link-wrapper">
                    <motion.button
                      className="ravynset-cta-solid"
                      whileHover={{ scale: 1.03, brightness: 1.1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      Ver cómo funciona →
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>

      <style>{`
        .ravynset-promo-section {
          padding: 100px 0;
        }

        .ravynset-promo-card {
          padding: 80px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .promo-title {
          font-family: var(--font-sans);
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          color: var(--text);
          margin-bottom: 24px;
          letter-spacing: -0.04em;
          line-height: 1.1;
          justify-content: center;
        }

        .promo-text {
          font-size: clamp(1.1rem, 1.8vw, 1.4rem);
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 48px;
          max-width: 700px;
        }

        .promo-link-wrapper {
          display: inline-block;
          text-decoration: none;
        }

        .ravynset-cta-solid {
          background: #D97706; /* Ámbar sólido */
          color: #fff;
          padding: 18px 48px;
          border-radius: 100vw;
          font-size: 1.15rem;
          font-weight: 700;
          border: none;
          box-shadow: 0 10px 30px -5px rgba(217, 119, 6, 0.4);
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .ravynset-promo-card {
            padding: 60px 24px;
          }
          .promo-actions {
            width: 100%;
          }
          .promo-link-wrapper {
            width: 100%;
          }
          .ravynset-cta-solid {
            width: 100%;
            padding: 16px 32px;
            font-size: 1.1rem;
          }
        }
      `}</style>
    </section>
  )
}
