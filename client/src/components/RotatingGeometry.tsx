import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function RotatingGeometry() {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none hidden lg:block">
        <div className="relative w-full h-full preserve-3d" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 preserve-3d">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-white/20 bg-white/5 backdrop-blur-sm"
                style={{ transform: `rotateY(${i * 60}deg) translateZ(100px)` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none hidden lg:block">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="absolute inset-0 preserve-3d">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 border-white/20 bg-white/5 backdrop-blur-sm"
              style={{
                transform: `
                  rotateY(${i * 60}deg) 
                  translateZ(100px)
                `,
              }}
            />
          ))}
        </div>
        
        <div className="absolute inset-0 preserve-3d">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-accent/80 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `
                  rotateY(${i * 90}deg) 
                  translateZ(120px)
                `,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
