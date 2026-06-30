import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Info,
  Calendar,
  Compass,
  Download
} from 'lucide-react';
import type { GalleryImage } from '../data/images';

interface LightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({ image, onClose, onNext, onPrev }: LightboxProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const slideDuration = 4000; // 4 seconds per slide

  // Reset image load state on image change
  useEffect(() => {
    setIsImgLoaded(false);
  }, [image]);

  // Handle auto-advancing slides
  const triggerNext = useCallback(() => {
    onNext();
    setProgress(0);
  }, [onNext]);

  // Handle slideshow play/pause logic
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now();
      
      // Update progress bar
      progressIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min((elapsed / slideDuration) * 100, 100);
        setProgress(currentProgress);
      }, 30);

      // Auto trigger next slide
      timerRef.current = window.setTimeout(() => {
        triggerNext();
      }, slideDuration);
    } else {
      setProgress(0);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, image, triggerNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onNext();
        setProgress(0);
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
        setProgress(0);
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onClose]);

  // Toggle Slideshow
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setProgress(0);
  };

  // Download high-resolution image
  const handleDownload = () => {
    // Open in new tab or download
    const link = document.createElement('a');
    link.href = image.url;
    link.target = '_blank';
    link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#020205]/95 backdrop-blur-xl overflow-hidden"
    >
      {/* Slideshow Progress Bar at top */}
      {isPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-50">
          <div
            className="h-full bg-purple-500 transition-all duration-30.70 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Content Pane (Left) */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 select-none">
        
        {/* Navigation - Left Control */}
        <button
          onClick={() => { onPrev(); setProgress(0); }}
          className="absolute left-4 z-20 p-3 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-105 transition-all duration-300 focus:outline-none"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Image Box */}
        <div className="relative max-w-full max-h-[75vh] md:max-h-[85vh] aspect-auto flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative max-w-full max-h-full"
            >
              {!isImgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                </div>
              )}
              <img
                src={image.url}
                alt={image.title}
                onLoad={() => setIsImgLoaded(true)}
                className={`max-w-full max-h-[75vh] md:max-h-[85vh] rounded-lg object-contain shadow-2xl transition-opacity duration-300 ${
                  isImgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation - Right Control */}
        <button
          onClick={() => { onNext(); setProgress(0); }}
          className="absolute right-4 z-20 p-3 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:scale-105 transition-all duration-300 focus:outline-none"
        >
          <ChevronRight size={24} />
        </button>

        {/* Action Toolbar overlay (Top right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          {/* Autoplay Play/Pause */}
          <button
            onClick={togglePlay}
            className={`p-2.5 rounded-full border text-sm transition-all duration-300 focus:outline-none flex items-center justify-center ${
              isPlaying
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 hover:bg-purple-600/30'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white hover:bg-black/60'
            }`}
            title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          {/* Download */}
          <button
            onClick={handleDownload}
            className="p-2.5 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all duration-300 focus:outline-none"
            title="Open High-Res"
          >
            <Download size={18} />
          </button>

          {/* Toggle details sidebar on mobile/tablet */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2.5 rounded-full border transition-all duration-300 focus:outline-none md:flex ${
              showDetails
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                : 'bg-black/40 border-white/10 text-white/70 hover:text-white'
            }`}
            title="Toggle Details"
          >
            <Info size={18} />
          </button>

          {/* Close Lightbox */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/40 border border-white/10 text-white/70 hover:text-white hover:bg-black/60 hover:rotate-90 transition-all duration-300 focus:outline-none"
            title="Close Gallery"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Details Side-Panel (Right) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: window.innerWidth < 768 ? '100%' : 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full md:w-[380px] h-[35vh] md:h-full border-t md:border-t-0 md:border-l border-white/10 bg-[#07070c]/90 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto select-text p-6 md:p-8 z-30"
          >
            {/* Top Area: Details */}
            <div className="flex flex-col gap-6">
              {/* Category & Title */}
              <div>
                <span className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-1 block">
                  {image.category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-white font-medium leading-snug">
                  {image.title}
                </h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {image.description}
              </p>

              {/* Meta information tags */}
              <div className="flex flex-col gap-4 border-t border-b border-white/5 py-5">
                {/* Photographer */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">Artist</span>
                  <span className="text-white font-semibold">{image.photographer}</span>
                </div>
                {/* Date */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    <Calendar size={14} /> Created
                  </span>
                  <span className="text-gray-300">{image.date}</span>
                </div>
              </div>
            </div>

            {/* Bottom Area: EXIF Camera Data */}
            <div className="mt-8 pt-5 border-t border-white/5 flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                <Compass size={14} /> Camera Specifications
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-white/2 rounded-lg p-3 border border-white/5 font-mono text-[11px]">
                <div>
                  <span className="text-gray-500 block mb-0.5">CAMERA</span>
                  <span className="text-gray-300 font-medium block truncate">{image.camera}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-0.5">LENS</span>
                  <span className="text-gray-300 font-medium block truncate">{image.lens}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="text-gray-500 block mb-0.5">EXPOSURE</span>
                  <span className="text-purple-300 font-medium block">{image.settings}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
