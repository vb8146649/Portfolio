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
  const letters = Array.from(text);

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

  return (
    <motion.span
      style={{ display: 'inline-block', overflow: 'hidden' }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      className={className}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          style={{
            display: 'inline-block',
            whiteSpace: char === ' ' ? 'pre' : 'normal',
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};
