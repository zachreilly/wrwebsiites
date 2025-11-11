import { useEffect, useRef } from 'react';

interface AnimatedGradientMeshProps {
  opacity?: number;
  speed?: number;
}

export function AnimatedGradientMesh({ opacity = 0.15, speed = 0.001 }: AnimatedGradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mesh grid settings - increased mesh size for better performance
    const meshSize = 80;
    const cols = Math.ceil(canvas.width / meshSize) + 1;
    const rows = Math.ceil(canvas.height / meshSize) + 1;

    const animate = () => {
      timeRef.current += speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient mesh
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * meshSize;
          const y = i * meshSize;

          // Calculate wave offset
          const waveX = Math.sin((x + timeRef.current * 100) * 0.01) * 15;
          const waveY = Math.cos((y + timeRef.current * 100) * 0.01) * 15;

          // Calculate color based on position and time
          const hue = 160; // Green hue
          const saturation = 60 + Math.sin(timeRef.current + x * 0.01) * 20;
          const lightness = 50 + Math.cos(timeRef.current + y * 0.01) * 10;

          // Create gradient for each mesh cell
          const gradient = ctx.createRadialGradient(
            x + waveX,
            y + waveY,
            0,
            x + waveX,
            y + waveY,
            meshSize
          );

          gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`);
          gradient.addColorStop(1, `hsla(${hue}, ${saturation - 10}%, ${lightness - 10}%, ${opacity * 0.5})`);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, meshSize, meshSize);
        }
      }

      // Add flowing lines
      ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.3})`;
      ctx.lineWidth = 2;
      
      for (let i = 0; i < rows; i++) {
        ctx.beginPath();
        for (let j = 0; j < cols; j++) {
          const x = j * meshSize;
          const y = i * meshSize + Math.sin((x + timeRef.current * 100) * 0.01) * 15;
          
          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      for (let j = 0; j < cols; j++) {
        ctx.beginPath();
        for (let i = 0; i < rows; i++) {
          const x = j * meshSize + Math.cos((i * meshSize + timeRef.current * 100) * 0.01) * 15;
          const y = i * meshSize;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -2 }}
    />
  );
}
