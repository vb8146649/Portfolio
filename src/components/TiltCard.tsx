import React, { useState, useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees
  perspective?: number; // Perspective distance in pixels
  style?: React.CSSProperties;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`,
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
    transform: 'translate(-50%, -50%)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside the card
    const y = e.clientY - rect.top; // y coordinate inside the card

    const w = rect.width;
    const h = rect.height;

    // Normalize values between -0.5 and 0.5
    const normX = x / w - 0.5;
    const normY = y / h - 0.5;

    // Calculate rotation angles
    // Moving mouse to the right rotates around Y-axis positively (turns face left/right)
    // Moving mouse to the bottom rotates around X-axis negatively (turns face up/down)
    const tiltX = -normY * maxTilt;
    const tiltY = normX * maxTilt;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
    });

    // Update Glare position
    setGlareStyle({
      opacity: 0.25,
      left: `${(x / w) * 100}%`,
      top: `${(y / h) * 100}%`,
      transition: 'opacity 0.15s ease',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });

    setGlareStyle({
      opacity: 0,
      left: '50%',
      top: '50%',
      transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${className}`}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        ...style,
        ...tiltStyle,
      }}
    >
      {/* Glare/Specular Highlight overlay */}
      <div
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'overlay',
          ...glareStyle,
        }}
      />
      {children}
    </div>
  );
};
