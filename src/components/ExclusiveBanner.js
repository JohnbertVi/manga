"use client";
import { useEffect, useRef } from 'react';

export default function ExclusiveBanner() {
  const bannerRef = useRef(null);
  
  useEffect(() => {
    if (!bannerRef.current) return;
    
    const banner = bannerRef.current;
    
    // Create floating particles
    const createParticles = () => {
      const particleCount = 15;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('cosmic-particle');
        
        // Random size between 2px and 8px
        const size = 2 + Math.random() * 6;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random starting position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Custom properties for animation
        particle.style.setProperty('--particle-opacity', 0.3 + Math.random() * 0.4);
        particle.style.setProperty('--particle-scale', 0.5 + Math.random() * 0.5);
        
        // Random travel distance
        const travelX = (Math.random() - 0.5) * 200;
        const travelY = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--particle-travel-x', `${travelX}px`);
        particle.style.setProperty('--particle-travel-y', `${travelY}px`);
        
        // Random animation duration between 10s and 20s
        const duration = 10 + Math.random() * 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = `${delay}s`;
        
        banner.appendChild(particle);
      }
    };
    
    // Create data streams (cyberpunk effect)
    const createDataStreams = () => {
      const streamCount = 8;
      
      for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.classList.add('data-stream');
        
        // Random position
        stream.style.left = `${Math.random() * 100}%`;
        
        // Random height and speed
        const speed = 5 + Math.random() * 10;
        stream.style.animationDuration = `${speed}s`;
        
        // Random delay
        const delay = Math.random() * 5;
        stream.style.animationDelay = `${delay}s`;
        
        banner.appendChild(stream);
      }
    };
    
    createParticles();
    createDataStreams();
    
    // Clean up function
    return () => {
      const particles = banner.querySelectorAll('.cosmic-particle, .data-stream');
      particles.forEach(particle => particle.remove());
    };
  }, []);
  
  return (
    <div 
      ref={bannerRef}
      className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden py-8 px-6 md:py-12 md:px-10 shadow-xl border border-indigo-500/30"
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-background opacity-10"></div>
      
      {/* Exclusive tag */}
      <div className="exclusive-badge">EXCLUSIVE</div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-lg">
          <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-300">PREMIUM MANGA VAULT</span>
          </h3>
          <p className="text-indigo-200 mb-6">Unlock our Premium Vault for exclusive manga titles, early access to new chapters, and special edition releases you won't find anywhere else.</p>
          
          {/* Feature list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-indigo-100">Exclusive titles</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-indigo-100">Early access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-indigo-100">Special editions</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-indigo-100">No ads</span>
            </div>
          </div>
          
          <button className="px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap transform hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/20 pulse-glow">
            UNLOCK PREMIUM
          </button>
        </div>
        
        {/* Countdown timer */}
        <div className="text-center">
          <p className="text-indigo-200 mb-2">Limited time offer:</p>
          <div className="digital-clock mb-2">
            <div className="digital-clock-segment">48</div>
            <div className="digital-clock-colon">:</div>
            <div className="digital-clock-segment">12</div>
            <div className="digital-clock-colon">:</div>
            <div className="digital-clock-segment">33</div>
          </div>
          <p className="text-indigo-300 text-sm">50% off first month</p>
        </div>
      </div>
    </div>
  );
}
