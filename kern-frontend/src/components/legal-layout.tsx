import React from 'react';
import Link from 'next/link';
import { Menu } from './menu/menu';
import { SmoothScroll } from './smooth-scroll';

interface LegalLayoutProps {
  children: React.ReactNode;
  activePath: string;
}

export function LegalLayout({ children, activePath }: LegalLayoutProps): React.JSX.Element {
  const links = [
    { name: 'Términos de Servicio', path: '/terms' },
    { name: 'Política de Privacidad (RGPD)', path: '/privacy' },
    { name: 'Política de Cookies', path: '/cookies' },
    { name: 'Aviso Legal', path: '/legal-notice' },
  ];

  return (
    <SmoothScroll>
      <Menu />
      <main style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--foreground)' }} className="py-32 px-6 md:px-12 lg:px-24 flex justify-center">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12">

        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <div className="mb-8">
              <Link
                href="/"
                className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
              >
                ← Volver al inicio
              </Link>
            </div>
            <nav className="flex flex-col gap-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold opacity-50 mb-2">Documentos Legales</h3>
              {links.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm transition-opacity ${
                    activePath === link.path ? 'opacity-100 font-medium' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          {children}
          
          <div className="mt-24 pt-8 text-xs opacity-50" style={{ borderTop: '1px solid rgba(128,128,128,0.2)' }}>
            <p>© 2026 KERN. Proyecto Universitario. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </main>
    </SmoothScroll>
  );
}
