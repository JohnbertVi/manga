'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * AccessibleMangaCard Component
 * 
 * A fully accessible manga card with:
 * - Proper ARIA labels and roles
 * - Keyboard navigation support
 * - Screen reader optimization
 * - High contrast support
 * - Focus management
 */
const AccessibleMangaCard = ({ 
  manga, 
  index, 
  onCardClick,
  priority = false,
  size = 'medium' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef(null);

  // Size variants
  const sizeConfig = {
    small: {
      width: 'w-36',
      height: 'h-48',
      textSize: 'text-xs',
      padding: 'p-3'
    },
    medium: {
      width: 'w-48',
      height: 'h-64',
      textSize: 'text-sm',
      padding: 'p-4'
    },
    large: {
      width: 'w-56',
      height: 'h-72',
      textSize: 'text-base',
      padding: 'p-5'
    }
  };

  const config = sizeConfig[size];

  // Animation variants
  const cardVariants = {
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
        duration: 0.3,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    focus: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Keyboard event handler
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onCardClick) {
        onCardClick(manga);
      }
    }
  };

  // Generate accessible description
  const getAccessibleDescription = () => {
    const parts = [];
    if (manga.title) parts.push(`Title: ${manga.title}`);
    if (manga.genre) parts.push(`Genre: ${manga.genre}`);
    if (manga.rating) parts.push(`Rating: ${manga.rating} out of 5 stars`);
    if (manga.status) parts.push(`Status: ${manga.status}`);
    if (manga.chapters) parts.push(`${manga.chapters} chapters available`);
    
    return parts.join('. ');
  };

  // Focus management
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    card.addEventListener('focus', handleFocus);
    card.addEventListener('blur', handleBlur);

    return () => {
      card.removeEventListener('focus', handleFocus);
      card.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <motion.article
      ref={cardRef}
      className={`
        ${config.width} ${config.height}
        relative group cursor-pointer
        bg-gray-900/80 backdrop-blur-sm
        border border-gray-800 rounded-xl
        overflow-hidden
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        focus:ring-offset-gray-900
        hover:border-blue-500/50
        ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}
      `}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileFocus="focus"
      onClick={() => onCardClick && onCardClick(manga)}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Read ${manga.title || 'manga'}`}
      aria-describedby={`manga-${index}-description`}
    >
      {/* Cover Image */}
      <div className="relative w-full h-3/4 overflow-hidden">
        <AnimatePresence>
          {!isLoaded && !isError && (
            <motion.div
              className="absolute inset-0 bg-gray-800 animate-pulse"
              variants={overlayVariants}
              initial="visible"
              exit="hidden"
            >
              <div className="flex items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isError && (
          <Image
            src={manga.coverImage || '/placeholder-manga.jpg'}
            alt={manga.title ? `Cover of ${manga.title}` : 'Manga cover'}
            fill
            className={`
              object-cover transition-all duration-300
              group-hover:scale-110
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            priority={priority}
            sizes={`(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw`}
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setIsError(true);
              setIsLoaded(true);
            }}
          />
        )}

        {isError && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">Image not available</p>
            </div>
          </div>
        )}

        {/* Rating Badge */}
        {manga.rating && (
          <motion.div
            className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/90 backdrop-blur-sm rounded-md"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-white">
                {manga.rating}
              </span>
            </div>
          </motion.div>
        )}

        {/* Status Badge */}
        {manga.status && (
          <motion.div
            className={`
              absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium
              ${manga.status === 'ongoing' ? 'bg-green-500/90 text-white' : ''}
              ${manga.status === 'completed' ? 'bg-blue-500/90 text-white' : ''}
              ${manga.status === 'hiatus' ? 'bg-yellow-500/90 text-gray-900' : ''}
            `}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {manga.status.charAt(0).toUpperCase() + manga.status.slice(1)}
          </motion.div>
        )}

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={overlayVariants}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Start reading ${manga.title || 'this manga'}`}
            >
              Read Now
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Card Content */}
      <div className={`${config.padding} h-1/4 flex flex-col justify-between`}>
        <div>
          <h3 className={`
            ${config.textSize} font-semibold text-white
            line-clamp-2 group-hover:text-blue-400 transition-colors
          `}>
            {manga.title || 'Untitled Manga'}
          </h3>
          
          {manga.genre && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {manga.genre}
            </p>
          )}
        </div>

        {manga.chapters && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {manga.chapters} chapters
            </span>
            <motion.svg
              className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </motion.svg>
          </div>
        )}
      </div>

      {/* Screen Reader Description */}
      <div 
        id={`manga-${index}-description`}
        className="sr-only"
      >
        {getAccessibleDescription()}
      </div>

      {/* Focus Ring Enhancement */}
      <div 
        className={`
          absolute inset-0 pointer-events-none rounded-xl
          transition-all duration-200
          ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}
        `}
      />
    </motion.article>
  );
};

export default AccessibleMangaCard;
