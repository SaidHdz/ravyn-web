import GooeyNav from './animations/GooeyNav'
import { motion, useScroll, useSpring, type Variants } from 'motion/react'
import { Link, useLocation } from 'react-router-dom'

interface NavbarProps {
  theme?: string
  onToggle?: () => void
}

const ease = [0.16, 1, 0.3, 1] as const

const fillVariants: Variants = {
  rest:  { clipPath: 'circle(0% at 50% 50%)',   transition: { duration: 0.4, ease } },
  hover: { clipPath: 'circle(150% at 50% 50%)', transition: { duration: 0.7, ease } },
}

export default function Navbar({ }: NavbarProps) {
  const { scrollYProgress } = useScroll()
  const location = useLocation()
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  })

  const isRavynset = location.pathname === '/ravynset'

  const navItems = isRavynset 
    ? [
        { label: 'Home', href: '/ravynset' },
        { label: 'Planes', href: '#planes' }
      ]
    : [
        { label: 'Home', href: '/' },
        { label: 'Contacto', href: '#contacto' }
      ]

  return (
    <nav className="nav-gooey-wrapper">
      <motion.div className="scroll-progress" style={{ scaleX, zIndex: 1000 }} />
      
      <div className="nav-gooey-container">
        {/* Logo: Solo visible en desktop */}
        <Link 
          to={isRavynset ? "/ravynset" : "/"} 
          className={`nav-logo-simple desktop-only ${!isRavynset ? 'is-active-root' : ''}`}
          onClick={(e) => {
            if (location.pathname === '/' || location.pathname === '/ravynset') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          {isRavynset ? 'Ravynset' : 'Ravyn'}<span>.</span>
        </Link>
        
        <div className="nav-center-menu">
          <GooeyNav
            key={location.pathname}
            items={navItems}
            particleCount={12}
            particleDistances={[60, 5]}
            particleR={80}
            initialActiveIndex={0}
          />
        </div>

        <Link 
          to={isRavynset ? "/" : "/ravynset"} 
          className="nav-cta-link"
        >
          <motion.button
            className={`nav-cta-premium ${isRavynset ? 'is-ravynset-active' : ''}`}
            initial="rest"
            animate={isRavynset ? "hover" : "rest"}
            whileHover="hover"
            whileTap="rest"
          >
            <motion.span className="cta-btn-fill" variants={fillVariants} />
            <span className="cta-btn-label">
              {isRavynset ? 'Ravyn' : 'Ravynset'}
            </span>
          </motion.button>
        </Link>
      </div>

      <style>{`
        .nav-gooey-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .nav-gooey-container {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: var(--bg-surface);
          padding: 0.5rem 1.5rem;
          border-radius: 100vw;
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          pointer-events: auto;
          margin-top: 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .nav-center-menu {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .nav-logo-simple {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          cursor: pointer;
          position: relative;
          display: flex;
          z-index: 10;
        }

        .nav-logo-simple span {
          color: var(--accent);
        }

        .nav-logo-simple.is-active-root::after {
           content: '';
           position: absolute;
           bottom: -4px;
           left: 0;
           width: 100%;
           height: 2px;
           background: var(--accent);
           border-radius: 2px;
        }

        .nav-cta-link {
          text-decoration: none;
          z-index: 10;
          display: flex;
        }

        .nav-cta-premium {
          position: relative;
          padding: 10px 24px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-radius: 100vw;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }

        .cta-btn-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          z-index: 0;
          pointer-events: none;
        }

        .cta-btn-label {
          position: relative;
          z-index: 1;
          color: #fff;
          transition: color 0.3s ease;
        }

        .nav-cta-premium:hover .cta-btn-label {
          color: #000;
        }

        @media (max-width: 768px) {
          .nav-gooey-wrapper {
            height: 80px;
          }
          
          .nav-gooey-container {
            gap: 0.4rem;
            padding: 0.4rem 0.6rem;
            width: auto;
            max-width: 98vw;
            margin-top: 0.5rem;
            justify-content: center;
            background: var(--bg-surface);
            border: 1px solid var(--border);
            backdrop-filter: blur(12px);
          }

          .desktop-only {
            display: none !important;
          }

          .nav-center-menu {
             flex-shrink: 0; /* Evita colapso */
             min-width: 0;
          }

          .nav-cta-premium {
            padding: 8px 12px;
            font-size: 0.72rem;
            flex-shrink: 0;
            background: rgba(255, 255, 255, 0.08) !important;
          }

          .nav-cta-premium .cta-btn-fill {
             display: none !important;
          }
          
          .nav-center-menu {
            transform: scale(0.9);
          }
        }

        @media (max-width: 480px) {
          .nav-gooey-container {
            gap: 0.2rem;
            padding: 0.3rem 0.5rem;
          }
          .nav-center-menu {
            transform: scale(0.8);
          }
          .nav-cta-premium {
            padding: 7px 10px;
            font-size: 0.68rem;
          }
        }
      `}</style>
    </nav>
  )
}
