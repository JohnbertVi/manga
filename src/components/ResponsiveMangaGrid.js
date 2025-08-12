'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * ResponsiveMangaGrid Component
 * 
 * A fully responsive grid system with:
 * - Mobile-first approach
 * - Dynamic breakpoints
 * - Touch-friendly interactions
 * - Optimized loading strategies
 * - Infinite scroll support
 */
const ResponsiveMangaGrid = ({ 
  manga = [], 
  title = "Featured Manga",
  onMangaClick,
  loading = false,
  hasMore = false,
  onLoadMore
}) => {
  const [currentView, setCurrentView] = useState('grid'); // 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(loading);
  const [visibleManga, setVisibleManga] = useState(12);

  // Responsive breakpoints
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  };

  // Grid configuration for different screen sizes
  const gridConfig = {
    mobile: 'grid-cols-2 gap-3',
    tablet: 'sm:grid-cols-3 sm:gap-4',
    desktop: 'lg:grid-cols-4 lg:gap-6',
    wide: 'xl:grid-cols-5 2xl:grid-cols-6'
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Load more handler
  const handleLoadMore = () => {
    if (onLoadMore && !isLoading) {
      setIsLoading(true);
      onLoadMore();
    }
  };

  // Effect to handle loading state
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Responsive manga card component
  const ResponsiveMangaCard = ({ manga, index, view = 'grid' }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const cardClasses = view === 'grid' 
      ? `
          group relative cursor-pointer
          bg-gray-900/80 backdrop-blur-sm
          border border-gray-800 rounded-lg
          overflow-hidden
          transition-all duration-300
          hover:border-blue-500/50 hover:transform hover:scale-[1.02]
          focus:outline-none focus:ring-2 focus:ring-blue-500
          aspect-[3/4]
        `
      : `
          group flex cursor-pointer
          bg-gray-900/80 backdrop-blur-sm
          border border-gray-800 rounded-lg
          overflow-hidden p-4 gap-4
          transition-all duration-300
          hover:border-blue-500/50
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `;

    return (
      <motion.article
        className={cardClasses}
        variants={itemVariants}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onMangaClick && onMangaClick(manga)}
        tabIndex={0}
        role="button"
        aria-label={`Read ${manga.title || 'manga'}`}
      >
        {view === 'grid' ? (
          // Grid View
          <>
            <div className="relative w-full h-3/4">
              <AnimatePresence>
                {!imageLoaded && !imageError && (
                  <motion.div
                    className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              {!imageError && (
                <Image
                  src={manga.coverImage || '/placeholder-manga.jpg'}
                  alt={`Cover of ${manga.title || 'manga'}`}
                  fill
                  className={`
                    object-cover transition-all duration-300
                    group-hover:scale-105
                    ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                  `}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              )}

              {imageError && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              {/* Rating Badge */}
              {manga.rating && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded text-xs font-medium text-white">
                  ★ {manga.rating}
                </div>
              )}

              {/* Mobile Touch Indicator */}
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 lg:opacity-100 transition-opacity">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            <div className="p-3 h-1/4 flex flex-col justify-between">
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                {manga.title || 'Untitled'}
              </h3>
              {manga.genre && (
                <p className="text-xs text-gray-400 truncate mt-1">
                  {manga.genre}
                </p>
              )}
            </div>
          </>
        ) : (
          // List View
          <>
            <div className="relative w-20 h-28 flex-shrink-0">
              <Image
                src={manga.coverImage || '/placeholder-manga.jpg'}
                alt={`Cover of ${manga.title || 'manga'}`}
                fill
                className="object-cover rounded"
                sizes="80px"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {manga.title || 'Untitled'}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {manga.genre || 'Unknown Genre'}
              </p>
              <div className="flex items-center gap-4 mt-2">
                {manga.rating && (
                  <span className="text-sm text-yellow-500">
                    ★ {manga.rating}
                  </span>
                )}
                {manga.chapters && (
                  <span className="text-sm text-gray-500">
                    {manga.chapters} chapters
                  </span>
                )}
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </>
        )}
      </motion.article>
    );
  };

  return (
    <section className="w-full" aria-label={title}>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-0">
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        
        {/* View Toggle - Hidden on mobile for better UX */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-900/50 rounded-lg p-1 border border-gray-800">
          <button
            className={`p-2 rounded ${currentView === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
            onClick={() => setCurrentView('grid')}
            aria-label="Grid view"
            aria-pressed={currentView === 'grid'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>
            </svg>
          </button>
          <button
            className={`p-2 rounded ${currentView === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
            onClick={() => setCurrentView('list')}
            aria-label="List view"
            aria-pressed={currentView === 'list'}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 4h18v2H3zM3 11h18v2H3zM3 18h18v2H3z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Grid/List Container */}
      <motion.div
        className={
          currentView === 'grid'
            ? `grid ${gridConfig.mobile} ${gridConfig.tablet} ${gridConfig.desktop} ${gridConfig.wide} px-4 sm:px-0`
            : 'flex flex-col gap-3 px-4 sm:px-0'
        }
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {manga.slice(0, visibleManga).map((mangaItem, index) => (
            <ResponsiveMangaCard
              key={mangaItem.id || index}
              manga={mangaItem}
              index={index}
              view={currentView}
            />
          ))}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {isLoading && (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                className={
                  currentView === 'grid'
                    ? 'aspect-[3/4] bg-gray-800 rounded-lg animate-pulse'
                    : 'h-24 bg-gray-800 rounded-lg animate-pulse'
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Load More Button - Mobile Optimized */}
      {hasMore && !isLoading && (
        <motion.div 
          className="flex justify-center mt-8 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={handleLoadMore}
            className="
              px-8 py-3 bg-blue-600 hover:bg-blue-700 
              text-white font-medium rounded-lg
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
              min-h-[48px] min-w-[120px]
              active:scale-95
            "
            aria-label="Load more manga"
          >
            Load More
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {manga.length === 0 && !isLoading && (
        <motion.div
          className="flex flex-col items-center justify-center py-16 px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="w-24 h-24 text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No manga found
          </h3>
          <p className="text-gray-500 max-w-md">
            We couldn't find any manga matching your criteria. Try adjusting your filters or check back later for new additions.
          </p>
        </motion.div>
      )}
    </section>
  );
};

export default ResponsiveMangaGrid;
