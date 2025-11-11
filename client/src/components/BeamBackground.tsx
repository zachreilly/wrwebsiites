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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const getBeamPath = () => {
      const centerX = canvas.width / 2;
      const numPoints = 500;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const y = t * canvas.height;
        
        const waveAmplitude = 150;
        const waveFrequency = 3;
        const x = centerX + Math.sin(t * Math.PI * waveFrequency) * waveAmplitude;
        
        points.push({ x, y });
      }

      return points;
    };

    const drawSmoothBeam = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return;

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 60;
      ctx.filter = 'blur(30px)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 20;
      ctx.filter = 'blur(10px)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.filter = 'none';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const emitParticle = (points: { x: number; y: number }[]) => {
      const randomIndex = Math.floor(Math.random() * points.length);
      const point = points[randomIndex];
      
      particlesRef.current.push({
        x: point.x + (Math.random() - 0.5) * 10,
        y: point.y,
        size: 2 + Math.random() * 3,
        alpha: 0.8 + Math.random() * 0.2,
        speedY: 0.5 + Math.random() * 1,
        life: 1.0
      });

      if (particlesRef.current.length > 150) {
        particlesRef.current.shift();
      }
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(p => {
        p.y += p.speedY;
        p.life -= 0.01;
        p.alpha = p.life * 0.9;
        return p.life > 0;
      });
    };

    const drawParticles = () => {
      particlesRef.current.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.filter = 'none';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
    };

    let lastEmitTime = 0;
    const emitInterval = 50;

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = getBeamPath();
      drawSmoothBeam(points);

      if (timestamp - lastEmitTime > emitInterval) {
        for (let i = 0; i < 3; i++) {
          emitParticle(points);
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
