"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

interface TextBlockRevealProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

export default function TextBlockReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#000",
  stagger = 0.15,
  duration = 0.75,
}: TextBlockRevealProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitText[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);
  const blocksRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

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
        if (element.style.position !== "absolute" && element.style.position !== "fixed") {
          element.style.position = "relative";
        }

        const split = SplitText.create(element, {
          type: "lines",
        });

        splitRefs.current.push(split);

        (split.lines as HTMLElement[]).forEach((line) => {
          const content = line.innerHTML;
          line.innerHTML = `
            <div class="block-line-inner" style="position: relative; display: block; width: 100%; overflow: hidden;">
              <div class="block-line-text" style="opacity: 0;">${content}</div>
              <div class="block-revealer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2; background-color: ${blockColor}; transform: scaleX(0); transform-origin: left center; pointer-events: none;"></div>
            </div>`;

          const text = line.querySelector(".block-line-text") as HTMLElement;
          const block = line.querySelector(".block-revealer") as HTMLElement;

          if (text && block) {
            linesRef.current.push(text);
            blocksRef.current.push(block);
          }
        });
      });

      const createBlockRevealAnimation = (block: HTMLElement, text: HTMLElement, index: number): gsap.core.Timeline => {
        const tl = gsap.timeline({ 
          delay: delay + index * stagger,
          defaults: { ease: "power4.inOut", duration: duration }
        });

        tl.to(block, { scaleX: 1 })
          .set(text, { opacity: 1 })
          .set(block, { transformOrigin: "right center" })
          .to(block, { scaleX: 0 });

        return tl;
      };

      if (animateOnScroll) {
        const masterTl = gsap.timeline({ paused: true });
        
        blocksRef.current.forEach((block, index) => {
          masterTl.add(
            createBlockRevealAnimation(block, linesRef.current[index], index),
            0 // All start at masterTl's floor, but have internal delays
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

      return () => {
        splitRefs.current.forEach((split) => split?.revert());

        const wrappers = containerRef.current?.querySelectorAll(
          ".block-line-wrapper"
        );
        wrappers?.forEach((wrapper) => {
          if (wrapper.parentNode && wrapper.firstChild) {
            wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
            wrapper.remove();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, blockColor, stagger, duration],
    }
  );

  if (React.Children.count(children) === 1 && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}