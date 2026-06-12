import React from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Terminal as TerminalIcon, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playHoverSound, playClickSound, playSuccessSound, setMuted, getMuted } from '../utils/audio';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMutedState, setIsMutedState] = React.useState(getMuted());
  const [activeSection, setActiveSection] = React.useState('home');

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  React.useEffect(() => {
    const sections = ['home', 'projects', 'skills', 'contact'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies significant viewport center
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  const toggleMute = () => {
    const newState = !isMutedState;
    setIsMutedState(newState);
    setMuted(newState);
    if (!newState) {
      playSuccessSound();
    } else {
      playClickSound();
    }
  };

  const triggerLogoEasterEgg = () => {
    playSuccessSound();
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#8b5cf6', '#06b6d4']
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#10b981', '#f59e0b']
    });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1000px',
        zIndex: 999,
        pointerEvents: 'none',
      }}
    >
      <div
        className="glass"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.8rem 2rem',
          borderRadius: '50px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid var(--card-border)',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo */}
        <div
          onDoubleClick={triggerLogoEasterEgg}
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
          className="nav-logo clickable gradient-text"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Double click for a surprise!"
        >
          <TerminalIcon size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>PORTFOLIO</span>
        </div>

        {/* Desktop Links & Audio Controls */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`clickable nav-link ${isActive ? 'active' : ''}`}
                  onMouseEnter={playHoverSound}
                  onClick={playClickSound}
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'color 0.25s',
                    position: 'relative',
                  }}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          <span style={{ color: 'var(--card-border)', height: '20px', width: '1px', backgroundColor: 'var(--card-border)' }} />

          {/* Audio toggle button */}
          <button
            onClick={toggleMute}
            onMouseEnter={playHoverSound}
            className="clickable"
            style={{
              background: 'none',
              color: isMutedState ? 'var(--text-secondary)' : 'var(--accent-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--card-border)',
              transition: 'all 0.2s',
            }}
            title={isMutedState ? 'Unmute Audio Interface' : 'Mute Audio Interface'}
          >
            {isMutedState ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Mobile Toggle & Audio button */}
        <div style={{ display: 'none', gap: '1rem', alignItems: 'center' }} className="mobile-nav-controls">
          <button
            onClick={toggleMute}
            onMouseEnter={playHoverSound}
            className="clickable"
            style={{
              background: 'none',
              color: isMutedState ? 'var(--text-secondary)' : 'var(--accent-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--card-border)',
            }}
          >
            {isMutedState ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="clickable mobile-toggle"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{
            marginTop: '0.5rem',
            borderRadius: '16px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            pointerEvents: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  playClickSound();
                  setIsOpen(false);
                }}
                onMouseEnter={playHoverSound}
                className={`clickable nav-link ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {item.name}
              </a>
            );
          })}
        </motion.div>
      )}

      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
          transition: width 0.25s ease;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary) !important;
        }

        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-controls {
            display: flex !important;
          }
        }
      `}</style>
    </motion.header>
  );
};
