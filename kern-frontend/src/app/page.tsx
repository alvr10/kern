'use client';

import React, { useRef } from 'react';
import { Hero } from '../components/Hero';
import { Menu } from '../components/Menu';
import { OrganizationSection } from '../components/OrganizationSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function Home(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initialize Lenis
    const lenis = new Lenis();

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Scroll animation for Hero: Scale down and round corners
    gsap.to(heroRef.current, {
      scale: 0.8,
      borderRadius: '3rem',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '50% top',
        scrub: true,
      }
    });

    // Pin the Hero section
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    // Force a refresh after all ScrollTriggers are created so GSAP can calculate positions correctly
    // alongside Lenis smooth scrolling.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, { scope: containerRef });

  // On page load/reload, ensure we don't restore scroll to a middle point 
  // which often breaks complex pinned and scaled GSAP layouts.
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      <Menu />
      <div ref={heroRef} className="relative overflow-hidden">
        <Hero />
      </div>
      <div className="org-section relative z-10">
        <OrganizationSection />
      </div>
    </main>
  );
}
