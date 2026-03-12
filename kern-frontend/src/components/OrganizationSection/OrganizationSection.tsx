'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export function OrganizationSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Parallax / fade out for the title as the user scrolls through the section
    gsap.to('.org-title', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=60%',
        scrub: true,
      },
      opacity: 0,
      y: -100,
    });
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative w-full bg-zinc-50 flex flex-col items-center pt-32 md:pt-48 pb-[20vh] overflow-hidden"
    >
      {/* Title */}
      <div className="w-full px-6 flex flex-col items-center z-10 mb-[20vh] org-title sticky top-[15vh]">
        <h2 className="text-6xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter text-center leading-[0.85] text-zinc-900">
          ENTRA AL <br/>
          <span className="text-zinc-400">PLAYGROUND</span>
        </h2>
      </div>

      {/* Picture Frame (Static sizing, keeping the 75vw / 55vh aspect visually) */}
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
  );
}
