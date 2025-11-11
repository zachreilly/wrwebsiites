# Beam Sequence Guide

## Overview
The BeamSection component creates a scroll-driven image sequence animation with internal scrolling. As users scroll within the section, it cycles through frames to create a smooth animated effect.

## How to Use

### 1. Prepare Your Frame Sequence
- Export your animation as 65 JPG images
- Name them sequentially: `beam-0001.jpg`, `beam-0002.jpg`, ..., `beam-0065.jpg`
- Place them in `public/frames/` directory

### 2. Update BeamSection Component

In `client/src/pages/home.tsx`, pass your frame array:

```tsx
<BeamSection 
  frames={Array.from({ length: 65 }, (_, i) => 
    `/frames/beam-${String(i + 1).padStart(4, '0')}.jpg`
  )}
  frameHeight={100}
/>
```

### 3. Adjust Frame Height

The `frameHeight` prop controls how much scroll distance per frame:
- `frameHeight={100}` = 100vh per frame (slower, more dramatic)
- `frameHeight={50}` = 50vh per frame (faster scrolling)
- `frameHeight={150}` = 150vh per frame (very slow, cinematic)

## Component Props

### BeamSection Props
```tsx
interface BeamSectionProps {
  frames?: string[];      // Array of image paths (default: placeholder)
  frameHeight?: number;   // Viewport heights per frame (default: 100)
}
```

## Features

- ✅ Supports up to 65 frames
- ✅ Preloads all images before showing sequence
- ✅ Internal scrolling (not window scroll)
- ✅ Image fills component and overlays scrollable area
- ✅ Smooth frame transitions mapped to scroll position
- ✅ Performance optimized with passive scroll listeners
- ✅ Loading state while images preload
- ✅ Frame counter for debugging (bottom right)

## Example: Full 65-Frame Sequence

```tsx
import BeamSection from "@/components/sections/beam-section";

// Generate paths for 65 JPG frames
const beamFrames = Array.from({ length: 65 }, (_, i) => 
  `/frames/beam-${String(i + 1).padStart(4, '0')}.jpg`
);

<BeamSection 
  frames={beamFrames}
  frameHeight={80}
/>
```

## Tips

1. **Optimize JPG file size** - Compress images to 80-90% quality for faster loading
2. **Test frameHeight** - Adjust to find the right scroll speed for your content
3. **Image dimensions** - Use consistent dimensions across all frames (e.g., 1920x1080)
4. **Preload time** - 65 images may take a few seconds to load initially
5. **Mobile** - Consider reducing frame count for mobile (30-40 frames)

## Current Setup

Currently using a placeholder image from attached assets. Replace with your 65-frame sequence when ready!
