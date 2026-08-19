import React from 'react';
import { Camera, Maximize2 } from 'lucide-react';

/**
 * Vertical scrollable image sidebar — shows up to 20 ad-related images
 * stacked vertically, sticky to the page, extending to the bottom.
 */
export default function ImageSidebar({ images = [], onImageClick }) {
  const photos = images.slice(0, 20);
  const remaining = images.length - photos.length;

  if (photos.length === 0) {
    return (
      <div className="hidden lg:flex flex-col gap-2 sticky top-20">
        <div className="aspect-[4/3] rounded-xl bg-secondary border border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No photos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex flex-col gap-2 sticky top-20 self-start max-h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 rounded-xl">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => onImageClick?.(i)}
            className="relative group flex-shrink-0 rounded-xl overflow-hidden border border-border hover:border-primary transition-all"
          >
            <div className="aspect-[4/3]">
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Overlay on last image if there are more */}
            {i === photos.length - 1 && remaining > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+{remaining}</span>
              </div>
            )}
            {/* Hover zoom icon */}
            <div className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
            {/* Photo index badge */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
              <Camera className="w-2.5 h-2.5" /> {i + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}