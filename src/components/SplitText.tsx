import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  stagger = 0.02,
}) => {
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: '40%',
    },
    visible: {
      opacity: 1,
      y: '0%',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
        duration: duration,
      },
    },
  };

  let globalCharIndex = 0;

  return (
    <motion.span
      style={{ display: 'inline-block', overflow: 'hidden' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      className={className}
    >
      {words.map((word, wordIndex) => {
        const letters = Array.from(word);
        return (
          <span
            key={wordIndex}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {letters.map((char) => {
              const charKey = globalCharIndex++;
              return (
                <motion.span
                  key={charKey}
                  variants={childVariants}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span style={{ display: 'inline-block' }}>&nbsp;</span>
            )}
          </span>
        );
      })}
    </motion.span>
  );
};
