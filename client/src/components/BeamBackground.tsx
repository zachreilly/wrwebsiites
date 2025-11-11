import { useEffect, useRef, useState } from 'react';
import bigBangImage from '@assets/stock_images/cosmic_big_bang_expl_9cc1eaf6.jpg';

export default function BeamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    const drawBeam = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const numPoints = 100;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const y = t * canvas.height;
        
        const waveAmplitude = 150;
        const waveFrequency = 3;
        const x = centerX + Math.sin(t * Math.PI * waveFrequency) * waveAmplitude;
        
        points.push({ x, y });
      }

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.lineWidth = 60;
      ctx.filter = 'blur(30px)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 20;
      ctx.filter = 'blur(10px)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.filter = 'none';
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const pointIndex = Math.floor((i / particleCount) * points.length);
        const point = points[pointIndex];
        
        const offset = ((scrollProgress * 100) + (i * 5)) % 100;
        const actualIndex = Math.floor((offset / 100) * points.length);
        const actualPoint = points[actualIndex] || point;
        
        const size = 2 + Math.random() * 2;
        const alpha = 0.5 + Math.random() * 0.5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.filter = 'none';
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(actualPoint.x, actualPoint.y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    drawBeam();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [scrollProgress]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 pointer-events-none z-0"
        style={{ width: '100%', height: '100%' }}
      />
      
      <div 
        className="fixed bottom-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: '400px',
          height: '400px',
          opacity: 0.4 + (scrollProgress * 0.4),
          transition: 'opacity 0.3s ease-out'
        }}
      >
        <img 
          src={bigBangImage} 
          alt="Energy source" 
          className="w-full h-full object-contain"
          style={{
            filter: 'brightness(1.2) contrast(1.1)',
            transform: `scale(${0.8 + scrollProgress * 0.4})`
          }}
        />
      </div>
    </>
  );
}
