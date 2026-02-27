"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

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
      <h1 className="hero-title-3xl text-8xl xl:text-[8.5rem]">
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
      <div className="mt-auto flex justify-between">
        <div className="text-3xl">
          <p>
          Your first impression is your only impression.
          </p>
          <p>
            We bridge the gap between complex ideas and elegant web solutions.
          </p>
        </div>
        <div>
          <HeroBottomCTA />
        </div>
      </div>
    </div>
  );
}

function HeroBottomCTA() {
  return (
    <div></div>
  )
}
