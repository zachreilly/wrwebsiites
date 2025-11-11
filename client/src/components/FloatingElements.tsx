import { useEffect, useRef, useState } from 'react';
import './FloatingElements.css';

interface FloatingElementsProps {
  count?: number;
  size?: 'small' | 'medium' | 'large';
}

// Shared mouse position for all FloatingElements instances
let sharedMouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
let sharedMouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
let mouseListenerAttached = false;
let sharedRafId: number | null = null;
const containers = new Set<HTMLDivElement>();

function updateAllContainers() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  containers.forEach(container => {
    const elements = container.querySelectorAll('.floating-shape');
    
    elements.forEach((element, index) => {
      const speed = 0.01 + (index * 0.005);
      const x = (sharedMouseX - centerX) * speed;
      const y = (sharedMouseY - centerY) * speed;

      (element as HTMLElement).style.transform = `
        translate(${x}px, ${y}px)
        rotateX(${y * 0.1}deg)
        rotateY(${x * 0.1}deg)
      `;
    });
  });

  sharedRafId = null;
}

function handleSharedMouseMove(e: MouseEvent) {
  sharedMouseX = e.clientX;
  sharedMouseY = e.clientY;

  if (sharedRafId === null) {
    sharedRafId = requestAnimationFrame(updateAllContainers);
  }
}

export function FloatingElements({ count = 5, size = 'medium' }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const container = containerRef.current;
    if (!container) return;

    // Visibility observer to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(container);

    if (isVisible) {
      containers.add(container);
    }

    // Attach shared mouse listener only once
    if (!mouseListenerAttached) {
      window.addEventListener('mousemove', handleSharedMouseMove, { passive: true });
      mouseListenerAttached = true;
    }
    
    return () => {
      observer.disconnect();
      containers.delete(container);
      
      // Remove shared listener if no containers left
      if (containers.size === 0 && mouseListenerAttached) {
        window.removeEventListener('mousemove', handleSharedMouseMove);
        mouseListenerAttached = false;
        if (sharedRafId !== null) {
          cancelAnimationFrame(sharedRafId);
          sharedRafId = null;
        }
      }
    };
  }, [isVisible, prefersReducedMotion]);

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
