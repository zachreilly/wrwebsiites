import { useRef, useState, useEffect } from 'react';

interface ScrollSequenceProps {
  frames: string[];
  frameHeight?: number;
  className?: string;
}

export default function ScrollSequence({ 
  frames, 
  frameHeight = 1080,
  className = '' 
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageRefs = useRef<HTMLImageElement[]>([]);

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = frames.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        const loadedImages = await Promise.all(promises);
        imageRefs.current = loadedImages;
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
      }
    };

    if (frames.length > 0) {
      preloadImages();
    }
  }, [frames]);

  // Handle scroll to update frame
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !imagesLoaded) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const scrollProgress = scrollTop / scrollHeight;
      
      // Map scroll progress to frame index
      const frameIndex = Math.min(
        Math.floor(scrollProgress * frames.length),
        frames.length - 1
      );
      
      setCurrentFrame(Math.max(0, frameIndex));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [frames.length, imagesLoaded]);

  if (!imagesLoaded || frames.length === 0) {
    return (
      <div className={`relative w-full h-screen flex items-center justify-center ${className}`}>
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen overflow-y-scroll overflow-x-hidden ${className}`}
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}
    >
      {/* Hide scrollbar */}
      <style>{`
        .scroll-sequence-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Image overlay - fixed position, always visible */}
      <div className="sticky top-0 left-0 w-full h-screen pointer-events-none z-10">
        <img
          src={frames[currentFrame]}
          alt={`Frame ${currentFrame + 1}`}
          className="w-full h-full object-cover"
          style={{
            imageRendering: 'auto'
          }}
        />
      </div>

      {/* Scrollable area - creates scroll space */}
      <div 
        style={{ 
          height: `${frameHeight * frames.length}px`,
          marginTop: '-100vh' // Offset to overlay the image
        }}
      />
    </div>
  );
}
