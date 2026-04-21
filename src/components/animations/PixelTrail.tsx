import React, { useEffect, useRef } from 'react';

interface PixelTrailProps {
  pixelSize?: number;
  fadeSpeed?: number;
  color?: string;
  className?: string;
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 40,
  fadeSpeed = 0.05,
  color = 'rgba(96, 165, 250, 0.2)', // Ravyn Blue sutil
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixels = useRef<Map<string, number>>(new Map());
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const col = Math.floor(mouseRef.current.x / pixelSize);
      const row = Math.floor(mouseRef.current.y / pixelSize);
      const key = `${col}-${row}`;

      // Activar el píxel bajo el mouse
      pixels.current.set(key, 1);

      // Dibujar y desvanecer píxeles
      pixels.current.forEach((opacity, pixelKey) => {
        const [pCol, pRow] = pixelKey.split('-').map(Number);
        
        ctx.fillStyle = color.replace('0.2', opacity.toString());
        ctx.fillRect(pCol * pixelSize, pRow * pixelSize, pixelSize - 1, pixelSize - 1);

        const newOpacity = opacity - fadeSpeed;
        if (newOpacity <= 0) {
          pixels.current.delete(pixelKey);
        } else {
          pixels.current.set(pixelKey, newOpacity);
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [pixelSize, fadeSpeed, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.4 }}
    />
  );
};

export default PixelTrail;
