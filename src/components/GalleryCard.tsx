import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Eye } from 'lucide-react';
import type { GalleryImage } from '../data/images';

interface GalleryCardProps {
  image: GalleryImage;
  onClick: () => void;
}

export default function GalleryCard({ image, onClick }: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Layout aspect ratio mapping to style classes
  const aspectClass = 
    image.aspectRatio === 'portrait' 
      ? 'aspect-[3/4]' 
      : image.aspectRatio === 'square' 
        ? 'aspect-square' 
        : 'aspect-[3/2]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border border-white/5 bg-white/2 cursor-pointer shadow-lg hover:shadow-2xl hover:border-purple-500/20 transition-all duration-500 w-full ${aspectClass}`}
    >
      {/* Skeleton Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#07070a] animate-pulse-slow flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
        </div>
      )}

      {/* Main Image */}
      <img
        src={image.url}
        alt={image.title}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
      />

      {/* Hover Blur Backdrop Overlay */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Hover Overlay Info Panel */}
      <div className="absolute inset-0 flex flex-col justify-between p-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        
        {/* Top bar (Zoom action trigger) */}
        <div className="flex justify-end">
          <div className="p-2 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-white/90 scale-90 group-hover:scale-100 transition-transform duration-300">
            <Eye size={18} />
          </div>
        </div>

        {/* Bottom bar (Image details panel) */}
        <div className="p-4 rounded-lg bg-black/45 border border-white/5 backdrop-blur-lg flex flex-col gap-1.5 shadow-xl">
          <span className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold">
            {image.category}
          </span>
          <h3 className="font-display text-lg text-white font-medium leading-tight">
            {image.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mt-1 pt-1.5 border-t border-white/10">
            <span>By {image.photographer}</span>
            <div className="flex items-center gap-1 text-[10px]">
              <Camera size={10} />
              <span>{image.camera.split(' ')[0]}</span> {/* Show brand e.g. Sony */}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
