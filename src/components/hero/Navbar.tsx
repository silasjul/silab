"use client"

import { motion, Transition } from 'framer-motion';
import Image from 'next/image';
import { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import GetInTouchCTA from '../ui/GetInTouchCTA';
import { useLenis } from 'lenis/react';
import BookingWrapper from '../BookingWrapper';

const transition: Transition = { duration: 1.3, ease: 'anticipate', delay: .3 }

type NavDict = {
  services: string;
  works: string;
  about: string;
  "ask-ai": string;
  contact: string;
  getInTouch: string;
}

const sections = ['services', 'works', 'about', 'ask-ai', 'contact'] as const;

export default function Navbar({ dict }: { dict: NavDict }) {
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const visibleSectionsRef = useRef(new Set<string>());
  const clickTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const sectionElements = sections
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = visibleSectionsRef.current;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        if (clickTargetRef.current) {
          if (visible.has(clickTargetRef.current)) {
            setActiveSection(clickTargetRef.current);
            clickTargetRef.current = null;
          }
          return;
        }

        if (visible.size > 0) {
          for (const section of sections) {
            if (visible.has(section)) {
              setActiveSection(section);
              return;
            }
          }
        } else {
          setActiveSection(null);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sectionElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((target: string) => {
    const targetId = target.replace('#', '');
    if (targetId !== 'top') {
      clickTargetRef.current = targetId;
      setActiveSection(targetId);
    }
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  }, [lenis]);

  return (
    <motion.div
      className="fixed py-6 sm:py-8 px-6 sm:px-8 w-full max-w-[100vw] flex justify-between items-center text-[1.4rem] z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      <Logo scrollTo={scrollTo} />
      <div className='hidden nav:block absolute left-1/2 -translate-x-1/2'>
        <NavLinks scrollTo={scrollTo} dict={dict} activeSection={activeSection} />
      </div>
      <div className="flex items-center gap-4">
        <CTA dict={dict} />
      </div>
    </motion.div>
  );
}

function Logo({ scrollTo }: { scrollTo: (target: string) => void }) {
  return (
    <motion.div
      className="flex items-center cursor-pointer gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      onClick={() => scrollTo('top')}
    >
      <Image
        className="rounded-md w-12 sm:w-15 opacity-90"
        src={'/logo.png'}
        alt={'logo'}
        width={735}
        height={485}
      />
    </motion.div>
  )
}

function CTA({ dict }: { dict: NavDict }) {
  return (
    <BookingWrapper theme="light">
      <motion.div
        className="inline-block h-full"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={transition}
      >
        <GetInTouchCTA arrow={true}>{dict.getInTouch}</GetInTouchCTA>
      </motion.div>
    </BookingWrapper>
  )
}

function NavLinks({
  scrollTo,
  dict,
  activeSection
}: {
  scrollTo: (target: string) => void,
  dict: NavDict,
  activeSection: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Measure the active link's position
  useLayoutEffect(() => {
    if (activeSection && linkRefs.current[activeSection] && containerRef.current) {
      const link = linkRefs.current[activeSection]!;

      setIndicatorStyle({
        left: link.offsetLeft,
        width: link.offsetWidth
      });
    }
  }, [activeSection, dict]);

  return (
    <motion.div
      ref={containerRef}
      className="flex rounded-full bg-secondary p-2 px-2 shadow relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {/* Single indicator - never unmounts, just animates opacity */}
      <motion.div
        className="absolute top-2 bottom-2 bg-primary/20 rounded-full"
        animate={{
          opacity: activeSection ? 1 : 0,
          left: indicatorStyle.left,
          width: indicatorStyle.width
        }}
        transition={{
          opacity: { duration: 0.2 },
          left: { type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
          width: { type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
        }}
      />

      {sections.map((section) => (
        <a
          key={section}
          ref={(el) => { linkRefs.current[section] = el; }}
          href={`#${section}`}
          onClick={(e) => { e.preventDefault(); scrollTo(`#${section}`); }}
          className="tracking-wide relative cursor-pointer text-lg z-10 px-4 py-1 group"
        >
          {dict[section]}
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-primary/50 rounded-full transition-all duration-200 w-0 group-hover:w-6" />
        </a>
      ))}
    </motion.div>
  )
}
