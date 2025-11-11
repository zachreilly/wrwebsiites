import { useEffect, useRef } from 'react';
import './FloatingElements.css';

interface FloatingElementsProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
}

export function FloatingElements({ count = 5, size = 'medium' }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const updatePositions = () => {
      const elements = container.querySelectorAll('.floating-shape');
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      elements.forEach((element, index) => {
        const speed = 0.01 + (index * 0.005);
        const x = (mouseX - centerX) * speed;
        const y = (mouseY - centerY) * speed;

        (element as HTMLElement).style.transform = `
          translate(${x}px, ${y}px)
          rotateX(${y * 0.1}deg)
          rotateY(${x * 0.1}deg)
        `;
      });

      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (rafId === null) {
        rafId = requestAnimationFrame(updatePositions);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const shapes = ['sphere', 'cube', 'pyramid', 'torus'];
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'floating-shape-small';
      case 'large':
        return 'floating-shape-large';
      default:
        return 'floating-shape-medium';
    }
  };

  return (
    <div ref={containerRef} className="floating-elements-container">
      {Array.from({ length: count }).map((_, index) => {
        const shape = shapes[index % shapes.length];
        const delay = index * 0.5;
        const duration = 15 + (index * 2);
        
        return (
          <div
            key={index}
            className={`floating-shape ${shape} ${getSizeClass()}`}
            style={{
              left: `${10 + (index * 20)}%`,
              top: `${15 + (index * 15)}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <div className="shape-inner" />
          </div>
        );
      })}
    </div>
  );
}
