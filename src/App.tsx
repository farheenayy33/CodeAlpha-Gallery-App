import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { IMAGES } from './data/images';
import ThreeBackground from './components/ThreeBackground';
import FilterBar from './components/FilterBar';
import GalleryGrid from './components/GalleryGrid';
import Lightbox from './components/Lightbox';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Get list of unique categories
  const categories = useMemo(() => {
    const list = new Set(IMAGES.map((img) => img.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: IMAGES.length };
    IMAGES.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter images based on search query and category
  const filteredImages = useMemo(() => {
    return IMAGES.filter((img) => {
      const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
      const matchesSearch =
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.photographer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Find currently selected image
  const selectedImage = useMemo(() => {
    return IMAGES.find((img) => img.id === selectedImageId) || null;
  }, [selectedImageId]);

  // Navigation handlers inside the Lightbox (bounded to filtered image set)
  const handleNext = () => {
    if (filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImageId);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImageId(filteredImages[nextIndex].id);
  };

  const handlePrev = () => {
    if (filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImageId);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImageId(filteredImages[prevIndex].id);
  };

  return (
    <div className="relative min-h-screen text-gray-100 flex flex-col justify-between">
      {/* 3D WebGL Canvas Layer */}
      <ThreeBackground
        activeCategory={activeCategory}
        isLightboxOpen={!!selectedImageId}
      />

      {/* Main UI wrapper */}
      <div className="flex-1 w-full relative z-10">
        
        {/* Header Block */}
        <header className="pt-20 pb-12 text-center flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs text-purple-300 mb-2 font-mono uppercase tracking-widest"
          >
            <Sparkles size={12} className="animate-pulse-slow" />
            <span>Interactive 3D Portfolio</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl font-light tracking-[0.25em] text-white uppercase ml-[0.25em]"
          >
            Aether
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xs md:text-sm text-gray-400 font-light tracking-[0.15em] uppercase max-w-md mx-auto"
          >
            Curated Minimalist Photography Exhibition
          </motion.p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-16 h-[1px] bg-purple-500/30 my-6"
          />
        </header>

        {/* Filter and Grid Area */}
        <main className="pb-24">
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categoryCounts={categoryCounts}
          />
          
          <GalleryGrid
            images={filteredImages}
            onImageClick={(id) => setSelectedImageId(id)}
          />
        </main>
      </div>

      {/* Footer Area */}
      <footer className="w-full py-8 border-t border-white/5 relative z-10 glass-panel-light text-center">
        <p className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
          © {new Date().getFullYear()} AETHER GALLERY • POWERED BY THREE.JS & REACT
        </p>
      </footer>

      {/* Lightbox Slideshow Modal */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={() => setSelectedImageId(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
