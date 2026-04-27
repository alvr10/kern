import React from "react";
import { LegalLayout } from "@/components/layouts/legal-layout";

export default function LegalNotice(): React.JSX.Element {
  return (
    <LegalLayout activePath="/legal-notice">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
        Aviso Legal
      </h1>
      <p className="mb-16 text-sm opacity-60">
        Última actualización: 12 de Marzo de 2026
      </p>

      <div
        className="space-y-12 text-base font-light leading-relaxed"
        style={{ opacity: 0.8 }}
      >
        <section>
          <h2 className="mb-4 text-xl font-medium">1. Datos Identificativos</h2>
          <p>
            En cumplimiento con el deber de información recogido en artículo 10
            de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
            Información y del Comercio Electrónico (LSSICE), se expone lo
            siguiente:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              <strong>Denominación Social:</strong> KERN (Proyecto
              Universitario)
            </li>
            <li>
              <strong>Objeto Social:</strong> Simulación de Software SaaS para
              Marketing
            </li>
            <li>
              <strong>Correo de Contacto:</strong> hola@kern-simulacion.com
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">
            2. Naturaleza del Proyecto
          </h2>
          <p className="mb-4">
            Este sitio web ha sido creado exclusivamente con fines educativos y
            evaluativos para una práctica universitaria. KERN no es una entidad
            legal constituida y no realiza actividades comerciales de ningún
            tipo en el mundo real.
          </p>
          <p>
            Cualquier similitud con plataformas existentes, nombres comerciales,
            o servicios reales es pura coincidencia o ha sido utilizada a modo
            de inspiración académica.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">
            3. Responsabilidad sobre el Contenido
          </h2>
          <p>
            El responsable de la página web no garantiza la inexistencia de
            errores en el acceso a la web, en su contenido, ni que este se
            encuentre actualizado. Los materiales y datos expuestos en las
            páginas públicas o privadas no tienen validez vinculante, dado el
            carácter simulado del proyecto.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-medium">
            4. Legislación Aplicable y Jurisdicción
          </h2>
          <p>
            Las relaciones entre KERN y las personas usuarias de sus servicios
            telemáticos presentes se encontrarían en una situación real
            sometidas a la legislación española y a los tribunales pertinentes,
            aunque carecen de fuerza legal al tratarse de un ejercicio
            formativo.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
