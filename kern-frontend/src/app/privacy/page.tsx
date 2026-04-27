import React from "react";
import { LegalLayout } from "@/components/layouts/legal-layout";

export default function PrivacyPolicy(): React.JSX.Element {
  return (
    <LegalLayout activePath="/privacy">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
        Política de Privacidad (RGPD)
      </h1>
      <p className="mb-16 text-sm opacity-60">
        Última actualización: 12 de Marzo de 2026
      </p>

      <div
        className="space-y-12 text-base font-light leading-relaxed"
        style={{ opacity: 0.8 }}
      >
        <section>
          <h2 className="mb-4 text-xl font-medium">
            1. Identidad del Responsable
          </h2>
          <p>
            En cumplimiento del Reglamento General de Protección de Datos (RGPD)
            de la UE, le informamos que el responsable del tratamiento de los
            datos personales aquí simulados es KERN, un proyecto de índole
            puramente académico y universitario sin fines comerciales reales.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">2. Datos Recopilados</h2>
          <p className="mb-4">
            Al utilizar nuestra plataforma ficticia, podríamos recopilar los
            siguientes datos a modo de simulación:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Datos de contacto (email, nombre de usuario).</li>
            <li>
              Información de metadatos sobre sus flujos de trabajo en los
              tableros Kanban simulados.
            </li>
            <li>
              Tokens de acceso o integración simulada con servicios de terceros.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">
            3. Finalidad del Tratamiento
          </h2>
          <p>
            Los datos simulados recopilados tienen como única finalidad ilustrar
            el funcionamiento técnico de una herramienta de gestión y marketing.
            No se realiza ningún rastreo comercial ni venta de información a
            terceros de ningún tipo en este entorno.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">
            4. Derechos del Interesado (Derechos ARCO)
          </h2>
          <p>
            En un entorno real, usted tendría derecho a acceder, rectificar,
            cancelar y oponerse al tratamiento de sus datos, así como ejercer su
            derecho a la limitación del tratamiento y a la portabilidad de sus
            datos. Dado que este sistema es de prueba, cualquier dato ingresado
            puede ser borrado simplemente a petición.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
