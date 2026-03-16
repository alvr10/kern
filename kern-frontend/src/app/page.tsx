'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { Menu } from '../components/menu/menu';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const organizationRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const lenis = new Lenis();

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Hero scaling animation
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

    // Pin Hero
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    // Organization section title animation
    gsap.to('.org-title', {
      scrollTrigger: {
        trigger: organizationRef.current,
        start: 'top top',
        end: '+=60%',
        scrub: true,
      },
      opacity: 0,
      y: -100,
    });

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, { scope: containerRef });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
      <Menu />
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative overflow-hidden">
        <section className={styles.hero}>
          <div className={styles.revealOverlay}></div>
          <video autoPlay loop muted playsInline className={styles.videoBackground}>
            <source src="/videos/hero-video.mp4" type="video/mp4" />
          </video>
          <div className={styles.grain}></div>
          <div className={styles.container}>
            <div className={styles.grid}>
              <h1 className={styles.title}>
                Plataforma KERN <br />
                <span className={styles.titleDesc}>Donde empieza la creación.</span>
              </h1>
              <div className={styles.buttonWrapper}>
                <button className={styles.actionButton}>Comenzar a explorar</button>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.statement1}>La claridad empieza preguntando.</div>
              <div className={styles.statement2}>KERN ©2026</div>
              <div className={styles.paragraphs}>
                <p>El descubrimiento no siempre empieza con conocimiento - empieza con estructura. El contexto que guía al entendimiento hacia adelante.</p>
                <p>KERN es tu compañero para la distribución. Una interfaz calmada para hacer mejores estrategias de publicación. Menos ruido. Más significado.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Organization Section */}
      <div className="org-section relative z-10">
        <section 
          ref={organizationRef} 
          className="relative w-full bg-zinc-50 flex flex-col items-center pt-32 md:pt-48 pb-[20vh] overflow-hidden"
        >
          <div className="w-full px-6 flex flex-col items-center z-10 mb-[20vh] org-title sticky top-[15vh]">
            <h2 className="text-6xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter text-center leading-[0.85] text-zinc-900">
              ENTRA AL <br/>
              <span className="text-zinc-400">PLAYGROUND</span>
            </h2>
          </div>
          <div className="relative z-20 overflow-hidden shadow-2xl w-[85vw] md:w-[75vw] h-[45vh] md:h-[55vh] rounded-[2rem] bg-zinc-200 mt-12 md:mt-24">
            <Image
              src="/images/organization.png"
              alt="KERN Dashboard"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </section>
      </div>
    </main>
  );
}
