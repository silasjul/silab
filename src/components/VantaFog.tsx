'use client';

import Script from 'next/script';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

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
      speed: 1.3,
    });`}
        </Script>
      </div>
    ),
    []
  );
}

export function VantaBackground() {
  const [hue, setHue] = useState(260);

  useEffect(() => {
    let direction = -1;
    const intervalId = setInterval(() => {
      setHue((prevHue) => {
        if (prevHue > 260) direction = -1;
        if (prevHue < 180) direction = 1;
        return (prevHue + direction) % 360;
      });
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    // Outer mask that is always applied
    <div
      className="absolute inset-0"
      style={{ clipPath: 'inset(12px round 20px)' }}
    >
      {/* Inner mask that expands to reveal the content */}
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
        <VantaFog />
      </motion.div>
    </div>
  );
}
