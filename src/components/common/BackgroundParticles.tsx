import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      isPrimary: Math.random() > 0.45,
      alpha: Math.random() * 0.5 + 0.25,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let pulse = 0;

    const render = () => {
      pulse += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw faint geometric grid matching theme
      ctx.strokeStyle = isDark ? 'rgba(54, 217, 255, 0.03)' : 'rgba(2, 132, 199, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 72;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(pulse + i * 0.5) * 0.18;
        const boundedAlpha = Math.max(0.12, Math.min(0.85, currentAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (isDark) {
          ctx.fillStyle = p.isPrimary
            ? `rgba(54, 217, 255, ${boundedAlpha})`
            : `rgba(180, 106, 255, ${boundedAlpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.isPrimary ? '#36D9FF' : '#B46AFF';
        } else {
          ctx.fillStyle = p.isPrimary
            ? `rgba(2, 132, 199, ${boundedAlpha * 0.85})`
            : `rgba(124, 58, 237, ${boundedAlpha * 0.85})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.isPrimary ? '#0284C7' : '#7C3AED';
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Ambient gradient lighting pools */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
          isDark ? 'bg-[#36D9FF]/10' : 'bg-sky-400/15'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full blur-[150px] pointer-events-none transition-colors duration-500 ${
          isDark ? 'bg-[#B46AFF]/10' : 'bg-indigo-400/15'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full blur-[160px] pointer-events-none transition-colors duration-500 ${
          isDark ? 'bg-[#36D9FF]/8' : 'bg-cyan-400/10'
        }`}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-70" />
    </div>
  );
};
