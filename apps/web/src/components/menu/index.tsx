'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useSlideRevealTransition } from '@/components/ui/slide-reveal-transition';
import styles from './menu.module.css';

const scrambleText = (elements: Element[], duration = 0.2) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

  elements.forEach(char => {
    const originalText = char.getAttribute('data-char') || char.textContent || '';

    // Skip empty spaces
    if (originalText.trim() === '') return;

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
  const { navigate } = useSlideRevealTransition();

  const handleMouseEnter = () => {
    if (!linkRef.current) return;
    const linkChars = gsap.utils.toArray('.scramble-char', linkRef.current) as Element[];
    linkChars.forEach((char, index) => {
      window.setTimeout(() => {
        scrambleText([char], 0.4);
      }, index * 30);
    });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (href.startsWith('#')) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} className={styles.link} ref={linkRef} onMouseEnter={handleMouseEnter} onClick={handleClick}>
      {/* Hidden robust original word ensures spacing/width stays completely fixed during scrambling */}
      <span style={{ visibility: 'hidden' }}>{text}</span>

      {/* Absolute floating scrambler avoids pushing out the grid constraints */}
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          whiteSpace: 'nowrap',
          display: 'flex',
        }}
      >
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
  const navBarRef = useRef<HTMLElement>(null);
  const { navigate } = useSlideRevealTransition();

  useGSAP(
    () => {
      // Determine the natural target width of the navbar
      const navBar = navBarRef.current;
      if (!navBar) return;

      // Cache the original style so we can measure auto width
      navBar.style.width = 'max-content';
      const compactWidth = navBar.getBoundingClientRect().width + 100;
      navBar.style.width = '90vw';

      let isCompact = false;

      const handleScroll = () => {
        const scrolled = window.scrollY > 150;
        if (scrolled !== isCompact) {
          isCompact = scrolled;
          gsap.to(navBar, {
            width: isCompact ? compactWidth : '90vw',
            duration: 1.2,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    },
    { scope: headerRef },
  );

  useGSAP(
    () => {
      // Basic drop-down + fade-in on load
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.1,
      });
    },
    { scope: headerRef },
  );

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleSignupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <header className={styles.header} ref={headerRef}>
      <nav className={styles.navBar} ref={navBarRef}>
        <Link href="/" className={styles.logo} onClick={handleLogoClick}>
          KERN
        </Link>
        <div className={`${styles.links} link`}>
          <HoverScrambleLink text="Cómo funciona" href="#how-it-works" />
          <HoverScrambleLink text="Precios" href="#pricing" />
          <HoverScrambleLink text="Casos de uso" href="#use-cases" />
        </div>
        <div className={`${styles.authLinks} link`}>
          <Link href="/login" className={styles.loginButton} onClick={handleLoginClick}>
            Iniciar Sesión
          </Link>
          <Link href="/signup" className={styles.signupButton} onClick={handleSignupClick}>
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
}
