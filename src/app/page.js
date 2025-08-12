"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InteractiveBackground from "../components/InteractiveBackground";
import DiscoverFeature from "../components/DiscoverFeature";
import ExclusiveBanner from "../components/ExclusiveBanner";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  // Popular Manga State
  const [popularManga, setPopularManga] = useState([]);
  const [loadingManga, setLoadingManga] = useState(true);
  // My Library State
  const [library, setLibrary] = useState([]);
  // Continue Reading State
  const [continueReading, setContinueReading] = useState([]);
  // Reading Progress State
  const [readingProgress, setReadingProgress] = useState({});
  // Recent Updates State
  const [recentUpdates, setRecentUpdates] = useState([]);
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // Animation state
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    async function fetchPopular() {
      setLoadingManga(true);
      try {
        const res = await fetch(`/api/popular?page=${page}`);
        const data = await res.json();
        setPopularManga(data.data || []);
        setLibrary(data.data || []);
        setRecentUpdates((data.data || []).slice(0, 5));
        setHasMore((data.data || []).length === 12);
        // Load reading progress from localStorage
        const progress = JSON.parse(localStorage.getItem("readingProgress") || "{}");
        setReadingProgress(progress);
        // Filter manga that have progress
        const continueList = (data.data || []).filter(manga => progress[manga.id]).map(manga => ({
          ...manga,
          lastRead: progress[manga.id]
        })).slice(0, 3);
        setContinueReading(continueList);
      } catch {
        setPopularManga([]);
        setLibrary([]);
        setContinueReading([]);
        setRecentUpdates([]);
        setHasMore(false);
      }
      setLoadingManga(false);
    }
    fetchPopular();
  }, [page]);

  // Helper to get cover image
  // No longer needed: getCoverUrl, as API returns thumbnail

  return (
    <div className="font-sans min-h-screen flex flex-col bg-black text-gray-100 relative">
      {/* Optimized Background System - Reduced animations for better performance */}
      <InteractiveBackground />
      
      {/* Static Background Elements - No animations */}
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-black/20 pointer-events-none z-0"></div>
      
      {/* Optimized Star background - Reduced count */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          
          return (
            <div 
              key={i}
              className="star"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
                borderRadius: '50%',
                opacity: Math.random() * 0.8 + 0.2
              }}
            ></div>
          );
        })}
      </div>
      
      {/* Static ambient lights - No movement */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <Navbar />
      
      {/* Enhanced Hero Section with Better Design */}
      <div ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-black/80 py-20 border-b border-indigo-800/30 z-10">
        {/* Subtle animated light beam */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-1/3 h-screen -top-1/2 left-1/3 bg-gradient-to-b from-indigo-500/5 via-purple-500/3 to-transparent transform -rotate-45 animate-pulse"></div>
        </div>
        
        {/* Optimized background image with less movement */}
        <div 
          className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 transition-transform duration-700 ease-out will-change-transform" 
          style={{ 
            transform: `scale(${1 + scrollY * 0.0002}) rotate(${scrollY * 0.01}deg)`,
            opacity: Math.max(0.05 - scrollY * 0.00005, 0.02) 
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* Static sacred geometry pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[800px] h-[800px] border border-indigo-500/20 rounded-full"></div>
          <div className="absolute w-[600px] h-[600px] border border-indigo-500/15 rounded-full"></div>
          <div className="absolute w-[400px] h-[400px] border border-indigo-500/10 rounded-full"></div>
        </div>
        
        {/* Reduced particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 h-0.5 bg-indigo-400 rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3 + 0.2,
                animationDuration: `${Math.random() * 3 + 3}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h1 
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-8 tracking-tight opacity-0 translate-y-8 animate-[fadeInUp_1.2s_0.3s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards] neon-glow"
              style={{
                backgroundSize: '200% 200%',
                animation: 'textGradientAnimation 8s ease infinite, fadeInUp 1.2s 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards'
              }}
            >
              MANGA HINOG
            </h1>
            
            {/* Enhanced description section with better design */}
            <div className="opacity-0 translate-y-8 animate-[fadeInUp_1.2s_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]">
              <div className="relative max-w-4xl mx-auto mb-8">
                {/* Decorative elements */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"></div>
                
                {/* Main tagline */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                  Where Stories Come <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Alive</span>
                </h2>
                
                {/* Feature highlights in cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-indigo-500/20 rounded-xl p-4 hover:border-indigo-500/40 transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-indigo-200 mb-2">Discover</h3>
                      <p className="text-sm text-gray-300">Explore thousands of manga titles from every genre imaginable</p>
                    </div>
                  </div>
                  
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-purple-200 mb-2">Track</h3>
                      <p className="text-sm text-gray-300">Keep track of your reading progress across all your favorite series</p>
                    </div>
                  </div>
                  
                  <div className="group relative bg-white/5 backdrop-blur-sm border border-pink-500/20 rounded-xl p-4 hover:border-pink-500/40 transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-pink-200 mb-2">Immerse</h3>
                      <p className="text-sm text-gray-300">Dive deep into captivating worlds with our enhanced reading experience</p>
                    </div>
                  </div>
                </div>
                
                {/* Bottom decorative element */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>
            </div>
            
            <div 
              className="flex flex-wrap justify-center gap-6 opacity-0 translate-y-8 animate-[fadeInUp_1.2s_0.9s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
            >
              <a 
                href="/browse" 
                className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-indigo-600/40"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Library
                </span>
              </a>
              <a 
                href="/favorites" 
                className="group relative px-10 py-4 bg-transparent border-2 border-indigo-400 text-indigo-400 rounded-full font-bold text-lg overflow-hidden transition-all duration-500 hover:scale-110 hover:bg-indigo-400/10 hover:border-indigo-300 hover:text-indigo-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  My Collection
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trending Now Section with Bold Design */}
      <div className="w-full bg-black py-16 relative z-10">
        {/* Diagonal lines background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(99, 102, 241, 0.1) 0, rgba(99, 102, 241, 0.1) 1px, transparent 1px, transparent 50%)',
            backgroundSize: '10px 10px'
          }}></div>
        </div>
      
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-900/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div 
            className="flex justify-between items-center mb-10 opacity-0 translate-y-5 animate-[fadeInUp_0.6s_forwards]"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white group relative">
              <span className="text-indigo-500 group-hover:text-indigo-400 transition-colors">#</span>TRENDING NOW
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></span>
            </h2>
            <a 
              href="/browse" 
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 group hover:translate-x-1 transition-transform duration-300"
            >
              VIEW ALL
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          
          {loadingManga ? (
            <div className="flex justify-center items-center h-64">
              <div 
                className="rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 animate-spin"
              ></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative">
                {/* Decorative element */}
                <div className="absolute -top-10 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                
                {popularManga.map((manga, index) => (
                  <div 
                    key={manga.id} 
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] opacity-0 animate-[fadeInUp_0.8s_forwards] cursor-pointer"
                    style={{
                      animationDelay: `${0.1 * index}s`,
                      transformStyle: 'preserve-3d'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-12px) scale(1.02) rotateX(5deg)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                    }}
                  >
                    {/* Enhanced glowing border on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-0">
                      <div className="absolute inset-0 -m-0.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm opacity-70 animate-pulse"></div>
                    </div>
                    
                    {/* Enhanced ranking badge for top 3 */}
                    {index < 3 && (
                      <div 
                        className="absolute top-3 left-3 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg animate-[scaleIn_0.5s_forwards] transform transition-all duration-300 hover:scale-110"
                        style={{
                          animationDelay: `${0.3 + index * 0.15}s`,
                          boxShadow: '0 0 20px rgba(255, 193, 7, 0.5)'
                        }}
                      >
                        <span className="relative z-10">#{index + 1}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping opacity-20"></div>
                      </div>
                    )}
                    
                    <a href={`/read/${manga.id}`} className="block relative z-10"> 
                      <img 
                        src={manga.thumbnail} 
                        alt={manga.title} 
                        className="h-52 w-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-out will-change-transform" 
                      />
                    </a>
                    
                    {/* Enhanced overlay with better animation */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <h3 className="text-sm font-bold text-white truncate mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                        {manga.title}
                      </h3>
                      
                      {/* Enhanced expanded content */}
                      <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-500 ease-out">
                        <p className="text-xs text-gray-300 line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                          {manga.description}
                        </p>
                        
                        {/* Enhanced action area */}
                        <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-400 font-medium">Available</span>
                          </div>
                          
                          <a 
                            href={`/read/${manga.id}`} 
                            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-all duration-300 transform hover:scale-110 hover:translate-x-1"
                          >
                            READ NOW
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Controls with Modern Design */}
              <div 
                className="flex justify-center items-center gap-4 mt-12 opacity-0 animate-[fadeInUp_0.5s_0.3s_forwards]"
              >
                <button
                  className="px-6 py-2 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-30 flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 duration-200 group relative overflow-hidden"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                >
                  {/* Button effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="relative z-10">Previous</span>
                </button>
                <div 
                  className="px-4 py-2 bg-gray-900 rounded-full text-indigo-400 font-medium hover:scale-110 transition-transform duration-200 relative overflow-hidden group"
                >
                  {/* Glow effect */}
                  <span className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 blur group-hover:opacity-50 transition-opacity duration-300"></span>
                  <span className="relative z-10">{page}</span>
                </div>
                <button
                  className="px-6 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-30 flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 hover:scale-105 active:scale-95 duration-200 group relative overflow-hidden"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasMore}
                >
                  {/* Button effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  <span className="relative z-10">Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Main Content */}
      <main className="flex-grow px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Quick Access Section - Bold Icons & Cards */}
          <section className="py-16 relative z-10">
            {/* Background elements */}
            <div className="absolute -top-10 left-0 right-0 h-20 bg-gradient-to-b from-black via-indigo-900/10 to-black"></div>
            <div className="absolute inset-0 opacity-5">
              <div className="absolute w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.5) 0%, transparent 25%), radial-gradient(circle at 70% 20%, rgba(139, 92, 246, 0.5) 0%, transparent 25%)',
                backgroundSize: '100% 100%',
                filter: 'blur(70px)'
              }}></div>
            </div>
            
            <h2 
              className="text-3xl md:text-4xl font-extrabold text-white mb-8 flex items-center opacity-0 animate-[fadeInLeft_0.5s_forwards] relative"
            >
              <span className="mr-3 text-indigo-500 text-2xl neon-glow">〢</span>QUICK ACCESS
              <span className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-indigo-600 to-transparent rounded-full"></span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <a 
                href="/favorites" 
                className="group relative bg-gradient-to-br from-purple-900/40 to-indigo-900/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 border border-indigo-500/20 hover:border-indigo-500/70 overflow-hidden shadow-lg opacity-0 animate-[fadeInUp_0.8s_0.1s_cubic-bezier(0.34,1.56,0.64,1)_forwards] hover:-translate-y-4 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.05) rotateY(5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                }}
              >
                {/* Enhanced inner glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/20 blur-xl animate-pulse"></div>
                </div>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Animated icon with better effects */}
                <div className="relative z-10 mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <div className="absolute inset-0 bg-pink-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-pink-400 relative z-10 drop-shadow-lg transition-all duration-500 group-hover:text-pink-300"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <span className="text-white text-lg font-bold mb-2 group-hover:text-pink-300 transition-colors duration-500 relative z-10">Favorites</span>
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">Your top manga collection</span>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 p-0.5">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-900/40 to-indigo-900/20"></div>
                  </div>
                </div>
              </a>
              
              <a 
                href="/to-read" 
                className="group relative bg-gradient-to-br from-indigo-900/40 to-blue-900/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 border border-indigo-500/20 hover:border-indigo-500/70 overflow-hidden shadow-lg opacity-0 animate-[fadeInUp_0.8s_0.2s_cubic-bezier(0.34,1.56,0.64,1)_forwards] hover:-translate-y-4 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.05) rotateY(-5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-blue-600/20 blur-xl animate-pulse"></div>
                </div>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,120,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-indigo-400 relative z-10 drop-shadow-lg transition-all duration-500 group-hover:text-indigo-300"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </div>
                
                <span className="text-white text-lg font-bold mb-2 group-hover:text-indigo-300 transition-colors duration-500 relative z-10">To Read</span>
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">Your reading queue</span>
              </a>
              
              <a 
                href="/completed" 
                className="group relative bg-gradient-to-br from-green-900/40 to-indigo-900/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 border border-indigo-500/20 hover:border-indigo-500/70 overflow-hidden shadow-lg opacity-0 animate-[fadeInUp_0.8s_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards] hover:-translate-y-4 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.05) rotateY(5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 to-emerald-600/20 blur-xl animate-pulse"></div>
                </div>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,255,120,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                  <div className="absolute inset-0 bg-green-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-green-400 relative z-10 drop-shadow-lg transition-all duration-500 group-hover:text-green-300"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <span className="text-white text-lg font-bold mb-2 group-hover:text-green-300 transition-colors duration-500 relative z-10">Completed</span>
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">Your finished series</span>
              </a>
              
              <a 
                href="/download" 
                className="group relative bg-gradient-to-br from-blue-900/40 to-indigo-900/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 border border-indigo-500/20 hover:border-indigo-500/70 overflow-hidden shadow-lg opacity-0 animate-[fadeInUp_0.8s_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] hover:-translate-y-4 hover:scale-105 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.05) rotateY(-5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-cyan-600/20 blur-xl animate-pulse"></div>
                </div>
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,150,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10 mb-4 transform transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-blue-400 relative z-10 drop-shadow-lg transition-all duration-500 group-hover:text-blue-300"
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <span className="text-white text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors duration-500 relative z-10">Downloads</span>
                <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-500 relative z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">Offline reading collection</span>
              </a>
            </div>
          </section>

          {/* Continue Reading Section */}
          <section className="py-16 border-t border-indigo-900/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center">
                <span className="mr-3 text-indigo-500 text-2xl">〢</span>CONTINUE READING
              </h2>
              <a href="/reading-history" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group">
                VIEW HISTORY
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            
            {continueReading.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 text-center border border-indigo-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-500/50 mb-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No Reading Activity Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">Start reading your favorite manga to track your progress and continue where you left off.</p>
                <a href="/browse" className="mt-6 inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-colors">
                  Browse Manga
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {continueReading.map((manga) => (
                  <div key={manga.id} className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-indigo-900/20 hover:border-indigo-500/50 transition-all duration-300 shadow-lg">
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={manga.thumbnail} 
                        alt={manga.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white text-lg truncate">{manga.title}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="bg-indigo-900/30 text-indigo-300 text-xs font-medium py-1 px-2 rounded-full">
                          {manga.lastRead?.chapter ? `Chapter ${manga.lastRead.chapter}` : "No chapter info"}
                          {manga.lastRead?.page ? `, Page ${manga.lastRead.page}` : ""}
                        </div>
                        <span className="text-xs text-gray-500">{manga.lastRead?.date ? manga.lastRead.date : "Unknown"}</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round((manga.lastRead?.progress || 0) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" 
                            style={{ width: `${(manga.lastRead?.progress || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <a 
                        href={`/read/${manga.id}`} 
                        className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold rounded-lg transition-colors"
                      >
                        Continue Reading
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Library Section - Visual Showcase */}
          <section className="py-16 border-t border-indigo-900/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center">
                <span className="mr-3 text-indigo-500 text-2xl">〢</span>MY COLLECTION
              </h2>
              <a href="/manage-library" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group">
                MANAGE LIBRARY
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 manga-gallery">
              {library.slice(0, 12).map((manga, index) => (
                <a 
                  key={manga.id}
                  href={`/read/${manga.id}`}
                  className="group relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-1 border border-indigo-900/20 hover:border-indigo-500/50 manga-gallery-item book-card"
                >
                  {/* Book spine effect */}
                  <div className="book-card-spine"></div>
                  
                  <div className="aspect-[2/3] overflow-hidden hover-zoom">
                    <img 
                      src={manga.thumbnail} 
                      alt={manga.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Energy field effect */}
                    <div className="energy-field"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-sm font-bold text-white">{manga.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-indigo-300 bg-indigo-900/40 px-2 py-0.5 rounded-full">Ongoing</span>
                      </div>
                      
                      {/* Reading tracker */}
                      <div className="mt-2 reading-tracker">
                        <div className="tracker-dot active"></div>
                        <div className="tracker-line">
                          <div className="tracker-line-progress" style={{width: '30%'}}></div>
                        </div>
                        <div className="tracker-dot"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Add special badge to some items */}
                  {index === 0 || index === 5 || index === 9 ? (
                    <div className="absolute top-2 right-2 text-xs font-bold bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-2 py-0.5 rounded-md z-10 transform rotate-3 shadow pulse-glow">
                      NEW
                    </div>
                  ) : null}
                </a>
              ))}
            </div>
            
            {/* Premium content banner */}
            <div className="mt-10">
              <ExclusiveBanner />
            </div>
          </section>

          {/* Recent Updates Section - Modern Dashboard Style */}
          <section className="py-16 border-t border-indigo-900/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center">
                <span className="mr-3 text-indigo-500 text-2xl">〢</span>RECENT UPDATES
              </h2>
              <a href="/all-updates" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 group">
                VIEW ALL
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-indigo-900/20 shadow-lg">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-indigo-900/30">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider">Title</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider hidden md:table-cell">Updated</th>
                      <th className="py-3 px-4 text-right text-xs font-bold text-indigo-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-900/20">
                    {recentUpdates.map((manga, idx) => (
                      <tr key={manga.id} className="group hover:bg-indigo-900/10 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-10 w-8 rounded overflow-hidden mr-3 hidden sm:block">
                              <img src={manga.thumbnail} alt={manga.title} className="h-full w-full object-cover" />
                            </div>
                            <span className="font-bold text-white">{manga.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                            Ongoing
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400 hidden md:table-cell">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {idx + 1} day{idx !== 0 ? 's' : ''} ago
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <a 
                            href={`/read/${manga.id}`} 
                            className="inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Read
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Newsletter and App Download Section - Futuristic Design */}
          <section className="py-16 mb-20 border-t border-indigo-900/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-900 rounded-2xl p-8 shadow-lg overflow-hidden border border-indigo-600/30 group newsletter-spotlight">
                {/* Animated glowing orb */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl opacity-50 group-hover:bg-pink-500/40 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white glitch-effect" data-text="JOIN OUR NEWSLETTER">JOIN OUR NEWSLETTER</h3>
                  </div>
                  <p className="text-indigo-200 mb-6 max-w-md">Get notified about new manga releases, exclusive content, and reading recommendations straight to your inbox.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="px-4 py-3 rounded-lg bg-white/10 border border-indigo-600/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 flex-1 placeholder-indigo-300"
                    />
                    <button className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap transform hover:scale-105 duration-200 pulse-glow">
                      SUBSCRIBE
                    </button>
                  </div>
                  <p className="text-indigo-300/70 text-xs mt-4">We respect your privacy. Unsubscribe at any time.</p>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 rounded-2xl p-8 shadow-lg overflow-hidden border border-indigo-900/30 group holographic-card">
                {/* Animated glowing orb */}
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-white/10 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-extrabold text-white">DOWNLOAD OUR APP</h3>
                  </div>
                  <p className="text-gray-300 mb-6 max-w-md">Take your manga experience on the go with our mobile app. Read offline, get notifications, and sync your progress across devices.</p>
                  <div className="flex flex-wrap gap-4">
                    <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black/50 text-white rounded-xl hover:bg-black/80 transition-colors border border-gray-800 hover:border-indigo-500/50 group">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-400">Download on the</div>
                        <div className="text-sm font-bold">App Store</div>
                      </div>
                    </a>
                    <a href="#" className="flex items-center gap-3 px-5 py-3 bg-black/50 text-white rounded-xl hover:bg-black/80 transition-colors border border-gray-800 hover:border-indigo-500/50 group">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-400">GET IT ON</div>
                        <div className="text-sm font-bold">Google Play</div>
                      </div>
                    </a>
                  </div>
                  
                  {/* New: App features */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">Offline Reading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">Notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">Custom Library</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center notification-bell">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">Faster Updates</span>
                    </div>
                  </div>
                </div>
                
                {/* New: App screenshot mockup */}
                <div className="absolute -bottom-10 -right-5 w-32 h-64 bg-gray-900 rounded-xl border border-indigo-500/30 transform rotate-12 shadow-xl overflow-hidden hidden md:block">
                  <div className="absolute inset-1 bg-indigo-900/30 rounded-lg"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* New Interactive Feature Section */}
          <section className="py-16 border-t border-indigo-900/20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10 flex items-center">
              <span className="mr-3 text-indigo-500 text-2xl neon-glow">〢</span>DISCOVER NEW WORLDS
            </h2>
            
            <DiscoverFeature />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
