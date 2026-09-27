'use client';

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  scaleHover?: number;
  glow?: boolean;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltMaxAngle = 7,
  scaleHover = 1.02,
  glow = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width) * 100;
    const yPct = (mouseY / height) * 100;

    const rX = ((mouseY / height) - 0.5) * -tiltMaxAngle * 2;
    const rY = ((mouseX / width) - 0.5) * tiltMaxAngle * 2;

    setRotateX(rX);
    setRotateY(rY);
    setMousePos({ x: xPct, y: yPct });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="perspective-1000">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
          scale: isHovered ? scaleHover : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 24,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden transition-shadow duration-300 ${
          isHovered ? 'shadow-2xl' : 'shadow-sm'
        } ${className}`}
      >
        {/* Cursor-following ambient lighting sheen */}
        {glow && isHovered && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(208, 166, 63, 0.12), transparent 70%)`,
            }}
          />
        )}
        <div style={{ transform: 'translateZ(15px)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
