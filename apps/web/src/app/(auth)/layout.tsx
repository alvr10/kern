'use client';

import React from 'react';
import Link from 'next/link';
import styles from './auth.module.css';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      {/* Left Section: Logo and Form */}
      <section className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          KERN
        </Link>
        <div className={styles.formWrapper}>{children}</div>
      </section>

      {/* Right Section: Quote */}
      <section className={styles.rightSection}>
        <div className={styles.quoteContainer}>
          <blockquote className={styles.quote}>
            &quot;El descubrimiento no siempre empieza con conocimiento - empieza con estructura. El contexto es lo que
            guía el entendimiento hacia adelante.&quot;
          </blockquote>
          <cite className={styles.author}>CEO of KERN</cite>
        </div>

        {/* Subtle background decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            fontSize: '30vw',
            fontWeight: 900,
            opacity: 0.03,
            color: '#fff',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          KERN
        </div>
      </section>
    </div>
  );
}
