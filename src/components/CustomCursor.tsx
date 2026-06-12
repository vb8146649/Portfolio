import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coords
  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Add custom cursor class to body
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Update animations via lerp
    let animationFrameId: number;
    const updateCursor = () => {
      // Dot - instantaneous
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      // Ring - lerp (linear interpolation) for trailing effect
      const ease = 0.15; // smoothness factor
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    // Hover triggers
    const addHoverClass = () => setIsHovered(true);
    const removeHoverClass = () => setIsHovered(false);

    const setupHoverListeners = () => {
      const clickables = document.querySelectorAll('a, button, input, textarea, select, .clickable');
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
      });
    };

    // Listeners
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    setupHoverListeners();

    // Use MutationObserver to watch for newly added elements to apply hover effect
    const observer = new MutationObserver(() => {
      setupHoverListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Small Center Dot */}
      <div
        ref={dotRef}
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--accent-primary)',
          borderRadius: '50%',
          position: 'fixed',
          top: -3,
          left: -3,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        style={{
          width: isHovered ? '48px' : '24px',
          height: isHovered ? '48px' : '24px',
          border: '1.5px solid var(--accent-primary)',
          borderRadius: '50%',
          position: 'fixed',
          top: isHovered ? -24 : -12,
          left: isHovered ? -24 : -12,
          pointerEvents: 'none',
          zIndex: 9998,
          mixBlendMode: 'difference',
          transition: 'width 0.25s ease, height 0.25s ease, top 0.25s ease, left 0.25s ease, background-color 0.25s ease',
          backgroundColor: isHovered ? 'rgba(var(--accent-rgb), 0.15)' : 'transparent',
          boxShadow: isHovered ? '0 0 10px var(--glow-color)' : 'none',
        }}
      />
    </>
  );
};
