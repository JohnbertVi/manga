'use client';

import { Suspense, lazy, memo, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import { motion } from 'framer-motion';

/**
 * Optimized Page Component with:
 * - Code splitting with dynamic imports
 * - Lazy loading components
 * - Memoization for expensive operations
 * - Error boundaries for resilient UX
 * - Progressive loading strategies
 */

// Dynamic imports with loading components
const EnhancedHeroSection = dynamic(
  () => import('../components/EnhancedHeroSection'),
  {
    loading: () => <HeroSkeleton />,
    ssr: true
  }
);

const ResponsiveMangaGrid = dynamic(
  () => import('../components/ResponsiveMangaGrid'),
  {
    loading: () => <GridSkeleton />,
    ssr: false
  }
);

const AccessibleMangaCard = dynamic(
  () => import('../components/AccessibleMangaCard'),
  {
    loading: () => <CardSkeleton />,
    ssr: false
  }
);

// Lazy loaded components for below-fold content
const StatsSection = lazy(() => import('../components/StatsSection'));
const TestimonialsSection = lazy(() => import('../components/TestimonialsSection'));
const NewsletterSection = lazy(() => import('../components/NewsletterSection'));

// Loading skeleton components
const HeroSkeleton = memo(() => (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
    <div className="animate-pulse">
      <div className="h-16 bg-gray-700 rounded-lg w-96 mb-6"></div>
      <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
      <div className="h-8 bg-gray-800 rounded w-48 mb-8"></div>
      <div className="flex gap-4">
        <div className="h-12 bg-blue-600 rounded-lg w-32"></div>
        <div className="h-12 bg-gray-700 rounded-lg w-32"></div>
      </div>
    </div>
  </div>
));

const GridSkeleton = memo(() => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 px-4 sm:px-0">
    {Array.from({ length: 12 }, (_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
));

const CardSkeleton = memo(() => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-3"></div>
    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
  </div>
));

// Error fallback components
const ErrorFallback = memo(({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
    <div className="text-center max-w-md">
      <div className="mb-6">
        <svg
          className="w-24 h-24 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-400 mb-6">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
      </div>
      
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Try Again
      </button>
      
      <details className="mt-6 text-left">
        <summary className="text-gray-500 cursor-pointer hover:text-gray-400">
          Technical Details
        </summary>
        <pre className="mt-3 p-4 bg-gray-800 rounded text-red-400 text-xs overflow-auto">
          {error.message}
        </pre>
      </details>
    </div>
  </div>
));

// Sample data with memoization
const useMangaData = () => {
  return useMemo(() => ({
    trending: [
      {
        id: 1,
        title: "Attack on Titan",
        genre: "Action, Drama",
        coverImage: "/covers/aot.jpg",
        rating: 4.9,
        status: "completed",
        chapters: 139,
        trending: true
      },
      {
        id: 2,
        title: "One Piece",
        genre: "Adventure, Comedy",
        coverImage: "/covers/onepiece.jpg",
        rating: 4.8,
        status: "ongoing",
        chapters: 1095,
        trending: true
      },
      {
        id: 3,
        title: "My Hero Academia",
        genre: "Action, School",
        coverImage: "/covers/mha.jpg",
        rating: 4.7,
        status: "ongoing",
        chapters: 403,
        trending: true
      },
      {
        id: 4,
        title: "Demon Slayer",
        genre: "Action, Supernatural",
        coverImage: "/covers/demonslayer.jpg",
        rating: 4.8,
        status: "completed",
        chapters: 208,
        trending: true
      },
      {
        id: 5,
        title: "Jujutsu Kaisen",
        genre: "Action, Supernatural",
        coverImage: "/covers/jjk.jpg",
        rating: 4.7,
        status: "ongoing",
        chapters: 245,
        trending: true
      },
      {
        id: 6,
        title: "Naruto",
        genre: "Action, Adventure",
        coverImage: "/covers/naruto.jpg",
        rating: 4.6,
        status: "completed",
        chapters: 700,
        trending: true
      }
    ],
    popular: [
      {
        id: 7,
        title: "Dragon Ball",
        genre: "Action, Adventure",
        coverImage: "/covers/dragonball.jpg",
        rating: 4.5,
        status: "completed",
        chapters: 519
      },
      {
        id: 8,
        title: "Tokyo Ghoul",
        genre: "Horror, Supernatural",
        coverImage: "/covers/tokyoghoul.jpg",
        rating: 4.4,
        status: "completed",
        chapters: 179
      },
      {
        id: 9,
        title: "Fullmetal Alchemist",
        genre: "Adventure, Dark Fantasy",
        coverImage: "/covers/fma.jpg",
        rating: 4.9,
        status: "completed",
        chapters: 116
      }
    ],
    newReleases: [
      {
        id: 10,
        title: "Chainsaw Man",
        genre: "Action, Horror",
        coverImage: "/covers/chainsawman.jpg",
        rating: 4.6,
        status: "ongoing",
        chapters: 150
      },
      {
        id: 11,
        title: "Spy x Family",
        genre: "Comedy, Action",
        coverImage: "/covers/spyxfamily.jpg",
        rating: 4.8,
        status: "ongoing",
        chapters: 95
      }
    ]
  }), []);
};

// Main optimized page component
const OptimizedLandingPage = memo(() => {
  const mangaData = useMangaData();

  // Memoized event handlers
  const handleMangaClick = useCallback((manga) => {
    // Navigate to manga details or reader
    console.log('Opening manga:', manga.title);
    // In real app: router.push(`/read/${manga.id}`)
  }, []);

  const handleLoadMore = useCallback(() => {
    // Implement pagination or infinite scroll
    console.log('Loading more manga...');
  }, []);

  const handleError = useCallback((error, errorInfo) => {
    // Log error to monitoring service
    console.error('Landing page error:', error, errorInfo);
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <ErrorBoundary
          FallbackComponent={() => <HeroSkeleton />}
          onError={handleError}
        >
          <Suspense fallback={<HeroSkeleton />}>
            <EnhancedHeroSection />
          </Suspense>
        </ErrorBoundary>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Trending Section */}
          <ErrorBoundary
            FallbackComponent={() => <GridSkeleton />}
            onError={handleError}
          >
            <section className="mb-16">
              <Suspense fallback={<GridSkeleton />}>
                <ResponsiveMangaGrid
                  manga={mangaData.trending}
                  title="🔥 Trending Now"
                  onMangaClick={handleMangaClick}
                  hasMore={true}
                  onLoadMore={handleLoadMore}
                />
              </Suspense>
            </section>
          </ErrorBoundary>

          {/* Popular Section */}
          <ErrorBoundary
            FallbackComponent={() => <GridSkeleton />}
            onError={handleError}
          >
            <section className="mb-16">
              <Suspense fallback={<GridSkeleton />}>
                <ResponsiveMangaGrid
                  manga={mangaData.popular}
                  title="⭐ Most Popular"
                  onMangaClick={handleMangaClick}
                />
              </Suspense>
            </section>
          </ErrorBoundary>

          {/* New Releases Section */}
          <ErrorBoundary
            FallbackComponent={() => <GridSkeleton />}
            onError={handleError}
          >
            <section className="mb-16">
              <Suspense fallback={<GridSkeleton />}>
                <ResponsiveMangaGrid
                  manga={mangaData.newReleases}
                  title="🆕 New Releases"
                  onMangaClick={handleMangaClick}
                />
              </Suspense>
            </section>
          </ErrorBoundary>

          {/* Below-fold content with lazy loading */}
          <ErrorBoundary
            FallbackComponent={() => (
              <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
            )}
            onError={handleError}
          >
            <Suspense
              fallback={
                <div className="space-y-8">
                  <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
                  <div className="h-48 bg-gray-800 rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
              }
            >
              <StatsSection />
              <TestimonialsSection />
              <NewsletterSection />
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Performance monitoring component */}
        <PerformanceMonitor />
      </div>
    </ErrorBoundary>
  );
});

// Performance monitoring component
const PerformanceMonitor = memo(() => {
  // In development, log performance metrics
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Monitor Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }

  return null;
});

// Set display names for better debugging
HeroSkeleton.displayName = 'HeroSkeleton';
GridSkeleton.displayName = 'GridSkeleton';
CardSkeleton.displayName = 'CardSkeleton';
ErrorFallback.displayName = 'ErrorFallback';
OptimizedLandingPage.displayName = 'OptimizedLandingPage';
PerformanceMonitor.displayName = 'PerformanceMonitor';

export default OptimizedLandingPage;
