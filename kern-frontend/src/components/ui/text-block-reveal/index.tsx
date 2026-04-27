"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./text-block-reveal.module.css";

// Safe plugin registration
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export interface TextBlockRevealProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

/**
 * TextBlockReveal component that reveals text with a block animation.
 * Requires GSAP SplitText plugin.
 */
export default function TextBlockReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "var(--foreground, #000)",
  stagger = 0.15,
  duration = 0.75,
}: TextBlockRevealProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitText[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current || !SplitText) return;

      // Cleanup of previous splits
      splitRefs.current.forEach((split) => {
        if (split && typeof split.revert === "function") {
          split.revert();
        }
      });
      splitRefs.current = [];
      linesRef.current = [];
      blocksRef.current = [];

      let elements: HTMLElement[] = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children) as HTMLElement[];
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        if (
          element.style.position !== "absolute" &&
          element.style.position !== "fixed"
        ) {
          element.style.position = "relative";
        }

        // Use SplitText.create as in the original snippet for maximum compatibility
        const split = SplitText.create(element, {
          type: "lines",
        });

        splitRefs.current.push(split);

        (split.lines as HTMLElement[]).forEach((line) => {
          const content = line.innerHTML;
          line.innerHTML = `
            <div class="${styles.blockLineInner}">
              <div class="${styles.blockLineText}">${content}</div>
              <div class="${styles.blockRevealer}" style="background-color: ${blockColor};"></div>
            </div>`;

          const text = line.querySelector(
            `.${styles.blockLineText}`,
          ) as HTMLElement;
          const block = line.querySelector(
            `.${styles.blockRevealer}`,
          ) as HTMLElement;

          if (text && block) {
            linesRef.current.push(text);
            blocksRef.current.push(block);
          }
        });
      });

      const createBlockRevealAnimation = (
        block: HTMLElement,
        text: HTMLElement,
        index: number,
      ): gsap.core.Timeline => {
        const tl = gsap.timeline({
          delay: delay + index * stagger,
          defaults: { ease: "power4.inOut", duration: duration },
        });

        tl.to(block, { scaleX: 1 })
          .set(text, { opacity: 1 })
          .set(block, { transformOrigin: "right center" })
          .to(block, { scaleX: 0 });

        return tl;
      };

      if (animateOnScroll && blocksRef.current.length > 0) {
        const masterTl = gsap.timeline({ paused: true });

        blocksRef.current.forEach((block, index) => {
          masterTl.add(
            createBlockRevealAnimation(block, linesRef.current[index], index),
            0,
          );
        });

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
          onEnter: () => masterTl.play(),
        });
      } else {
        blocksRef.current.forEach((block, index) => {
          createBlockRevealAnimation(block, linesRef.current[index], index);
        });
      }

      // Cleanup function for useGSAP
      return () => {
        splitRefs.current.forEach((split) => {
          if (split && typeof split.revert === "function") {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, stagger, duration],
    },
  );

  if (React.Children.count(children) === 1 && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{
        ref: React.RefObject<HTMLDivElement | null>;
      }>,
      // eslint-disable-next-line react-hooks/refs
      {
        ref: containerRef,
      },
    );
  }

  return (
    <div
      ref={containerRef}
      data-copy-wrapper="true"
      className={styles.container}
    >
      {children}
    </div>
  );
}
