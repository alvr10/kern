"use client";
import { ReactNode } from "react";
import PageTransition from "@/components/page-transition/page-transition";

interface TransitionProviderProps {
  children: ReactNode;
}

export default function TransitionProvider({
  children,
}: TransitionProviderProps) {
  return <PageTransition>{children}</PageTransition>;
}
