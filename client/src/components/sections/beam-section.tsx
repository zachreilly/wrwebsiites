import { useRef, useState, useEffect } from 'react';
import beamPlaceholder from '@assets/beam of light _1762840808853.png';

interface BeamSectionProps {
  frames?: string[];
  frameHeight?: number;
}

export default function BeamSection({ 
  frames,
  frameHeight = 100
}: BeamSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Generate placeholder frame paths if not provided
  // User will replace with actual 65-frame sequence
  const frameArray = frames || [beamPlaceholder]; // Placeholder until frames provided

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const promises = frameArray.map((src) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Failed to preload beam frames:', error);
        // Set loaded anyway to show placeholder
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [frameArray]);

  // Handle internal scroll to update frame
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !imagesLoaded) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      // Map scroll progress to frame index (0 to frames.length - 1)
      const frameIndex = Math.min(
        Math.floor(scrollProgress * frameArray.length),
        frameArray.length - 1
      );
      
      setCurrentFrame(Math.max(0, frameIndex));
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [frameArray.length, imagesLoaded]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full"
      style={{ height: '100vh' }}
    >
      {/* Internal scrollable container */}
      <div 
        ref={scrollRef}
        className="absolute inset-0 overflow-y-scroll overflow-x-hidden"
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(16, 185, 129, 0.5) transparent'
        }}
      >
        {/* Spacer to create scroll height - frameHeight per frame */}
        <div style={{ height: `${frameHeight * frameArray.length}vh` }} />
      </div>

      {/* Image overlay - sticky positioned */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 w-full h-full">
          {imagesLoaded && (
            <img
              src={frameArray[currentFrame]}
              alt={`Beam frame ${currentFrame + 1}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}
          {!imagesLoaded && (
            <div className="w-full h-full flex items-center justify-center bg-black/20">
              <div className="text-white text-lg">Loading beam sequence...</div>
            </div>
          )}
        </div>
      </div>

      {/* Frame counter for debugging */}
      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-mono pointer-events-none z-20">
        Frame: {currentFrame + 1} / {frameArray.length}
      </div>
    </section>
  );
}
