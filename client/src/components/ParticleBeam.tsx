import { useEffect, useRef } from 'react';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function ParticleBeam() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const { scrollYProgress } = useScroll();
  const beamProgress = useMotionValue(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      beamProgress.set(latest);
    });
    return unsubscribe;
  }, [scrollYProgress, beamProgress]);

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

    const maxParticles = 200;

    const createParticle = (x: number, y: number, isExplosion = false): Particle => {
      const angle = isExplosion ? Math.random() * Math.PI * 2 : (Math.random() - 0.5) * Math.PI * 0.5;
      const speed = isExplosion ? Math.random() * 3 + 2 : Math.random() * 1 + 0.5;
      const maxLife = Math.random() * 60 + 40;
      
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + (isExplosion ? -2 : 1),
        life: maxLife,
        maxLife: maxLife,
        size: Math.random() * 3 + 1,
        hue: isExplosion ? Math.random() * 60 + 30 : Math.random() * 30 + 140
      };
    };

    const spawnParticles = (x: number, y: number, count: number, isExplosion = false) => {
      for (let i = 0; i < count; i++) {
        if (particlesRef.current.length < maxParticles) {
          particlesRef.current.push(createParticle(x, y, isExplosion));
        }
      }
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
        return p.life > 0;
      });
    };

    const drawBeam = (scrollProgress: number) => {
      const beamY = window.innerHeight * 0.3 + (document.documentElement.scrollHeight - window.innerHeight) * scrollProgress;
      const beamCenterX = canvas.width / 2;
      
      const gradient = ctx.createLinearGradient(beamCenterX - 150, beamY, beamCenterX + 150, beamY);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(beamCenterX - 150, beamY - 50, 300, 100);
      
      const glowGradient = ctx.createRadialGradient(beamCenterX, beamY, 0, beamCenterX, beamY, 200);
      glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      glowGradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.1)');
      glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(beamCenterX - 200, beamY - 200, 400, 400);
      
      return { x: beamCenterX, y: beamY };
    };

    const drawBigBang = () => {
      const bangX = canvas.width / 2;
      const bangY = window.innerHeight * 0.2;
      
      const gradient = ctx.createRadialGradient(bangX, bangY, 0, bangX, bangY, 300);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.2, 'rgba(234, 179, 8, 0.5)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bangX, bangY, 300, 0, Math.PI * 2);
      ctx.fill();
      
      return { x: bangX, y: bangY };
    };

    const drawParticles = () => {
      particlesRef.current.forEach(p => {
        const alpha = p.life / p.maxLife;
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        const glowSize = p.size * 2;
        const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        glowGradient.addColorStop(0, `hsla(${p.hue}, 70%, 60%, ${alpha * 0.5})`);
        glowGradient.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    let lastSpawnTime = 0;
    const spawnInterval = 50;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const scrollProgress = beamProgress.get();
      
      const bigBang = drawBigBang();
      const beam = drawBeam(scrollProgress);
      
      const now = Date.now();
      if (now - lastSpawnTime > spawnInterval) {
        spawnParticles(bigBang.x, bigBang.y, 2, true);
        spawnParticles(beam.x, beam.y, 3, false);
        lastSpawnTime = now;
      }
      
      updateParticles();
      drawParticles();
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [beamProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none z-0"
      style={{ height: '100%' }}
    />
  );
}
