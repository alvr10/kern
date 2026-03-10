import React from 'react';
import styles from './Hero.module.css';

export function Hero(): React.JSX.Element {
  return (
    <section className={styles.hero}>
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

      {/* Hero Content Container */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Main Content: Title & Subtitle. Spanning 8 columns */}
          <div className={styles.mainContent}>
            <h1 className={styles.title}>
              Shape the <br />
              Future of <br />
              Marketing
            </h1>
            <p className={styles.subtitle}>
              The ultimate marketing playground for teams. Centralize, organize, and execute your content scheduling with KERN.
            </p>
          </div>

          {/* Secondary Content: Quotes. Spanning 4 columns */}
          <div className={styles.quotes}>
            <p className={styles.quoteText}>
              &quot;KERN transformed how our entire marketing team collaborates on content distribution and creative pipelines.&quot;
            </p>
            <p className={styles.quoteAuthor}>— Marketing Lead, KERN</p>
          </div>
        </div>
      </div>
    </section>
  );
}
