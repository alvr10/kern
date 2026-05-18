import type { Metadata } from "next";
import { Tenor_Sans, Inter, JetBrains_Mono } from "next/font/google";
import QueryProvider from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import SlideRevealTransition from "@/components/ui/slide-reveal-transition";
import { cn } from "@/lib/utils";
import "./globals.css";

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KERN",
  description:
    "Marketing playground for marketing teams to organize content scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        tenorSans.variable,
        inter.variable,
        jetbrainsMono.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <SlideRevealTransition>
            <QueryProvider>{children}</QueryProvider>
          </SlideRevealTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
