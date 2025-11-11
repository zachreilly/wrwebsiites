import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FloatingShapes() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl" />
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-white/5 blur-xl" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-white/5 blur-xl" />
        <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-white/5 blur-xl" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-white/5 blur-xl" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute top-1/4 right-20 w-24 h-24 bg-white/5 blur-xl"
        style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-white/5 blur-xl"
        animate={{
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/4 w-28 h-28 bg-white/5 blur-xl"
        style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
        animate={{
          rotate: [0, 360],
          y: [0, 30, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-1/3 w-36 h-36 bg-white/5 blur-xl"
        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
        animate={{
          rotate: [0, -360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
