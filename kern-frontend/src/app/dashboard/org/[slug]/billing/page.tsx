"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Check, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlans, useSubscription, useCreateCheckoutSession } from "@/lib/api/billing-service/hooks";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { PlanResponse, SubscriptionStatus } from "@/lib/api/billing-service/types";
import styles from "./billing.module.css";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const { slug } = useParams() as { slug: string };
  const { data: plans, isLoading: isLoadingPlans } = usePlans();
  const { data: organizations, isLoading: isLoadingOrgs } = useOrganizations();

  // Log retrieved plans for debugging
  React.useEffect(() => {
    if (plans) {
      console.log("[Billing] Retrieved plans:", plans);
    }
  }, [plans]);
  
  const currentOrg = useMemo(() => {
    return organizations?.find((org) => org.slug === slug);
  }, [organizations, slug]);

  const orgId = currentOrg?.id;
  const { data: subscription, isLoading: isLoadingSub } = useSubscription(orgId || "");

  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const currentPlan = useMemo(() => {
    if (!subscription || !plans) return null;
    return plans.find((p) => p.id === subscription.planId);
  }, [subscription, plans]);

  const createCheckoutMutation = useCreateCheckoutSession();

  const handleAction = async (plan: PlanResponse) => {
    if (!orgId || currentPlan?.id === plan.id) return;

    try {
      setIsRedirecting(true);
      const response = await createCheckoutMutation.mutateAsync({
        organizationId: orgId,
        planId: plan.id,
        interval: billingInterval,
        successUrl: `${window.location.origin}/dashboard/org/${slug}/billing?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/org/${slug}/billing?canceled=true`,
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Hubo un error al iniciar el proceso de pago. Por favor, inténtalo de nuevo.");
    } finally {
      setIsRedirecting(false);
    }
  };

  if (isLoadingPlans || isLoadingSub || isLoadingOrgs) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.title}
        >
          Precios flexibles para todos
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={styles.subtitle}
        >
          {subscription ? (
            <>
              Estás en el plan <strong>{currentPlan?.name || "Free"}</strong>. 
              Personaliza tu plan para adaptarlo a tus necesidades.
            </>
          ) : (
            "Elige el plan que mejor se adapte a tu equipo y comienza a escalar hoy mismo."
          )}
        </motion.p>
      </header>

      <div className={styles.controls}>
        <div className={styles.toggleWrapper}>
          <button 
            className={`${styles.toggleBtn} ${billingInterval === "monthly" ? styles.active : ""}`}
            onClick={() => setBillingInterval("monthly")}
          >
            Mensual
          </button>
          <button 
            className={`${styles.toggleBtn} ${billingInterval === "yearly" ? styles.active : ""}`}
            onClick={() => setBillingInterval("yearly")}
          >
            Anual
            <span className={styles.saveBadge}>20% OFF</span>
          </button>
          <motion.div 
            className={styles.toggleHighlight}
            animate={{ x: billingInterval === "monthly" ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      <div className={styles.plansGrid}>
        {plans?.map((plan, index) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            isCurrent={currentPlan?.id === plan.id}
            interval={billingInterval}
            onAction={() => handleAction(plan)}
            index={index}
            isLoading={isRedirecting}
          />
        ))}
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: PlanResponse;
  isCurrent: boolean;
  interval: "monthly" | "yearly";
  onAction: () => void;
  index: number;
  isLoading: boolean;
}

function PlanCard({ plan, isCurrent, interval, onAction, index, isLoading }: PlanCardProps) {
  const features = typeof plan.features === "string" ? JSON.parse(plan.features) : plan.features;
  
  const price = parseFloat(plan.priceMonthlyUsd);
  const displayPrice = interval === "yearly" ? (price * 0.8).toFixed(2) : price.toFixed(2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
      className={`${styles.planCard} ${isCurrent ? styles.currentCard : ""} ${plan.slug === "pro" ? styles.featuredCard : ""}`}
    >
      {isCurrent && <div className={styles.currentBadge}>Plan Actual</div>}
      {plan.slug === "pro" && !isCurrent && <div className={styles.popularBadge}>Más Popular</div>}
      
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          {plan.slug === "free" && <Sparkles size={24} />}
          {plan.slug === "pro" && <Zap size={24} />}
          {plan.slug === "team" && <Rocket size={24} />}
        </div>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.priceWrapper}>
          <span className={styles.currency}>€</span>
          <span className={styles.amount}>{displayPrice}</span>
          <span className={styles.period}>/ mes</span>
        </div>
        {interval === "yearly" && (
          <p className={styles.billingNote}>Facturado anualmente ({ (parseFloat(plan.priceMonthlyUsd) * 12 * 0.8).toFixed(2) }€ / año)</p>
        )}
        <p className={styles.planDescription}>
          {plan.slug === "free" && "Ideal para empezar y explorar."}
          {plan.slug === "pro" && "Para profesionales que buscan más potencia."}
          {plan.slug === "team" && "La solución definitiva para equipos grandes."}
        </p>
      </div>

      <div className={styles.cardBody}>
        <ul className={styles.featureList}>
          {features.map((feature: string, i: number) => (
            <li key={i} className={styles.featureItem}>
              <Check size={16} className={styles.checkIcon} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.cardFooter}>
        <Button 
          variant={plan.slug === "pro" ? "primary" : "outline"}
          className={styles.actionBtn}
          onClick={onAction}
          disabled={isLoading || isCurrent}
        >
          {isCurrent ? "Plan Actual" : `Elegir ${plan.name}`}
        </Button>
      </div>
    </motion.div>
  );
}
