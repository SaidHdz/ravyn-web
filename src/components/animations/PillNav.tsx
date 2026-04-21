import React, { useEffect, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './PillNav.css';

interface PillNavItem {
  label: string;
  href: string;
  ariaLabel?: string;
}

interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = 'transparent',
  hoveredPillTextColor = '#000',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<gsap.core.Timeline[]>([]);
  const activeTweenRefs = useRef<gsap.core.Tween[]>([]);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[i]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.6, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 0.6, ease, overwrite: 'auto' }, 0);
        if (white) tl.to(white, { y: 0, opacity: 1, duration: 0.6, ease, overwrite: 'auto' }, 0);

        tlRefs.current[i] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);

    if (initialLoadAnimation) {
      if (logoRef.current) gsap.from(logoRef.current, { scale: 0, duration: 0.6, ease });
      if (navItemsRef.current) gsap.from(navItemsRef.current, { width: 0, opacity: 0, duration: 0.8, ease, delay: 0.2 });
    }

    return () => window.removeEventListener('resize', layout);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tlRefs.current[i]?.tweenTo(tlRefs.current[i].duration(), { duration: 0.3, ease });
  };

  const handleLeave = (i: number) => {
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tlRefs.current[i]?.tweenTo(0, { duration: 0.2, ease });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (mobileMenuRef.current) {
      if (newState) {
        gsap.set(mobileMenuRef.current, { visibility: 'visible' });
        gsap.to(mobileMenuRef.current, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.to(mobileMenuRef.current, { opacity: 0, y: 10, duration: 0.2, ease, onComplete: () => gsap.set(mobileMenuRef.current!, { visibility: 'hidden' }) });
      }
    }
    onMobileMenuClick?.();
  };

  const isRouterLink = (href: string) => href.startsWith('/') && !href.includes('#');

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary">
        <a href="/" className="pill-logo" ref={logoRef as any}>
          <img src={logo} alt={logoAlt} />
        </a>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href} role="none">
                <a
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span className="hover-circle" ref={el => { circleRefs.current[i] = el; }} />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button className="mobile-menu-button mobile-only" onClick={toggleMobileMenu}>
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(PillNav);
