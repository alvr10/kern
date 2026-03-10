"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './Menu.module.css';

const scrambleText = (elements: Element[], duration = 0.4) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  elements.forEach((char) => {
    const originalText = char.getAttribute("data-char") || char.textContent || "";
    
    // Skip empty spaces
    if (originalText.trim() === "") return;

    let iterations = 0;
    const maxIterations = Math.floor(Math.random() * 6) + 3;

    const scrambleInterval = window.setInterval(() => {
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      iterations++;

      if (iterations >= maxIterations) {
        window.clearInterval(scrambleInterval);
        char.textContent = originalText;
      }
    }, 25);

    window.setTimeout(() => {
      window.clearInterval(scrambleInterval);
      char.textContent = originalText;
    }, duration * 1000);
  });
};

function HoverScrambleLink({ text, href }: { text: string; href: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (!linkRef.current) return;
    const linkChars = gsap.utils.toArray('.scramble-char', linkRef.current) as Element[];
    linkChars.forEach((char, index) => {
      window.setTimeout(() => {
        scrambleText([char], 0.4);
      }, index * 30); 
    });
  };

  return (
    <Link href={href} className={styles.link} ref={linkRef} onMouseEnter={handleMouseEnter}>
      {/* Hidden robust original word ensures spacing/width stays completely fixed during scrambling */}
      <span style={{ visibility: 'hidden' }}>{text}</span>
      
      {/* Absolute floating scrambler avoids pushing out the grid constraints */}
      <span style={{ position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap', display: 'flex' }}>
        {text.split('').map((char, i) => (
          <span key={i} className="scramble-char" data-char={char}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </Link>
  );
}

export function Menu(): React.JSX.Element {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Basic drop-down + fade-in on load
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.1,
    });
  }, { scope: headerRef });

  return (
    <header className={styles.header} ref={headerRef}>
      <nav className={styles.navBar}>
        <Link href="/" className={styles.logo}>
          KERN
        </Link>
        <div className={styles.links}>
          <HoverScrambleLink text="How it works" href="#how-it-works" />
          <HoverScrambleLink text="Pricing" href="#pricing" />
          <HoverScrambleLink text="Use Cases" href="#use-cases" />
        </div>
      </nav>
    </header>
  );
}
