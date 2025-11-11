import { useState } from 'react';
import './FloatingElements.css';

interface FloatingElementsProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
}

export function FloatingElements({ count = 5, size = 'medium' }: FloatingElementsProps) {
  const [prefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  if (prefersReducedMotion) {
    return null;
  }

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
