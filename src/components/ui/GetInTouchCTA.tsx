'use client';

import { motion } from 'framer-motion';
import React from 'react';

export default function GetInTouchCTA({
  children,
  className,
  arrow,
}: {
  children: React.ReactNode;
  className?: string;
  arrow: boolean;
}) {
  return (
    <motion.button
      className={
        'cursor-pointer px-4 sm:px-6 py-[0.5rem] sm:py-[0.6rem] text-black rounded-full bg-secondary text-base sm:text-lg shadow-md flex items-center space-x-2 transition-colors duration-300 hover:bg-black hover:text-white whitespace-nowrap ' +
        (className ?? '')
      }
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <span>{children}</span>
      {arrow && (
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{
            x: [0, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}