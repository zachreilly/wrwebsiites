import { useEffect, useRef, useState } from 'react';

interface AnimatedGradientMeshProps {
  opacity?: number;
  speed?: number;
}

export function AnimatedGradientMesh({ opacity = 0.15, speed = 0.001 }: AnimatedGradientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const gridDimensionsRef = useRef({ cols: 0, rows: 0, meshSize: 240 });
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const updateGridDimensions = () => {
      const meshSize = gridDimensionsRef.current.meshSize;
      gridDimensionsRef.current.cols = Math.ceil(canvas.width / meshSize) + 1;
      gridDimensionsRef.current.rows = Math.ceil(canvas.height / meshSize) + 1;
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateGridDimensions();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!isVisible) {
        // Stop animation when not visible
        animationFrameRef.current = undefined;
        return;
      }

      timeRef.current += speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { cols, rows, meshSize } = gridDimensionsRef.current;

      // Simplified gradient mesh - fewer cells, simpler gradients
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * meshSize;
          const y = i * meshSize;

          // Simplified wave calculation
          const wave = Math.sin((x + y + timeRef.current * 100) * 0.005) * 10;

          // Static gradient - no per-frame recalculation
          const gradient = ctx.createRadialGradient(
            x + wave,
            y + wave,
            0,
            x + wave,
            y + wave,
            meshSize * 0.8
          );

          gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity * 0.8})`);
          gradient.addColorStop(1, `rgba(5, 150, 105, ${opacity * 0.3})`);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, meshSize, meshSize);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Visibility observer to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        // Restart animation when becoming visible
        if (visible && !animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    // Start animation initially
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [opacity, speed, isVisible, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: -2 }}
    />
  );
}
