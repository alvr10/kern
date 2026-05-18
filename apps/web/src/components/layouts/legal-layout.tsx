import React from 'react';
import Link from 'next/link';
import { Menu } from '@/components/menu';
import { SmoothScroll } from '@/components/smooth-scroll';

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
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
        className="flex justify-center px-6 py-32 md:px-12 lg:px-24"
      >
        <div className="flex w-full max-w-5xl flex-col gap-12 md:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="sticky top-24">
              <div className="mb-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm font-medium opacity-60 transition-opacity hover:opacity-100"
                >
                  ← Volver al inicio
                </Link>
              </div>
              <nav className="flex flex-col gap-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-50">Documentos Legales</h3>
                {links.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm transition-opacity ${
                      activePath === link.path ? 'font-medium opacity-100' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="max-w-3xl flex-1">
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
