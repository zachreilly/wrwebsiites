import ScrollSequence from './ScrollSequence';

interface BeamSequenceProps {
  frames?: string[];
  frameHeight?: number;
}

export default function BeamSequence({ 
  frames,
  frameHeight = 1080 
}: BeamSequenceProps) {
  // Generate placeholder frame paths if not provided
  // User can replace with actual frame sequences
  const defaultFrames = frames || Array.from({ length: 65 }, (_, i) => 
    `/frames/beam-${String(i).padStart(4, '0')}.jpg`
  );

  return (
    <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
      <ScrollSequence 
        frames={defaultFrames} 
        frameHeight={frameHeight}
        className="scroll-sequence-container"
      />
    </div>
  );
}
