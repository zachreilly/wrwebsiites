import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speedY: number;
  life: number;
}

export default function BeamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const cachedPathRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      
      const centerX = canvas.width / 2;
      const numPoints = 200;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const y = t * canvas.height;
        
        const waveAmplitude = 150;
        const waveFrequency = 3;
        const x = centerX + Math.sin(t * Math.PI * waveFrequency) * waveAmplitude;
        
        points.push({ x, y });
      }
      
      cachedPathRef.current = points;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawSmoothBeam = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return;

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 50;
      ctx.filter = 'blur(20px)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 15;
      ctx.filter = 'blur(5px)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.filter = 'none';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const emitParticle = (points: { x: number; y: number }[]) => {
      const randomIndex = Math.floor(Math.random() * points.length);
      const point = points[randomIndex];
      
      particlesRef.current.push({
        x: point.x + (Math.random() - 0.5) * 8,
        y: point.y,
        size: 1.5 + Math.random() * 2,
        alpha: 0.7 + Math.random() * 0.3,
        speedY: 0.3 + Math.random() * 0.7,
        life: 1.0
      });

      if (particlesRef.current.length > 100) {
        particlesRef.current.shift();
      }
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(p => {
        p.y += p.speedY;
        p.life -= 0.008;
        p.alpha = p.life * 0.8;
        return p.life > 0;
      });
    };

    const drawParticles = () => {
      ctx.filter = 'none';
      particlesRef.current.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    let lastEmitTime = 0;
    const emitInterval = 80;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSmoothBeam(cachedPathRef.current);

      if (timestamp - lastEmitTime > emitInterval) {
        for (let i = 0; i < 2; i++) {
          emitParticle(cachedPathRef.current);
        }
        lastEmitTime = timestamp;
      }

      updateParticles();
      drawParticles();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
