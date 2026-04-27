import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';

export default function PrivacyPolicy(): React.JSX.Element {
  return (
    <LegalLayout activePath="/privacy">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        Política de Privacidad (RGPD)
      </h1>
      <p className="text-sm opacity-60 mb-16">
        Última actualización: 12 de Marzo de 2026
      </p>

      <div className="space-y-12 text-base leading-relaxed font-light" style={{ opacity: 0.8 }}>
        <section>
          <h2 className="text-xl font-medium mb-4">1. Identidad del Responsable</h2>
          <p>
            En cumplimiento del Reglamento General de Protección de Datos (RGPD) de la UE, le informamos que el responsable 
            del tratamiento de los datos personales aquí simulados es KERN, un proyecto de índole puramente académico y 
            universitario sin fines comerciales reales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Datos Recopilados</h2>
          <p className="mb-4">
            Al utilizar nuestra plataforma ficticia, podríamos recopilar los siguientes datos a modo de simulación:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Datos de contacto (email, nombre de usuario).</li>
            <li>Información de metadatos sobre sus flujos de trabajo en los tableros Kanban simulados.</li>
            <li>Tokens de acceso o integración simulada con servicios de terceros.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Finalidad del Tratamiento</h2>
          <p>
            Los datos simulados recopilados tienen como única finalidad ilustrar el funcionamiento técnico de 
            una herramienta de gestión y marketing. No se realiza ningún rastreo comercial ni venta de 
            información a terceros de ningún tipo en este entorno.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Derechos del Interesado (Derechos ARCO)</h2>
          <p>
            En un entorno real, usted tendría derecho a acceder, rectificar, cancelar y oponerse al tratamiento de 
            sus datos, así como ejercer su derecho a la limitación del tratamiento y a la portabilidad de sus datos. 
            Dado que este sistema es de prueba, cualquier dato ingresado puede ser borrado simplemente a petición.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
