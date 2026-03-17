import React, { useRef, useEffect } from 'react';

/**
 * Starfield - Rolls Royce Starlight Ceiling effect.
 * Renders a fixed canvas background with twinkling, slowly moving stars.
 * Renders behind all content as a fixed background.
 */

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  phase: number;       // offset into the twinkle cycle
  speed: number;       // twinkle speed
  warmth: number;      // 0 = cool white, 1 = warm gold
}

function createStars(width: number, height: number, count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const isAccent = Math.random() < 0.08; // 8% of stars have golden warmth
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() < 0.85
        ? 0.3 + Math.random() * 0.7          // most stars: tiny 0.3–1.0px
        : 1.0 + Math.random() * 0.8,         // ~15%: brighter 1.0–1.8px
      baseAlpha: 0.15 + Math.random() * 0.55, // 0.15–0.70 opacity
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,       // varied twinkle speeds
      warmth: isAccent ? 0.4 + Math.random() * 0.6 : 0,
    });
  }
  return stars;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density: ~1 star per 3000px² gives a luxurious scattered feel
      const area = window.innerWidth * window.innerHeight;
      const count = Math.floor(area / 2800);
      starsRef.current = createStars(window.innerWidth, window.innerHeight, count);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const star of starsRef.current) {
        // Twinkle: smooth sin wave modulating alpha
        const twinkle = Math.sin(time * 0.001 * star.speed + star.phase);
        const alpha = star.baseAlpha * (0.45 + 0.55 * ((twinkle + 1) / 2));

        // Color: blend between cool white and warm gold
        const r = Math.round(255 - star.warmth * 50);   // 255 → 205
        const g = Math.round(255 - star.warmth * 95);    // 255 → 160
        const b = Math.round(255 - star.warmth * 170);   // 255 → 85

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Larger stars get a subtle glow halo
        if (star.radius > 1.0 && alpha > 0.3) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
