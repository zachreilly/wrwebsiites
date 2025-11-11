import { useRef, useEffect, useState } from 'react';

export default function BeamLight() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [beamProgress, setBeamProgress] = useState(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setBeamProgress(progress);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const beamY = beamProgress * 200; // 0-200% travel

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: '100vh' }}>
      {/* Internal scrollable container */}
      <div 
        ref={scrollRef}
        className="absolute inset-0 overflow-y-scroll overflow-x-hidden"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(16, 185, 129, 0.5) transparent'
        }}
      >
        {/* Spacer to create scroll height */}
        <div style={{ height: '300vh' }} />
      </div>

      {/* Beam of Light Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Vertical beam - moves with scroll */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: `${beamY}%`,
            width: '200px',
            height: '100vh',
            transition: 'top 0.1s ease-out'
          }}
        >
          {/* Core beam */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(16,185,129,0.8), rgba(255,255,255,0.9))',
              boxShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(16,185,129,0.6), 0 0 60px rgba(16,185,129,0.4)'
            }}
          />
          
          {/* Wide glow */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-32 h-full opacity-60"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.4), transparent)'
            }}
          />
          
          {/* Wider outer glow */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-64 h-full opacity-30"
            style={{
              background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.2), transparent)',
              filter: 'blur(20px)'
            }}
          />

          {/* Particles along beam */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{
                top: `${(i * 5) + ((beamProgress * 100) % 5)}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.8)',
                boxShadow: '0 0 10px rgba(16,185,129,0.8)',
                animation: `particle-pulse ${1 + (i % 3) * 0.5}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        {/* Horizontal burst at beam position */}
        <div 
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: `${beamY}%`,
            width: '800px',
            height: '300px',
            marginLeft: '-400px',
            marginTop: '-150px',
            background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.3), rgba(16,185,129,0.1), transparent)',
            filter: 'blur(30px)',
            opacity: 0.6
          }}
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium animate-bounce pointer-events-none z-20">
        Scroll to see the beam
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono pointer-events-none z-20">
        {Math.round(beamProgress * 100)}%
      </div>

      <style>{`
        @keyframes particle-pulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 1; transform: translate(-50%, 0) scale(1.5); }
        }
      `}</style>
    </section>
  );
}
