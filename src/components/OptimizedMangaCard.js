"use client";
import { motion } from "framer-motion";
import { useState, memo } from "react";
import Image from "next/image";

const OptimizedMangaCard = memo(({ manga, index, priority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: index * 0.05,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const imageVariants = {
    loading: { opacity: 0.6 },
    loaded: { opacity: 1 },
    error: { opacity: 0.3 }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg border border-indigo-900/20 hover:border-indigo-500/50 transition-colors duration-300"
    >
      {/* Rank Badge for Top 3 */}
      {index < 3 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
        >
          {index + 1}
        </motion.div>
      )}

      {/* Image Container with Optimized Loading */}
      <div className="aspect-[2/3] overflow-hidden relative">
        {!imageError ? (
          <Image
            src={manga.thumbnail}
            alt={manga.title}
            fill
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'scale-100' : 'scale-110 blur-sm'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content Overlay */}
        <motion.div
          initial={{ y: "100%" }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-3 text-white"
        >
          <h3 className="font-bold text-sm truncate mb-1 group-hover:text-indigo-300 transition-colors">
            {manga.title}
          </h3>
          {manga.description && (
            <p className="text-xs text-gray-300 line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {manga.description.substring(0, 100)}...
            </p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md text-xs font-medium transition-colors"
            onClick={() => window.location.href = `/read/${manga.id}`}
          >
            Read Now
          </motion.button>
        </motion.div>
      </div>

      {/* Loading State */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-xl" />
      )}
    </motion.div>
  );
});

OptimizedMangaCard.displayName = "OptimizedMangaCard";

export default OptimizedMangaCard;
