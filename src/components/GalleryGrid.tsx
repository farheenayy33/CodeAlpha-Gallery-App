import { motion, AnimatePresence } from 'framer-motion';
import { CameraOff } from 'lucide-react';
import type { GalleryImage } from '../data/images';
import GalleryCard from './GalleryCard';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (id: string) => void;
}

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  return (
    <div className="w-full max-w-6xl mx-auto min-h-[400px]">
      <AnimatePresence mode="popLayout">
        {images.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-gray-500"
          >
            <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 animate-float">
              <CameraOff size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">No images found</h3>
            <p className="text-sm text-gray-400">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full px-4"
          >
            {images.map((image) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-6"
              >
                <GalleryCard
                  image={image}
                  onClick={() => onImageClick(image.id)}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
