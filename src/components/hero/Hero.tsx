"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowDownRight } from "lucide-react";

gsap.registerPlugin(SplitText);

type HeroDict = {
  line1: string;
  line2: string;
};

const rotatingWords = ["Great", "Fast", "Smart", "Awesome", "Beautiful", "Amazing"];

export default function Hero({ dict }: { dict: HeroDict }) {
  const container = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const rotatorRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-line",
      { opacity: 0, y: 30, color: "#1c2aff" },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.4,
        stagger: 0.075,
        ease: "power4.out",
      }
    );

    gsap.to(".hero-line", {
      color: "#000",
      duration: 2.5,
      delay: 1.4,
      stagger: 0.075,
      ease: "power2.out",
    });

    gsap.fromTo(
      ".hero-tagline",
      { opacity: 0, y: 30, color: "#1c2aff" },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.6,
        stagger: 0.05,
        ease: "power4.out",
      }
    );

    gsap.to(".hero-tagline", {
      color: "#000",
      duration: 1.6,
      delay: 1.6,
      stagger: 0.05,
      ease: "power2.out",
    });

    gsap.fromTo(
      ".hero-cta",
      { opacity: 0, x: 20, y: 10, scale: 0.95 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        delay: 1.6,
        ease: "power2.out",
      }
    );

    const el = rotatorRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    wrapper.style.width = "auto";
    const measureWidth = (word: string) => {
      el.textContent = word;
      return el.getBoundingClientRect().width + 20;
    };

    const widths = rotatingWords.map(measureWidth);
    el.textContent = rotatingWords[0];
    wrapper.style.width = `${widths[0]}px`;

    let split = SplitText.create(el, { type: "chars" });
    let current = 0;

    const swap = () => {
      const next = (current + 1) % rotatingWords.length;
      const outChars = split.chars;
      const growing = widths[next] >= widths[current];

      const tl = gsap.timeline({
        onComplete: () => {
          current = next;
        },
      });

      if (growing) {
        tl.to(wrapper, {
          width: widths[next],
          duration: 0.3,
          ease: "power3.inOut",
        }, 0);
      }

      tl.to(outChars, {
        y: "-100%",
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: "power3.in",
      }, 0);

      if (!growing) {
        tl.to(wrapper, {
          width: widths[next],
          duration: 0.3,
          ease: "power3.inOut",
        });
      }

      tl.call(() => {
        split.revert();
        el.textContent = rotatingWords[next];
        split = SplitText.create(el, { type: "chars" });
        gsap.set(split.chars, { y: "100%", opacity: 0, color: "#1c2aff" });

        gsap.to(split.chars, {
          y: "0%",
          opacity: 1,
          duration: 0.45,
          stagger: 0.03,
          ease: "power3.out",
        });

        gsap.to(split.chars, {
          color: "#000",
          duration: 2,
          stagger: 0.03,
          ease: "power2.out",
        });
      });
    };

    const interval = setInterval(swap, 6000);
    return () => {
      clearInterval(interval);
      split.revert();
    };
  }, { scope: container });

  return (
    <div ref={container} className="relative h-screen z-10 main-inner px-12 pt-36 pb-16 flex flex-col justify-between">
      <h1 className="text-8xl xl:text-[8.5rem]">
        <div className="hero-line opacity-0">
          Let&apos;s make the web
        </div>
        <div className="hero-line opacity-0 whitespace-nowrap">
          <span ref={wrapperRef} className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
            <span ref={rotatorRef} className="inline-block italic">
              {rotatingWords[0]}
            </span>
          </span>
          {" "}again
        </div>
      </h1>
      <div className="mt-auto flex justify-between items-end gap-8">
        <div className="text-3xl">
          <p className="hero-tagline opacity-0">
            Building next-generation software.
          </p>
          <p className="hero-tagline opacity-0">
            Give your customers a digital experience they won't forget.
          </p>
        </div>
        <ProjectCTA />
      </div>
    </div>
  );
}

function ProjectCTA() {
  const textCubeRef = useRef<HTMLDivElement>(null);
  const arrowCubeRef = useRef<HTMLDivElement>(null);
  const hoverTl = useRef<gsap.core.Timeline | null>(null);

  const halfH = 28;

  const handleEnter = useCallback(() => {
    hoverTl.current?.kill();
    gsap.killTweensOf([textCubeRef.current, arrowCubeRef.current]);

    const tl = gsap.timeline();
    hoverTl.current = tl;

    tl.to(textCubeRef.current, {
      rotateX: -90,
      z: -halfH,
      duration: 0.45,
      ease: "power3.inOut",
    }, 0);

    tl.to(arrowCubeRef.current, {
      rotateX: 90,
      z: -halfH,
      duration: 0.45,
      ease: "power3.inOut",
    }, 0);
  }, []);

  const handleLeave = useCallback(() => {
    hoverTl.current?.kill();
    gsap.killTweensOf([textCubeRef.current, arrowCubeRef.current]);

    const tl = gsap.timeline();
    hoverTl.current = tl;

    tl.to(textCubeRef.current, {
      rotateX: 0,
      z: -halfH,
      duration: 0.45,
      ease: "power3.inOut",
    }, 0);

    tl.to(arrowCubeRef.current, {
      rotateX: 0,
      z: -halfH,
      duration: 0.45,
      ease: "power3.inOut",
    }, 0);
  }, []);

  const faceStyle = (rX: number): React.CSSProperties => ({
    backfaceVisibility: "hidden",
    transform: `rotateX(${rX}deg) translateZ(${halfH}px)`,
  });

  return (
    <a
      href="#contact"
      className="hero-cta opacity-0 group relative flex items-center self-end shrink-0 rounded-lg"
      style={{
        perspective: "800px",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Text cube */}
      <span className="relative h-14 overflow-hidden rounded-l-lg" style={{ perspective: "800px" }}>
        <span className="invisible font-medium font-mono px-5 h-14 flex items-center">
          START A PROJECT
        </span>
        <div
          ref={textCubeRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(-${halfH}px)` }}
        >
          {/* Front */}
          <span
            className="absolute inset-0 flex items-center px-5 rounded-l-lg"
            style={{
              ...faceStyle(0),
              background: "rgba(255, 255, 255, 0.21)",
              backdropFilter: "blur(17px)",
              WebkitBackdropFilter: "blur(17px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 12px 6px rgba(255, 255, 255, 0.15)",
            }}
          >
            <span className="font-medium font-mono">START A PROJECT</span>
          </span>
          {/* Top face (revealed when rotating forward) */}
          <span
            className="absolute inset-0 flex items-center px-5 bg-black text-white rounded-l-lg"
            style={faceStyle(90)}
          >
            <span className="font-medium font-mono">START A PROJECT</span>
          </span>
        </div>
      </span>

      {/* Arrow cube */}
      <span className="relative w-14 h-14 overflow-hidden rounded-r-lg" style={{ perspective: "800px" }}>
        <div
          ref={arrowCubeRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", transform: `translateZ(-${halfH}px)` }}
        >
          {/* Front */}
          <span
            className="absolute inset-0 flex items-center justify-center bg-brand text-white rounded-r-lg"
            style={faceStyle(0)}
          >
            <ArrowDownRight className="w-6 h-6" />
          </span>
          {/* Bottom face (revealed when rotating backward) */}
          <span
            className="absolute inset-0 flex items-center justify-center bg-yellow text-white rounded-r-lg"
            style={{
              ...faceStyle(-90),
              background: "rgba(255, 255, 255, 0.21)",
              backdropFilter: "blur(80px)",
              WebkitBackdropFilter: "blur(80px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 12px 6px rgba(255, 255, 255, 0.15)",
            }}
          >
            <ArrowDownRight className="w-6 h-6" />
          </span>
        </div>
      </span>
    </a>
  );
}