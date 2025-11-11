import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsAnimating(true);
    }
  }, [location, displayLocation]);

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        setDisplayLocation(location);
        setIsAnimating(false);
      }}
    >
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
