import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryCounts: Record<string, number>;
}

export default function FilterBar({
  categories,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  categoryCounts
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 w-full max-w-6xl mx-auto px-4">
      {/* Categories Tabs */}
      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start order-2 md:order-1">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Text / Count */}
              <span className={`relative z-10 flex items-center gap-1.5 transition-colors duration-300 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}>
                {category}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-purple-600/30 text-purple-200' : 'bg-white/5 text-gray-500'
                }`}>
                  {categoryCounts[category] || 0}
                </span>
              </span>

              {/* Active Background Capsule */}
              {isActive && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 bg-white/5 border border-white/10 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="relative w-full md:w-80 order-1 md:order-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, photographer..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300 glass-panel"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white transition-colors duration-300"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
