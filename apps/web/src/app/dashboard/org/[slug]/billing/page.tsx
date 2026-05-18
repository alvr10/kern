'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, CreditCard, AlertCircle } from 'lucide-react';
import { useOrganizations } from '@/lib/api/organizations-service/hooks';
import {
  usePlans,
  useSubscription,
  useCreateCheckoutSession,
  useCancelSubscription,
} from '@/lib/api/billing-service/hooks';
import styles from './billing.module.css';

export default function BillingPage(): React.JSX.Element {
  const params = useParams();
  const slug = params.slug as string;

  // State for Billing Interval
  const [isYearly, setIsYearly] = useState(false);

  // 1. Get organizations to match the current one by slug
  const { data: organizations, isLoading: isOrgsLoading } = useOrganizations();
  const currentOrg = organizations?.find(org => org.slug === slug);

  // 2. Fetch plans
  const { data: plans, isLoading: isPlansLoading } = usePlans();

  // 3. Fetch active subscription for current organization
  const { data: subscription, isLoading: isSubLoading } = useSubscription(currentOrg?.id || '');

  // 4. Mutations
  const createCheckoutSession = useCreateCheckoutSession();
  const cancelSubscription = useCancelSubscription();

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!currentOrg) return;
    setLoadingPlanId(planId);
    try {
      createCheckoutSession.mutate({
        organizationId: currentOrg.id,
        planId,
        interval: isYearly ? 'yearly' : 'monthly',
        successUrl: `${window.location.origin}/dashboard/org/${slug}/create?billing_success=true`,
        cancelUrl: `${window.location.origin}/dashboard/org/${slug}/billing?billing_canceled=true`,
      });
    } catch (err) {
      console.error('Failed to create checkout session:', err);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCancel = async () => {
    if (!currentOrg) return;
    if (
      confirm(
        '¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a tus funciones premium al final del período de facturación actual.',
      )
    ) {
      cancelSubscription.mutate(currentOrg.id);
    }
  };

  const isLoading = isOrgsLoading || isPlansLoading || isSubLoading;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (!currentOrg) {
    return (
      <div className={styles.container}>
        <div className={styles.statusBanner} style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
          <div className={styles.statusInfo}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle color="#ef4444" />
              Organización no encontrada
            </h3>
            <p className={styles.statusDetails}>No se pudo cargar la información de la organización actual.</p>
          </div>
        </div>
      </div>
    );
  }

  // Find currently active plan
  const activePlan = plans?.find(p => p.id === subscription?.planId);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Planes y Facturación</h1>
        <p className={styles.subtitle}>
          Administra las suscripciones, límites de tokens de IA y métodos de pago de <strong>{currentOrg.name}</strong>.
        </p>
      </header>

      {/* Subscription Status Banner */}
      {subscription && subscription.planId && activePlan && (
        <div
          className={`${styles.statusBanner} ${
            subscription.status === 'ACTIVE' || subscription.status === 'TRIALING' ? styles.statusBannerActive : ''
          }`}
        >
          <div className={styles.statusInfo}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} />
              Suscripción Actual: {activePlan.name}
              <span className={`${styles.statusBadge} ${styles[`badge${subscription.status}`]}`}>
                {subscription.status === 'ACTIVE' ? 'Activo' : subscription.status}
              </span>
            </h3>
            <p className={styles.statusDetails}>
              Límite de tokens de IA: <strong>{subscription.tokensUsed}</strong> /{' '}
              <strong>{subscription.tokensLimit}</strong> tokens usados este mes.
            </p>
            {subscription.stripeCurrentPeriodEnd && (
              <p className={styles.statusDetails}>
                Próxima facturación:{' '}
                <strong>{new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}</strong>
                {subscription.stripeCancelAtPeriodEnd && (
                  <span style={{ color: '#ef4444', marginLeft: '8px', fontWeight: 600 }}>(Cancelación programada)</span>
                )}
              </p>
            )}
          </div>
          {subscription.status !== 'CANCELED' && !subscription.stripeCancelAtPeriodEnd && (
            <div>
              <button className={styles.cancelBtn} onClick={handleCancel} disabled={cancelSubscription.isPending}>
                {cancelSubscription.isPending ? 'Cancelando...' : 'Cancelar suscripción'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interval Toggle Switch */}
      <div className={styles.toggleContainer}>
        <span className={`${styles.toggleLabel} ${!isYearly ? styles.toggleActive : ''}`}>Mensual</span>
        <label className={styles.switch}>
          <input type="checkbox" checked={isYearly} onChange={e => setIsYearly(e.target.checked)} />
          <span className={styles.slider}></span>
        </label>
        <span className={`${styles.toggleLabel} ${isYearly ? styles.toggleActive : ''}`}>
          Anual
          <span className={styles.discountBadge}>20% Ahorro</span>
        </span>
      </div>

      {/* Pricing Plans Grid */}
      <div className={styles.grid}>
        {plans?.map(plan => {
          const isCurrent = subscription?.planId === plan.id;
          const isPro = plan.slug === 'pro';
          const price = isYearly ? plan.priceYearlyUsd / 12 : plan.priceMonthlyUsd;
          const billingNote = isYearly ? `Facturado $${plan.priceYearlyUsd}/año` : 'Cobrado mensualmente';
          const isPlanLoading = loadingPlanId === plan.id && createCheckoutSession.isPending;

          return (
            <div key={plan.id} className={`${styles.card} ${isPro ? styles.cardPopular : ''}`}>
              {isPro && <div className={styles.popularBadge}>Recomendado</div>}

              <h2 className={styles.cardTitle}>{plan.name}</h2>
              <p className={styles.cardDescription}>
                Límite de {plan.monthlyTokenLimit.toLocaleString()} tokens mensuales de IA y hasta {plan.memberLimit}{' '}
                miembros.
              </p>

              <div className={styles.cardPriceContainer}>
                <span className={styles.priceSymbol}>$</span>
                <span className={styles.cardPrice}>{price}</span>
                <span className={styles.pricePeriod}>/ mes</span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--muted-foreground)',
                  marginTop: '-1.5rem',
                  marginBottom: '2rem',
                  display: 'block',
                }}
              >
                {plan.priceMonthlyUsd > 0 ? billingNote : 'Totalmente gratis'}
              </span>

              <ul className={styles.featuresList}>
                {plan.features.map((feature, i) => (
                  <li key={i} className={styles.featureItem}>
                    <Check size={16} className={styles.featureIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 'auto' }}>
                {isCurrent ? (
                  <button className={`${styles.actionBtn} ${styles.actionBtnCurrent}`} disabled>
                    Plan Actual
                  </button>
                ) : (
                  <button
                    className={`${styles.actionBtn} ${isPro ? styles.actionBtnPopular : ''}`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isPlanLoading}
                  >
                    {isPlanLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span className={styles.spinner} />
                        Cargando...
                      </span>
                    ) : plan.priceMonthlyUsd > 0 ? (
                      'Suscribirse'
                    ) : (
                      'Empezar Gratis'
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
