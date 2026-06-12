import React, { useState, useEffect, useRef } from 'react';

interface ScrambledTextProps {
  text: string;
  className?: string;
  speed?: number;
  triggerOnHover?: boolean;
}

export const ScrambledText: React.FC<ScrambledTextProps> = ({
  text,
  className = '',
  speed = 30,
  triggerOnHover = true,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const isAnimating = useRef(false);
  const chars = '!<>-_\\/[]{}—=+*^?#%&';

  const scramble = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        isAnimating.current = false;
      }

      iteration += 1 / 3; // Resolve 1 character every 3 ticks
    }, speed);
  };

  useEffect(() => {
    // Run once on mount
    scramble();
  }, [text]);

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      scramble();
    }
  };

  return (
    <span onMouseEnter={handleMouseEnter} className={className} style={{ display: 'inline-block' }}>
      {displayText}
    </span>
  );
};
