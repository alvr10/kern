"use client";

import { useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!("startViewTransition" in document)) {
      return;
    }

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.href.includes("#") &&
        !link.target &&
        !link.download &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        const url = new URL(link.href);
        const newPath = url.pathname;

        if (pathname === newPath) return;

        // Skip internal logic for home-to-home navigation if desired
        if (
          (pathname === "/") &&
          (newPath === "/")
        ) {
          return;
        }

        e.preventDefault();

        // @ts-ignore - View Transition API is experimental in some environments
        document.startViewTransition(async () => {
          await new Promise((resolve) => {
            startTransition(() => {
              router.push(link.href);
              // We need a small delay or a way to know React has committed the change.
              // In Next.js App Router, router.push is not a returned promise we can await for mounting.
              // However, startTransition helps the engine prioritize the update.
              resolve(true);
            });
          });
        });
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, [pathname, router, startTransition]);

  return <div className="page-transition-container">{children}</div>;
}
