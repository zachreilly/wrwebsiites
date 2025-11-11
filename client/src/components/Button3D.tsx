import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Button3DProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button3D({ children, onClick, className = '', type = 'button' }: Button3DProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <button onClick={onClick} className={className} type={type}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={className}
      type={type}
      whileHover={{ 
        scale: 1.05, 
        rotateX: 5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {children}
    </motion.button>
  );
}
