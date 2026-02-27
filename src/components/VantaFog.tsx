'use client';

import Script from 'next/script';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const OVERFLOW = 50;

export default function VantaFog() {
  return useMemo(
    () => (
      <div className="h-full w-full">
        <div
          className="absolute h-full w-full"
          id="vanta-fog"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
          strategy="beforeInteractive"
        />
        <Script id="script">
          {`VANTA.FOG({
      el: "#vanta-fog",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      speed: 1.2,
    });`}
        </Script>
      </div>
    ),
    []
  );
}

export function VantaBackground() {
  const [hue, setHue] = useState(240);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 50, stiffness: 200, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const translateX = useTransform(smoothX, [0, 1], [OVERFLOW, -OVERFLOW]);
  const translateY = useTransform(smoothY, [0, 1], [OVERFLOW, -OVERFLOW]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    let direction = -1;
    const intervalId = setInterval(() => {
      setHue((prevHue) => {
        if (prevHue > 240) direction = -1;
        if (prevHue < 205) direction = 1;
        return (prevHue + (direction * 1)) % 360;
      });
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ clipPath: 'inset(12px round 20px)' }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ filter: `hue-rotate(${hue}deg)` }}
        initial={{
          clipPath: 'inset(calc(50% - 0px) calc(50% - 0px) calc(50% - 0px) calc(50% - 0px) round 25px)'
        }}
        animate={{
          clipPath: 'inset(calc(0% + 12px) calc(0% + 12px) calc(0% + 12px) calc(0% + 12px) round 20px)'
        }}
        transition={{
          duration: 1.4,
          ease: [0.76, 0, 0.24, 1],
          delay: 0.3,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            inset: `-${OVERFLOW}px`,
            x: translateX,
            y: translateY,
          }}
        >
          <VantaFog />
        </motion.div>
      </motion.div>
    </div>
  );
}
