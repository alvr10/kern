import React from 'react';
import type { Metadata } from 'next';
import { Hero } from '../components/Hero';
import { Menu } from '../components/Menu';

export const metadata: Metadata = {
  title: 'KERN - Organize Content Scheduling',
  description: 'Marketing playground for marketing teams to organize content scheduling.',
};

export default function Home(): React.JSX.Element {
  return (
    <main>
      <Menu />
      <Hero />
    </main>
  );
}
