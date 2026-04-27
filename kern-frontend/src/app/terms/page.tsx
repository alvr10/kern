import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';

export default function TermsOfService(): React.JSX.Element {
  return (
    <LegalLayout activePath="/terms">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        Términos de Servicio
      </h1>
      <p className="text-sm opacity-60 mb-16">
        Última actualización: 12 de Marzo de 2026
      </p>

      <div className="space-y-12 text-base leading-relaxed font-light" style={{ opacity: 0.8 }}>
        <section>
          <h2 className="text-xl font-medium mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder o utilizar KERN (la &quot;Plataforma&quot;), usted acepta estar sujeto a estos Términos de Servicio.
            Si no está de acuerdo con alguna parte de estos términos, no podrá acceder a la Plataforma.
            KERN es un proyecto universitario y no representa una entidad comercial real.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Uso de la Plataforma</h2>
          <p className="mb-4">
            La Plataforma proporciona herramientas para la gestión y programación de contenido de marketing.
            Usted se compromete a utilizar la Plataforma exclusivamente para fines lícitos y de acuerdo con
            todas las leyes y regulaciones locales e internacionales aplicables.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>No debe transmitir ningún gusano, virus o código de naturaleza destructiva.</li>
            <li>No debe intentar obtener acceso no autorizado a los sistemas de KERN.</li>
            <li>El contenido subido es responsabilidad exclusiva del usuario.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Cuentas de Usuario y Organizaciones</h2>
          <p>
            Para utilizar ciertas funciones de la Plataforma, debe crear una cuenta. Usted es responsable de
            mantener la confidencialidad de su cuenta y contraseña. Las Organizaciones creadas en KERN
            comparten la responsabilidad del contenido gestionado por sus miembros.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Propiedad Intelectual</h2>
          <p>
            El servicio y su contenido original (excluyendo el contenido proporcionado por los usuarios),
            características y funcionalidad son y seguirán siendo propiedad exclusiva de KERN y sus licenciantes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">5. Limitación de Responsabilidad</h2>
          <p>
            En ningún caso KERN, ni sus directores, empleados o afiliados, serán responsables de ningún daño
            indirecto, incidental, especial, consecuente o punitivo resultante de su uso o incapacidad para
            utilizar la Plataforma. Este es un entorno de simulación académica.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
