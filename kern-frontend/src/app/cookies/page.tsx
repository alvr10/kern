import React from 'react';
import { LegalLayout } from '../../components/LegalLayout';

export default function CookiesPolicy(): React.JSX.Element {
  return (
    <LegalLayout activePath="/cookies">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
        Política de Cookies
      </h1>
      <p className="text-sm opacity-60 mb-16">
        Última actualización: 12 de Marzo de 2026
      </p>

      <div className="space-y-12 text-base leading-relaxed font-light" style={{ opacity: 0.8 }}>
        <section>
          <h2 className="text-xl font-medium mb-4">1. ¿Qué son las Cookies?</h2>
          <p>
            Una cookie es un pequeño archivo de texto que un sitio web guarda en su ordenador o dispositivo 
            móvil cuando visita el sitio. Permite al sitio web recordar sus acciones y preferencias (como el 
            inicio de sesión, el idioma, el tamaño de la fuente y otras preferencias de visualización) durante un 
            período de tiempo, para que no tenga que volver a introducirlas cada vez que regrese al sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Cookies Utilizadas en Esta Simulación</h2>
          <p className="mb-4">
            Como plataforma académica, solo empleamos identificadores temporales estrictamente técnicos:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Cookies de sesión:</strong> Para simular estados de autenticación "conectado" / "desconectado".</li>
            <li><strong>Cookies funcionales:</strong> Para guardar configuraciones locales temporales como la organización actual activa en el kanban.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Ausencia de Cookies de Seguimiento</h2>
          <p>
            En este proyecto KERN no se instalan cookies analíticas, de marketing, ni rastreadores de terceros 
            (como Meta Pixel o Google Analytics). Su privacidad y actividad no son mercantilizadas ni 
            transferidas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Gestión y Eliminación</h2>
          <p>
            Usted puede controlar y eliminar las cookies simuladas en cualquier momento a través de la 
            configuración de desarrollo o privacidad de su propio navegador web. Borrar el almacenamiento local 
            simplemente reiniciará el estado de su sesión de prueba.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
