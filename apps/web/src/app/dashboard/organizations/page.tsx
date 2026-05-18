"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import {
  OrganizationType,
  OrganizationResponse,
} from "@/lib/api/organizations-service/types";
import { useSubscription } from "@/lib/api/billing-service/hooks";
import { SubscriptionStatus } from "@/lib/api/billing-service/types";
import { Plus, Building2, ArrowRight, Settings } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import styles from "./page.module.css";

/**
 * Organization Card Component
 * Fetches its own subscription data to display the correct plan badge
 */
const OrganizationCard = ({
  org,
  index,
  innerRef,
}: {
  org: OrganizationResponse;
  index: number;
  innerRef: (el: HTMLAnchorElement | null) => void;
}): React.JSX.Element => {
  const { data: subscription } = useSubscription(org.id);

  const getPlanLabel = () => {
    if (!subscription) return "Plan Gratuito";
    switch (subscription.planId) {
      case "plan_pro":
        return "Plan Pro";
      case "plan_team":
        return "Plan Equipo";
      case "plan_free":
      default:
        return "Plan Gratuito";
    }
  };

  const isPro =
    subscription?.planId === "plan_pro" || subscription?.planId === "plan_team";

  return (
    <Link
      href={`/dashboard/org/${org.slug}`}
      className={styles.card}
      ref={innerRef}
    >
      <div className={styles.cardHeader}>
        <div className={styles.logo}>
          {org.logoUrl ? (
            <Image
              src={org.logoUrl}
              alt={org.name}
              width={48}
              height={48}
              className={styles.logoImage}
            />
          ) : (
            <Building2 size={24} color="#666" />
          )}
        </div>
        <div className={styles.orgInfo}>
          <div className={styles.nameRow}>
            <h3 className={styles.orgName}>{org.name}</h3>
            <span
              className={`${styles.typeBadge} ${org.type === OrganizationType.PERSONAL ? styles.typePersonal : styles.typeTeam}`}
            >
              {org.type === OrganizationType.PERSONAL ? "Personal" : "Equipo"}
            </span>
          </div>
          <p className={styles.orgSlug}>kern.id/{org.slug}</p>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={`${styles.badge} ${isPro ? styles.proBadge : ""}`}>
          {getPlanLabel()}
        </span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Settings size={16} color="#444" />
          <ArrowRight size={16} color="#444" />
        </div>
      </div>
    </Link>
  );
};

/**
 * Organizations Dashboard Page
 * Displays all organizations linked to the user's account
 */
export default function OrganizationsPage(): React.JSX.Element {
  const { data: organizations, isLoading, error } = useOrganizations();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(
    () => {
      if (organizations && organizations.length > 0) {
        // Staggered entrance for cards
        gsap.from(cardsRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });

        // Title and header reveal
        gsap.from(".reveal-header", {
          y: -10,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef, dependencies: [organizations] },
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <p>
            Error al cargar las organizaciones. Por favor, inténtalo de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <header className={`${styles.header} reveal-header`}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Tus Organizaciones</h1>
          <p className={styles.subtitle}>
            Gestiona tus equipos y espacios de trabajo.
          </p>
        </div>
        <div className={styles.actions}>
          <Link href="/dashboard/new">
            <Button>
              <Plus size={18} />
              Nueva Organización
            </Button>
          </Link>
        </div>
      </header>

      {organizations && organizations.length > 0 ? (
        <div className={styles.grid}>
          {organizations.map((org, index) => (
            <OrganizationCard
              key={org.id}
              org={org}
              index={index}
              innerRef={(el) => {
                cardsRef.current[index] = el;
              }}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Building2 size={48} />
          <p>No perteneces a ninguna organización todavía.</p>
          <Link href="/dashboard/new">
            <Button size="lg">Crea tu primera organización</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
