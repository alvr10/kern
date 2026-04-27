"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Menu } from "@/components/menu";
import { SmoothScroll } from "@/components/smooth-scroll";
import TextBlockReveal from "@/components/ui/text-block-reveal";
import styles from "./page.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Home(): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const organizationRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero scaling animation
      gsap.to(heroRef.current, {
        scale: 0.8,
        borderRadius: "3rem",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "50% top",
          scrub: true,
        },
      });

      // Pin Hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
      });

      // Organization section title animation
      gsap.to(".org-title", {
        scrollTrigger: {
          trigger: organizationRef.current,
          start: "top top",
          end: "+=60%",
          scrub: true,
        },
        opacity: 0,
        y: -100,
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <SmoothScroll>
      <main ref={containerRef} style={{ backgroundColor: "var(--background)" }}>
        <Menu />

        {/* Hero Section */}
        <div ref={heroRef} className="relative overflow-hidden">
          <section className={styles.hero}>
            <div className={styles.revealOverlay}></div>
            <video
              autoPlay
              loop
              muted
              playsInline
              className={styles.videoBackground}
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            <div className={styles.grain}></div>
            <div className={styles.container}>
              <div className={styles.grid}>
                <h1 className={styles.title}>
                  Plataforma KERN <br />
                  <span className={styles.titleDesc}>
                    Donde empieza la creación.
                  </span>
                </h1>
                <div className={styles.buttonWrapper}>
                  <button className={styles.actionButton}>
                    Comenzar a explorar
                  </button>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.statement1}>
                  La claridad empieza preguntando.
                </div>
                <div className={styles.statement2}>KERN ©2026</div>
                <div className={styles.paragraphs}>
                  <p>
                    El descubrimiento no siempre empieza con conocimiento -
                    empieza con estructura. El contexto que guía al
                    entendimiento hacia adelante.
                  </p>
                  <p>
                    KERN es tu compañero para la distribución. Una interfaz
                    calmada para hacer mejores estrategias de publicación. Menos
                    ruido. Más significado.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Organization Section */}
        <div className="org-section relative z-10">
          <section
            ref={organizationRef}
            className="relative flex w-full flex-col items-center overflow-hidden bg-zinc-50 pb-[20vh] pt-32 md:pt-48"
          >
            <div className="org-title sticky top-[15vh] z-10 mb-[20vh] flex w-full flex-col items-center px-6">
              <TextBlockReveal blockColor="#18181b">
                <h2 className="text-center text-6xl font-black uppercase leading-[0.85] tracking-tighter text-zinc-900 md:text-8xl lg:text-[10vw]">
                  ENTRA AL <br />
                  <span className="text-zinc-400">PLAYGROUND</span>
                </h2>
              </TextBlockReveal>
            </div>
            <div className="relative z-20 mt-12 h-[45vh] w-[85vw] overflow-hidden rounded-[2rem] bg-zinc-200 shadow-2xl md:mt-24 md:h-[55vh] md:w-[75vw]">
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
    </SmoothScroll>
  );
}
