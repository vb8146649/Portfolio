import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

type Theme = 'default' | 'emerald' | 'solarized' | 'ocean';

interface ThemeOption {
  id: Theme;
  name: string;
  primaryColor: string;
  bgColor: string;
}

export const ThemeSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>('default');

  const themes: ThemeOption[] = [
    { id: 'default', name: 'Electric Obsidian', primaryColor: '#8b5cf6', bgColor: '#0b0f19' },
    { id: 'emerald', name: 'Midnight Emerald', primaryColor: '#10b981', bgColor: '#090d10' },
    { id: 'solarized', name: 'Solarized Amber', primaryColor: '#f59e0b', bgColor: '#120b09' },
    { id: 'ocean', name: 'Deep Ocean', primaryColor: '#3b82f6', bgColor: '#050b14' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme && ['default', 'emerald', 'solarized', 'ocean'].includes(savedTheme)) {
      setActiveTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: Theme) => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('portfolio-theme', theme);
    
    // Dispatch a custom event so canvas particles and cursor know to re-evaluate styles
    window.dispatchEvent(new Event('themechange'));
  };

  const handleThemeChange = (theme: Theme) => {
    setActiveTheme(theme);
    applyTheme(theme);
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 1000,
      }}
    >
      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="glass clickable"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          border: '1px solid var(--card-border)',
          background: 'rgba(255, 255, 255, 0.03)',
          outline: 'none',
        }}
        aria-label="Change Theme"
      >
        <Palette size={16} style={{ transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className="glass"
          style={{
            position: 'absolute',
            top: '2.75rem',
            right: 0,
            padding: '1rem',
            width: '220px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 15px var(--glow-color)',
            animation: 'themeFadeIn 0.25s ease-out',
            transformOrigin: 'top right',
            zIndex: 1001,
          }}
        >
          <h4
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
              fontFamily: 'Orbitron, sans-serif'
            }}
          >
            Select Accent
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  handleThemeChange(theme.id);
                }}
                className="clickable"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  background: activeTheme === theme.id ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
                  border: `1px solid ${activeTheme === theme.id ? 'var(--accent-primary)' : 'transparent'}`,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  {/* Color Preview dots */}
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: theme.primaryColor,
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <span>{theme.name.split(' ')[1] || theme.name}</span>
                </div>
                {activeTheme === theme.id && <Check size={14} style={{ color: 'var(--accent-primary)' }} />}
              </button>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes themeFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};
