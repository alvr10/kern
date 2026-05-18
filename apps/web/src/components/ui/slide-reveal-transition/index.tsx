"use client";

import {
  useLayoutEffect,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import styles from "./slide-reveal-transition.module.css";

// ─── Context ────────────────────────────────────────────────────────────────

interface SlideRevealContextType {
  navigate: (href: string) => void;
}

const SlideRevealContext = createContext<SlideRevealContextType>({
  navigate: () => {},
});

export function useSlideRevealTransition() {
  return useContext(SlideRevealContext);
}

// ─── SlideRevealTransition ───────────────────────────────────────────────────

interface SlideRevealTransitionProps {
  children: React.ReactNode;
}

/**
 * SlideRevealTransition — Transition that "shrinks" the old page upward
 * while revealing the new one with a clip-path effect.
 * Based on the native View Transition API.
 */
export default function SlideRevealTransition({
  children,
}: SlideRevealTransitionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const finishTransition = useRef<(() => void) | null>(null);

  // On route change → resolve the promise to complete the View Transition
  useLayoutEffect(() => {
    if (finishTransition.current) {
      finishTransition.current();
      finishTransition.current = null;
    }
  }, [pathname]);

  // Navigation function with View Transition
  const navigate = useCallback(
    (href: string) => {
      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(() => {
        return new Promise<void>((resolve) => {
          finishTransition.current = resolve;
          router.push(href);
        });
      });
    },
    [router],
  );

  return (
    <SlideRevealContext.Provider value={{ navigate }}>
      <div className={styles.wrapper}>{children}</div>
    </SlideRevealContext.Provider>
  );
}

// ─── Entrance Animations Hook ──────────────────────────────────────────

/**
 * useEntranceAnimations — Hook to trigger GSAP animations
 * after the page transition ends.
 */
export function useEntranceAnimations() {
  const pathname = usePathname();

  const playEntrance = useCallback(() => {
    // 1. Navigation links animation
    const links = document.querySelectorAll(".transition-link");
    if (links.length > 0) {
      gsap.fromTo(
        links,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.2,
        },
      );
    }

    // 2. Title animation (Hero)
    const heroes = document.querySelectorAll(".transition-hero");
    if (heroes.length > 0) {
      gsap.fromTo(
        heroes,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.3 },
      );
    }

    // 3. Paragraph animation
    const infos = document.querySelectorAll(".transition-info");
    if (infos.length > 0) {
      gsap.fromTo(
        infos,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.4 },
      );
    }
  }, []);

  useLayoutEffect(() => {
    playEntrance();
  }, [pathname, playEntrance]);

  return { playEntrance };
}
