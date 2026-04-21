import React, { useState, useRef, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagnetProps {
  children: ReactNode;
  distance?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  distance = 0.5,
  stiffness = 150,
  damping = 15,
  mass = 0.1,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness, damping, mass };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    mouseX.set(deltaX * distance);
    mouseY.set(deltaY * distance);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
