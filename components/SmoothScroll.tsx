'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll behavior
    const handleWheel = (e: WheelEvent) => {
      // Prevent default only if we want custom behavior
      // For now, we'll use CSS smooth scroll + easing
    };

    // Add lerp-based smooth scrolling for a buttery feel
    let scrollY = 0;
    let currentScrollY = 0;
    let requestId: number | null = null;
    const ease = 0.075; // Lower = smoother

    const smoothScroll = () => {
      currentScrollY = window.scrollY;
      scrollY += (currentScrollY - scrollY) * ease;
      
      // Apply transforms to create parallax-like smoothness
      if (scrollRef.current) {
        const diff = Math.abs(currentScrollY - scrollY);
        if (diff > 0.5) {
          requestId = requestAnimationFrame(smoothScroll);
        }
      }
    };

    const handleScroll = () => {
      if (requestId === null) {
        requestId = requestAnimationFrame(smoothScroll);
      }
    };

    // Only add smooth scroll on desktop
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, []);

  return (
    <div ref={scrollRef} className="smooth-scroll-container">
      {children}
    </div>
  );
}
