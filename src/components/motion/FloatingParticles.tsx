'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulseSpeed: number;
  char?: string;
  isChar: boolean;
}

export const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle classical Arabic glyphs and geometric points
    const glyphs = ['ن', 'ق', 'ص', 'ح', 'م', 'س', '✦', '✧', '•'];
    const particleCount = Math.min(35, Math.floor(width / 35));

    const particles: Particle[] = Array.from({ length: particleCount }).map(() => {
      const isChar = Math.random() > 0.45;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isChar ? 14 + Math.random() * 12 : 1.5 + Math.random() * 2.5,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -0.2 - Math.random() * 0.4, // float upwards gently
        opacity: 0.15 + Math.random() * 0.3,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        char: isChar ? glyphs[Math.floor(Math.random() * glyphs.length)] : undefined,
        isChar,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around seamlessly
        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        const currentOpacity = p.opacity + Math.sin(time + p.x) * 0.1;
        const clampedOpacity = Math.max(0.08, Math.min(0.5, currentOpacity));

        if (p.isChar && p.char) {
          ctx.font = `${p.size}px 'Amiri', 'Traditional Arabic', serif`;
          ctx.fillStyle = `rgba(224, 192, 109, ${clampedOpacity * 0.8})`; // accent-300 soft gold
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.char, p.x, p.y);
        } else {
          // Geometric starlight particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(175, 215, 206, ${clampedOpacity})`; // brand-200 mint
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(208, 166, 63, 0.4)';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
