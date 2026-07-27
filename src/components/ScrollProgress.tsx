import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }

      // Detect active section based on proximity
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '2.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 998,
        height: '180px',
        justifyContent: 'space-between',
      }}
      className="scroll-progress-sidebar"
    >
      {/* Background track */}
      <div
        style={{
          position: 'absolute',
          width: '2px',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '1px',
          zIndex: 1,
        }}
      />

      {/* Progress fill */}
      <div
        style={{
          position: 'absolute',
          width: '2px',
          height: `${scrollProgress}%`,
          top: 0,
          background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary))',
          boxShadow: '0 0 8px var(--glow-color)',
          borderRadius: '1px',
          zIndex: 2,
          transition: 'height 0.1s ease-out',
        }}
      />

      {/* Interactive Section Dots */}
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredDot === section.id;

        return (
          <div
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            onMouseEnter={() => setHoveredDot(section.id)}
            onMouseLeave={() => setHoveredDot(null)}
            style={{
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {/* Pulsing indicator */}
            <motion.div
              animate={{
                scale: isActive ? [1, 1.2, 1] : 1,
              }}
              transition={{
                repeat: isActive ? Infinity : 0,
                duration: 2,
              }}
              style={{
                width: isActive ? '10px' : '6px',
                height: isActive ? '10px' : '6px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isActive ? '0 0 10px var(--accent-primary), 0 0 4px var(--accent-secondary)' : 'none',
                transition: 'all 0.25s ease',
                border: isActive ? '1px solid #ffffff' : 'none',
              }}
            />

            {/* Label Tooltip */}
            <AnimatePresence>
              {(isHovered || isActive) && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: -8 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    position: 'absolute',
                    right: '24px',
                    padding: '0.25rem 0.6rem',
                    backgroundColor: 'rgba(11, 15, 25, 0.85)',
                    border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--card-border)'}`,
                    borderRadius: '4px',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    boxShadow: isActive ? '0 0 8px rgba(139, 92, 246, 0.2)' : 'none',
                  }}
                >
                  {section.label.toUpperCase()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 1024px) {
          .scroll-progress-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
