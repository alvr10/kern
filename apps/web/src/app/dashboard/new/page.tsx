"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateOrganization } from "@/lib/api/organizations-service/hooks";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./page.module.css";

/**
 * New Organization Page
 * Form to create a new organization within the platform
 */
export default function NewOrganizationPage(): React.JSX.Element {
  const router = useRouter();
  const { mutate: createOrg, isPending, error } = useCreateOrganization();
  const containerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    slug: "",
  });

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".reveal-header", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        ".reveal-form",
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      );
    },
    { scope: containerRef },
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData({ name, slug });
    setFormErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "");

    setFormData((prev) => ({ ...prev, slug }));
    setFormErrors((prev) => ({ ...prev, slug: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    let hasError = false;
    if (!formData.name.trim()) {
      setFormErrors((prev) => ({ ...prev, name: "El nombre es obligatorio" }));
      hasError = true;
    }
    if (!formData.slug.trim()) {
      setFormErrors((prev) => ({
        ...prev,
        slug: "El identificador es obligatorio",
      }));
      hasError = true;
    }

    if (hasError) return;

    createOrg(formData, {
      onSuccess: () => {
        router.push("/dashboard/organizations");
      },
    });
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.content}>
        <header className={`${styles.header} reveal-header`}>
          <Link href="/dashboard/organizations" className={styles.backLink}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
              <ArrowLeft size={16} />
              Volver a organizaciones
            </Button>
          </Link>
          <h1 className={styles.title}>Nueva Organización</h1>
          <p className={styles.subtitle}>
            Crea un nuevo espacio de trabajo para tu equipo y empieza a
            colaborar.
          </p>
        </header>

        <form className={`${styles.form} reveal-form`} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              Nombre de la organización
            </label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="Ej. Acme Corp"
              value={formData.name}
              onChange={handleNameChange}
              disabled={isPending}
            />
            {formErrors.name && (
              <p className={styles.error}>{formErrors.name}</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="slug" className={styles.label}>
              Identificador (URL slug)
            </label>
            <input
              id="slug"
              type="text"
              className={styles.input}
              placeholder="acme-corp"
              value={formData.slug}
              onChange={handleSlugChange}
              disabled={isPending}
            />
            <p className={styles.slugPreview}>
              Tu organización estará en:{" "}
              <span>kern.id/{formData.slug || "..."}</span>
            </p>
            {formErrors.slug && (
              <p className={styles.error}>{formErrors.slug}</p>
            )}
          </div>

          <div className={styles.actions}>
            <Link href="/dashboard/organizations">
              <Button variant="outline" type="button" disabled={isPending}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creando...
                </>
              ) : (
                <>Crear Organización</>
              )}
            </Button>
          </div>

          {error && (
            <p
              className={styles.error}
              style={{ textAlign: "center", marginTop: "16px" }}
            >
              Hubo un error al crear la organización. Inténtalo de nuevo.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
