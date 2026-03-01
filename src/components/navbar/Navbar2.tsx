"use client";

import React, { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRightIcon, Plus } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Navbar2() {
  const navRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heroEnd = 1.4 + 1 + 0.075;

    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -20, visibility: "visible" },
      {
        opacity: 1,
        y: 0,
        duration: heroEnd - 1.8,
        delay: 1.8,
        ease: "power4.out",
      }
    );
  });

  return (
    <div className='fixed top-8 w-full z-50 font-mono invisible'>
      <div className='main-inner px-12'>
        <div ref={navRef} className='flex items-center justify-between rounded-lg backdrop-blur-[80px]'>
          {/* Logo */}
          <div className='w-fit ml-2'>
            <Link href='/'>
              <Image src='/coding.svg' alt='logo' width={40} height={40} />
            </Link>
          </div>
          {/* Navbar Links */}
          <div className='flex items-center gap-2'>
            <NavbarButton>SERVICES <Plus className='w-4 h-4 ml-2' /></NavbarButton>
            <NavbarButton>ABOUT</NavbarButton>
            <NavbarButton>AI FAQ</NavbarButton>
          </div>
          {/* CTA Button */}
          <div className='py-1 pr-1'>
            <CTAButton className=''>GET FREE DESIGN <ArrowRightIcon className='w-4 h-4 ml-2' /></CTAButton>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavbarButton({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <button className={cn('bg-white/15 hover:bg-white/40 rounded-md h-8 px-4 text-sm cursor-pointer flex items-center justify-center text-center transition-colors', className)}>
      {children}
    </button>
  )
}

function CTAButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const hoverTl = useRef<gsap.core.Tween | null>(null);

  const handleEnter = useCallback(() => {
    hoverTl.current?.kill();
    gsap.killTweensOf(cubeRef.current);

    hoverTl.current = gsap.to(cubeRef.current, {
      rotateX: -90,
      z: -22,
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, []);

  const handleLeave = useCallback(() => {
    hoverTl.current?.kill();
    gsap.killTweensOf(cubeRef.current);

    hoverTl.current = gsap.to(cubeRef.current, {
      rotateX: 0,
      z: -22,
      duration: 0.45,
      ease: "power3.inOut",
    });
  }, []);

  const halfH = "22px";

  return (
    <button
      className={cn('relative w-fit px-4 h-11 text-white text-nowrap rounded-md text-sm cursor-pointer flex items-center justify-center text-center', className)}
      style={{ perspective: "600px" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={cubeRef}
        className="absolute inset-0 rounded-md"
        style={{ transformStyle: "preserve-3d", transform: "translateZ(-22px)" }}
      >
        {/* Front face */}
        <span
          className="absolute inset-0 flex items-center justify-center px-4 bg-brand rounded-md"
          style={{ backfaceVisibility: "hidden", transform: `translateZ(${halfH})` }}
        >
          <span className="flex items-center text-sm">{children}</span>
        </span>
        {/* Top face (revealed on hover) */}
        <span
          className="absolute inset-0 flex items-center justify-center px-4 bg-black rounded-md"
          style={{ backfaceVisibility: "hidden", transform: `rotateX(90deg) translateZ(${halfH})` }}
        >
          <span className="flex items-center text-sm">{children}</span>
        </span>
      </div>
      {/* Invisible spacer */}
      <span className="invisible flex items-center">{children}</span>
    </button>
  )
}