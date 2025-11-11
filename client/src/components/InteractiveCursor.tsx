import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  timestamp: number;
}

export default function InteractiveCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gradientDiv = gradientRef.current;
    if (!canvas || !gradientDiv) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 150;
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 2 + Math.random() * 2.5,
          alpha: 0.5 + Math.random() * 0.4
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastMouseMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveTime < 16) return;
      lastMouseMoveTime = now;

      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      
      gradientDiv.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(16, 185, 129, 0.15), transparent 70%)`;

      trailRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1,
        timestamp: now
      });

      if (trailRef.current.length > 30) {
        trailRef.current.shift();
      }
    };

    const handleClick = (e: MouseEvent) => {
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 200 + Math.random() * 150,
        alpha: 0.9
      });

      if (ripplesRef.current.length > 8) {
        ripplesRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);

    const updateParticles = () => {
      const mouse = mouseRef.current;
      const repelRadius = 150;
      const returnSpeed = 0.05;

      particlesRef.current.forEach(particle => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          particle.vx += (dx / distance) * force * 3;
          particle.vy += (dy / distance) * force * 3;
        }

        particle.vx += (particle.baseX - particle.x) * returnSpeed;
        particle.vy += (particle.baseY - particle.y) * returnSpeed;

        particle.vx *= 0.9;
        particle.vy *= 0.9;

        particle.x += particle.vx;
        particle.y += particle.vy;
      });
    };

    const updateRipples = () => {
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 5;
        ripple.alpha -= 0.015;
        return ripple.alpha > 0;
      });
    };

    const updateTrail = () => {
      const now = Date.now();
      trailRef.current = trailRef.current.filter(point => {
        const age = now - point.timestamp;
        point.alpha = Math.max(0, 1 - (age / 600));
        return age < 600;
      });
    };

    const drawParticles = () => {
      particlesRef.current.forEach(particle => {
        ctx.fillStyle = `rgba(16, 185, 129, ${particle.alpha})`;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    const drawRipples = () => {
      ripplesRef.current.forEach(ripple => {
        ctx.strokeStyle = `rgba(16, 185, 129, ${ripple.alpha})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.9)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
    };

    const drawTrail = () => {
      if (trailRef.current.length < 2) return;

      const gradient = ctx.createLinearGradient(
        trailRef.current[0].x,
        trailRef.current[0].y,
        trailRef.current[trailRef.current.length - 1].x,
        trailRef.current[trailRef.current.length - 1].y
      );
      
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.7)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 25;

      ctx.beginPath();
      ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
      
      for (let i = 1; i < trailRef.current.length; i++) {
        const point = trailRef.current[i];
        ctx.lineTo(point.x, point.y);
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      updateParticles();
      updateRipples();
      updateTrail();

      drawParticles();
      drawRipples();
      drawTrail();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={gradientRef}
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15), transparent 70%)',
          zIndex: -1
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: -1 }}
      />
    </>
  );
}
