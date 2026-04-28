"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Users, Copy, Check, UserPlus, Mail, Zap, Globe } from "lucide-react";
import styles from "./page.module.css";
import { motion } from "framer-motion";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";

export default function InviteMemberPage() {
  const { slug } = useParams();
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find((org) => org.slug === slug);

  const [copied, setCopied] = useState(false);

  const inviteLink = `http://localhost:3001/join/${currentOrg?.id || "org_id"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      title: "Genera el enlace único",
      description:
        "Copia el enlace de invitación exclusivo de tu organización.",
      icon: <Globe size={20} />,
    },
    {
      title: "Comparte con tu equipo",
      description:
        "Envía el enlace a los miembros que deseas que se unan a KERN.",
      icon: <Mail size={20} />,
    },
    {
      title: "Registro simplificado",
      description:
        "Tus colaboradores se registran directamente bajo tu organización.",
      icon: <UserPlus size={20} />,
    },
    {
      title: "Colaboración inmediata",
      description:
        "Empieza a crear contenido estratégico en equipo al instante.",
      icon: <Zap size={20} />,
    },
  ];

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.content}
      >
        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <Users size={32} />
          </div>
          <h1 className={styles.title}>
            Invitar miembros a {currentOrg?.name || "tu organización"}
          </h1>
          <p className={styles.description}>
            ¿Disfrutando de KERN? ¡Tu equipo también lo hará! Comparte el acceso
            a tu espacio de trabajo para colaborar en la creación de contenido,
            programar publicaciones y gestionar canales sociales de manera
            centralizada.
          </p>
        </header>

        <section className={styles.linkSection}>
          <h2 className={styles.sectionLabel}>
            Enlace de invitación de la organización:
          </h2>
          <div className={styles.linkInputWrapper}>
            <div className={styles.linkInput}>
              <span className={styles.linkText}>{inviteLink}</span>
            </div>
            <button className={styles.copyButton} onClick={handleCopy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span>{copied ? "Copiado" : "Copiar enlace"}</span>
            </button>
          </div>
        </section>

        <section className={styles.howItWorks}>
          <h2 className={styles.howTitle}>Cómo funciona:</h2>
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => (
              <div key={index} className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
