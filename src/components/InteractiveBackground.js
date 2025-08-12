"use client";
import { useEffect, useState, useRef } from 'react';

export default function InteractiveBackground() {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Initialize particles and window size
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      // Create initial particles
      const initialParticles = Array.from({ length: 150 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        color: getRandomColor(),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      }));
      
      setParticles(initialParticles);
      
      // Update window size on resize
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Calculate distance from mouse
          const dx = mousePos.x - particle.x;
          const dy = mousePos.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Mouse influence (subtle attraction)
          let nvx = particle.vx;
          let nvy = particle.vy;
          
          if (distance < 200) {
            const force = 0.02 * (1 - distance / 200);
            nvx += dx * force / distance;
            nvy += dy * force / distance;
          }
          
          // Update position
          let nx = particle.x + nvx;
          let ny = particle.y + nvy;
          
          // Boundary check
          if (nx < 0 || nx > windowSize.width) {
            nvx = -nvx;
            nx = particle.x + nvx;
          }
          
          if (ny < 0 || ny > windowSize.height) {
            nvy = -nvy;
            ny = particle.y + nvy;
          }
          
          // Apply velocity decay
          nvx *= 0.99;
          nvy *= 0.99;
          
          // Return updated particle
          return {
            ...particle,
            x: nx,
            y: ny,
            vx: nvx,
            vy: nvy
          };
        })
      );
      
      requestAnimationFrame(animateParticles);
    };
    
    const animationId = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [particles, mousePos, windowSize]);
  
  // Neural network connections
  const drawConnections = () => {
    if (!containerRef.current || particles.length === 0) return null;
    
    const connections = [];
    const connectionDistance = 150;
    
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = 0.2 * (1 - distance / connectionDistance);
          const width = Math.max(1, 2 * (1 - distance / connectionDistance));
          
          connections.push(
            <line
              key={`${i}-${j}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={`rgba(99, 102, 241, ${opacity})`}
              strokeWidth={width}
            />
          );
        }
      }
    }
    
    return connections;
  };
  
  // Random color generator with manga theme
  function getRandomColor() {
    const colors = [
      'rgba(99, 102, 241, 0.8)', // indigo
      'rgba(139, 92, 246, 0.8)',  // purple
      'rgba(59, 130, 246, 0.8)',  // blue
      'rgba(236, 72, 153, 0.8)',  // pink
      'rgba(16, 185, 129, 0.8)',  // emerald
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <svg className="w-full h-full">
        {/* Draw connections */}
        {drawConnections()}
        
        {/* Draw particles */}
        {particles.map((particle, index) => (
          <circle
            key={index}
            cx={particle.x}
            cy={particle.y}
            r={particle.size}
            fill={particle.color}
            opacity={particle.opacity}
          />
        ))}
      </svg>
      
      {/* Radial gradient centered on mouse position */}
      <div 
        className="absolute pointer-events-none"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
          transition: 'opacity 0.3s ease',
        }}
      />
      
      {/* Digital circuit lines */}
      <div className="absolute inset-0 circuit-board-bg"></div>
      
      {/* Energy field effect */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.4) 0%, transparent 30%)',
            filter: 'blur(40px)'
          }}
        ></div>
      </div>
    </div>
  );
}
