import { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: keyof JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  tag: Tag = 'p',
  onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Dividir el texto manualmente para evitar dependencia de plugin de pago
  const elements = useMemo(() => {
    if (splitType === 'words') {
      return text.split(' ').map((word, i) => ({ id: i, content: word + (i < text.split(' ').length - 1 ? '\u00A0' : '') }));
    }
    return text.split('').map((char, i) => ({ id: i, content: char }));
  }, [text, splitType]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const targets = containerRef.current.querySelectorAll('.split-item');

    gsap.fromTo(targets, 
      { ...from },
      {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top bottom-=${threshold * 100}%`,
          toggleActions: 'play none none none',
          once: true,
        },
        onComplete: onLetterAnimationComplete
      }
    );
  }, { scope: containerRef, dependencies: [text, isInView] });

  return (
    <Tag
      ref={containerRef}
      className={`split-parent ${className}`}
      style={{ 
        textAlign, 
        display: 'inline-block',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      }}
    >
      {elements.map((el) => (
        <span
          key={el.id}
          className="split-item"
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {el.content === ' ' ? '\u00A0' : el.content}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
