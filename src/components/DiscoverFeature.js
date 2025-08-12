"use client";
import { useEffect, useRef } from 'react';

export default function DiscoverFeature() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    // Ensure canvas is full width/height of container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Manga cover images for the feature
    // Use correct public path and robust error handling
    const mangaCoverSrcs = [
      '/manga1.jpg',
      '/manga2.jpg',
      '/manga3.jpg',
      '/manga4.jpg',
      '/manga5.jpg',
    ];
    const mangaCovers = mangaCoverSrcs.map(src => {
      const img = new window.Image();
      img.src = src;
      img.isBroken = false;
      img.onerror = () => { img.isBroken = true; };
      return img;
    });
    
    // Create floating manga panels
    const panels = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      width: 80 + Math.random() * 40,
      height: 120 + Math.random() * 60,
      rotation: (Math.random() - 0.5) * 0.5,
      image: mangaCovers[i % mangaCovers.length],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      vr: (Math.random() - 0.5) * 0.01,
      opacity: 0.7 + Math.random() * 0.3
    }));
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      panels.forEach(panel => {
        // Update position
        panel.x += panel.vx;
        panel.y += panel.vy;
        panel.rotation += panel.vr;

        // Boundary check
        if (panel.x < -panel.width) panel.x = canvas.width + panel.width;
        if (panel.x > canvas.width + panel.width) panel.x = -panel.width;
        if (panel.y < -panel.height) panel.y = canvas.height + panel.height;
        if (panel.y > canvas.height + panel.height) panel.y = -panel.height;

        // Draw panel
        ctx.save();
        ctx.translate(panel.x, panel.y);
        ctx.rotate(panel.rotation);
        ctx.globalAlpha = panel.opacity;

        // Draw manga cover if image is loaded and not broken
        if (
          panel.image &&
          panel.image.complete &&
          panel.image.naturalWidth > 0 &&
          !panel.image.isBroken
        ) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
          ctx.drawImage(panel.image, -panel.width/2, -panel.height/2, panel.width, panel.height);
        } else {
          // Placeholder until image loads or if broken
          ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
          ctx.fillRect(-panel.width/2, -panel.height/2, panel.width, panel.height);
        }

        ctx.restore();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="relative h-96 overflow-hidden rounded-xl">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 glass-effect rounded-xl">
        <div className="spotlight-container w-full">
          <div className="spotlight"></div>
          <h3 className="text-3xl font-bold mb-4 text-white relative">
            <span className="text-indigo-400">#</span>DISCOVER YOUR NEXT OBSESSION
          </h3>
        </div>
        
        <p className="text-gray-300 max-w-2xl mb-6">
          Our advanced AI recommendation system learns from your reading habits to suggest manga that matches your taste perfectly. Discover hidden gems and new releases tailored just for you.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <span className="genre-tag">Fantasy</span>
          <span className="genre-tag">Action</span>
          <span className="genre-tag">Romance</span>
          <span className="genre-tag">Sci-Fi</span>
          <span className="genre-tag">Horror</span>
          <span className="genre-tag">Comedy</span>
        </div>
        
        <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg shadow-indigo-600/30">
          Explore Personalized Recommendations
        </button>
      </div>
    </div>
  );
}
