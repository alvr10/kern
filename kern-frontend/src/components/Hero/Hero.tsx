import React from 'react';
import styles from './Hero.module.css';

export function Hero(): React.JSX.Element {
  return (
    <section className={styles.hero}>
      {/* Reveal Overlay */}
      <div className={styles.revealOverlay}></div>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className={styles.videoBackground}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>

      {/* Grain Overlay */}
      <div className={styles.grain}></div>

      {/* Hero Content Container */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Main Content: Title & Subtitle. */}
          <h1 className={styles.title}>
            Plataforma KERN <br />
            <span className={styles.titleDesc}>Donde empieza la creación.</span>
          </h1>

          {/* Action Button */}
          <div className={styles.buttonWrapper}>
            <button className={styles.actionButton}>
              Comenzar a explorar
            </button>
          </div>

          {/* Separator Line */}
          <div className={styles.separator}></div>

          {/* Bottom Statements */}
          <div className={styles.statement1}>
            La claridad empieza preguntando.
          </div>
          <div className={styles.statement2}>
            KERN ©2026
          </div>

          {/* Explanatory Paragraphs */}
          <div className={styles.paragraphs}>
            <p>
              El descubrimiento no siempre empieza con conocimiento - empieza con estructura. El contexto que guía al entendimiento hacia adelante.
            </p>
            <p>
              KERN es tu compañero para la distribución. Una interfaz calmada para hacer mejores estrategias de publicación. Menos ruido. Más significado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
