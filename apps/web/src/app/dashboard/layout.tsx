'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Building2,
  Bell,
  Lightbulb,
  Calendar,
  MessageSquare,
  Camera,
  Briefcase,
  AtSign,
  Plus,
  Settings,
  Sun,
  Moon,
  LayoutGrid,
  CreditCard,
  HelpCircle,
  Layers,
  FlaskConical,
  LogOut,
  ChevronRight,
  Sparkles,
  Keyboard,
  Trash2,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useOrganizations } from '@/lib/api/organizations-service/hooks';
import { useSubscription } from '@/lib/api/billing-service/hooks';
import { useAuth, useSignOut } from '@/lib/api/auth/hooks';
import { useSocialAccounts, useConnectSocialAccount, useDisconnectSocialAccount } from '@/lib/api/social-service/hooks';
import { SocialAccountResponse } from '@/lib/api/social-service/types';
import { SocialPlatform } from '@/lib/api/types';
import { cn } from '@/lib/utils';

/**
 * Dashboard Layout
 * Provides sidebar navigation and main content area
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  const pathname = usePathname();
  const params = useParams();
  const slug = params?.slug as string;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileMenuRect, setProfileMenuRect] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<'help' | 'apps' | null>(null);
  const [subMenuRect, setSubMenuRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const signOutMutation = useSignOut();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOutMutation.mutateAsync();
      router.push('/login');
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const handleSubMenuEnter = (type: 'help' | 'apps', rect: DOMRect) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const estimatedHeight = type === 'help' ? 240 : 220;
    const top = rect.top + estimatedHeight > window.innerHeight ? window.innerHeight - estimatedHeight - 10 : rect.top;

    // Use a small overlap (left: rect.right - 2) to bridge the hover gap
    setSubMenuRect({ top, left: rect.right - 2 });
    setActiveSubMenu(type);
  };

  const handleSubMenuLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveSubMenu(null);
    }, 150); // Grace period to move mouse to sub-menu
  };
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customPlatformName, setCustomPlatformName] = useState('');
  const [isConnectingCustom, setIsConnectingCustom] = useState(false);

  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find(org => org.slug === slug);
  const { data: subscription } = useSubscription(currentOrg?.id || '');

  const { data: connectedAccounts = [] } = useSocialAccounts(currentOrg?.id || '');
  const typedAccounts = connectedAccounts as SocialAccountResponse[];
  const connectMutation = useConnectSocialAccount();
  const disconnectMutation = useDisconnectSocialAccount();

  const handleConnectPlatform = async (platform: string) => {
    if (!currentOrg?.id) return;
    try {
      const generatedId = `mock_user_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
      const generatedToken = `mock_token_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;

      await connectMutation.mutateAsync({
        organizationId: currentOrg.id,
        platform: platform as SocialPlatform,
        platformUserId: generatedId,
        accessToken: generatedToken,
      });
    } catch (err) {
      console.error('Failed to connect channel:', err);
    }
  };

  const handleConnectCustomPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrg?.id || !customPlatformName.trim()) return;
    setIsConnectingCustom(true);
    try {
      const platformKey = customPlatformName.trim().toUpperCase().replace(/\s+/g, '_');
      const generatedId = `mock_user_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;
      const generatedToken = `mock_token_${crypto.randomUUID().replace(/-/g, '').substring(0, 8)}`;

      await connectMutation.mutateAsync({
        organizationId: currentOrg.id,
        platform: platformKey as SocialPlatform,
        platformUserId: generatedId,
        accessToken: generatedToken,
      });

      setCustomPlatformName('');
      setIsCustomModalOpen(false);
    } catch (err) {
      console.error('Failed to connect custom platform:', err);
    } finally {
      setIsConnectingCustom(false);
    }
  };

  const handleDisconnectPlatform = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentOrg?.id) return;
    try {
      await disconnectMutation.mutateAsync({
        id,
        organizationId: currentOrg.id,
      });
    } catch (err) {
      console.error('Failed to disconnect channel:', err);
    }
  };

  const getPlatformIcon = (platform: string, size = 18) => {
    const clean = platform.toUpperCase();
    if (clean.includes('INSTAGRAM')) {
      return <Camera size={size} className="text-pink-500" />;
    } else if (clean.includes('THREADS')) {
      return <AtSign size={size} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />;
    } else if (clean.includes('LINKEDIN')) {
      return <Briefcase size={size} className="text-blue-600" />;
    } else {
      return <Sparkles size={size} className="text-amber-500" />;
    }
  };

  const getPlanLabel = () => {
    if (!subscription) return 'Plan Gratuito';
    switch (subscription.planId) {
      case 'plan_pro':
        return 'Plan Pro';
      case 'plan_team':
        return 'Plan Equipo';
      case 'plan_free':
      default:
        return 'Plan Gratuito';
    }
  };

  const toggleProfileMenu = () => {
    if (!isProfileMenuOpen && profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setProfileMenuRect({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
      });
    }
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isOrgPage = pathname.includes('/dashboard/org/');

  const navItems = [
    {
      label: 'Crear',
      icon: <Lightbulb size={20} />,
      href: `/dashboard/org/${slug}/create`,
      active: pathname.includes('/create'),
    },
    {
      label: 'Publicar',
      icon: <Calendar size={20} />,
      href: `/dashboard/org/${slug}/publish`,
      active: pathname.includes('/publish'),
      badge: '0',
    },
    {
      label: 'Comunidad',
      icon: <MessageSquare size={20} />,
      href: '#',
      active: pathname.includes('/community'),
      badge: 'Próximamente',
      disabled: true,
    },
  ];

  const defaultChannels = [
    {
      key: 'INSTAGRAM',
      label: 'Instagram',
      icon: <Camera size={18} className="text-pink-500" />,
    },
    {
      key: 'THREADS',
      label: 'Threads',
      icon: <AtSign size={18} className={cn(theme === 'dark' ? 'text-white' : 'text-black')} />,
    },
    {
      key: 'LINKEDIN',
      label: 'LinkedIn',
      icon: <Briefcase size={18} className="text-blue-600" />,
    },
  ];

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.orgHeader}>
            <Link href="/dashboard/organizations" className={styles.logo}>
              KERN
            </Link>
          </div>

          <nav className={styles.sideNav}>
            {isOrgPage ? (
              <>
                <div className={styles.navGroup}>
                  {navItems.map(item => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        styles.navItem,
                        item.active && styles.activeNavItem,
                        item.disabled && styles.disabledNavItem,
                      )}
                      onClick={e => item.disabled && e.preventDefault()}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && (
                        <span className={cn(styles.badge, item.badge === 'Próximamente' && styles.badgeComingSoon)}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className={styles.sectionDivider} />

                {/* Canales Conectados Section */}
                {connectedAccounts && connectedAccounts.length > 0 && (
                  <div className={styles.channelsSection}>
                    <div className={styles.channelsSectionTitle}>Canales conectados</div>
                    <div className={styles.channelList}>
                      {typedAccounts.slice(0, 2).map(account => (
                        <div key={account.id} className={styles.connectedChannelItem}>
                          <Image
                            src={
                              (account.profileData?.avatar as string) ??
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${account.platform}`
                            }
                            alt={account.platform}
                            width={36}
                            height={36}
                            className={styles.connectedChannelAvatar}
                          />
                          <div className={styles.channelBadge}>{getPlatformIcon(account.platform, 10)}</div>
                          <div className={styles.connectedChannelInfo}>
                            <span className={styles.connectedChannelName}>
                              {(account.profileData?.name as string) || account.platform}
                            </span>
                            <span className={styles.connectedChannelHandle}>
                              {(account.profileData?.handle as string) || `@${account.platform.toLowerCase()}`}
                            </span>
                          </div>
                          <button
                            onClick={e => handleDisconnectPlatform(account.id, e)}
                            className={styles.disconnectButton}
                            title="Desconectar canal"
                            disabled={disconnectMutation.isPending}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {connectedAccounts.length > 2 && (
                        <Link
                          href={`/dashboard/org/${slug}/settings?tab=channels`}
                          className={styles.moreChannels}
                          style={{ marginTop: '4px', textDecoration: 'none', padding: '6px 12px' }}
                        >
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>
                            Ver los {typedAccounts.length} canales conectados...
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Conectar Canales Section */}
                <div className={styles.channelsSection}>
                  <div className={styles.sectionHeader}>
                    <span>Conectar canales</span>
                    <div className={styles.sectionActions}>
                      <Plus size={14} />
                    </div>
                  </div>
                  <div className={styles.channelList}>
                    {defaultChannels
                      .filter(ch => !connectedAccounts?.some(acc => acc.platform.toUpperCase() === ch.key))
                      .slice(0, 2)
                      .map(channel => (
                        <button
                          key={channel.key}
                          onClick={() => handleConnectPlatform(channel.key)}
                          className={styles.channelItem}
                          style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                          disabled={connectMutation.isPending}
                        >
                          <div className={styles.channelIconWrapper}>
                            {channel.icon}
                            <div className={styles.plusOverlay}>
                              <Plus size={8} />
                            </div>
                          </div>
                          <span>{channel.label}</span>
                        </button>
                      ))}
                    <Link
                      href={`/dashboard/org/${slug}/settings?tab=channels`}
                      className={styles.moreChannels}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className={styles.plusIcon}>
                        <Plus size={16} />
                      </div>
                      <span>Gestionar canales</span>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.navGroup}>
                <Link
                  href="/dashboard/organizations"
                  className={cn(styles.navItem, pathname === '/dashboard/organizations' && styles.activeNavItem)}
                >
                  <Building2 size={20} />
                  <span>Organizaciones</span>
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className={cn(styles.navItem, pathname === '/dashboard/notifications' && styles.activeNavItem)}
                >
                  <Bell size={20} />
                  <span>Notificaciones</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={cn(styles.navItem, pathname === '/dashboard/settings' && styles.activeNavItem)}
                >
                  <Settings size={20} />
                  <span>Ajustes</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {isOrgPage && (
          <div className={styles.sidebarBottom}>
            {/* Promo Card */}
            <div className={styles.promoCard}>
              <div className={styles.promoContent}>
                <div className={styles.promoHeader}>
                  <MessageSquare size={16} />
                  <span>Comunidad</span>
                  <div className={styles.dot} />
                </div>
                <div className={styles.promoIcons}>
                  <div className={styles.promoIcon} style={{ background: '#000' }}>
                    <AtSign size={12} color="#fff" />
                  </div>
                  <div className={styles.promoIcon} style={{ background: '#1877F2' }}>
                    <Briefcase size={12} color="#fff" />
                  </div>
                  <div className={styles.promoIcon} style={{ background: '#9146FF' }}>
                    <AtSign size={12} color="#fff" />
                  </div>
                  <div className={styles.promoIcon} style={{ background: '#FF0000' }}>
                    <Plus size={12} color="#fff" />
                  </div>
                </div>
              </div>
              <div className={styles.promoFooter}>
                <span className={styles.badgeComingSoon}>Próximamente</span>
                <span>Nuevos canales en Comunidad →</span>
              </div>
            </div>

            <div className={styles.sidebarFooter}>
              <div
                ref={profileRef}
                className={styles.userProfile}
                onClick={toggleProfileMenu}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.avatar}>
                  <Building2 size={16} />
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{currentOrg?.name || 'Mi Organización'}</span>
                  <span className={styles.planName}>{getPlanLabel()}</span>
                </div>
              </div>
            </div>

            {isProfileMenuOpen &&
              profileMenuRect &&
              createPortal(
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div
                    className={styles.orgPopup}
                    style={{
                      position: 'fixed',
                      bottom: profileMenuRect.bottom,
                      left: profileMenuRect.left,
                      zIndex: 9999,
                    }}
                  >
                    <div className={styles.popupHeader}>
                      <div className={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</div>
                      <div className={styles.orgName}>{currentOrg?.name || 'Mi Organización'}</div>
                      <div className={styles.planDetails}>{getPlanLabel()} · 0 canales</div>
                      <Link
                        href={`/dashboard/org/${slug}/billing`}
                        className={styles.upgradeButton}
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Sparkles size={14} style={{ marginRight: 8 }} />
                        Mejorar Plan
                      </Link>
                    </div>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupNav}>
                      <div className={styles.popupItem} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
                        <span>Modo {theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
                      </div>
                      <div className={styles.popupItem}>
                        <Bell size={16} />
                        <span>Notificaciones</span>
                      </div>
                    </div>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupNav}>
                      <Link
                        href={`/dashboard/org/${slug}/settings`}
                        className={styles.popupItem}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Ajustes</span>
                      </Link>
                      <Link
                        href={`/dashboard/org/${slug}/settings?tab=channels`}
                        className={styles.popupItem}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <LayoutGrid size={16} />
                        <span>Canales</span>
                      </Link>
                      <Link
                        href={`/dashboard/org/${slug}/billing`}
                        className={styles.popupItem}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <CreditCard size={16} />
                        <span>Planes y Facturación</span>
                      </Link>
                      <div
                        className={styles.popupItem}
                        onMouseEnter={e => handleSubMenuEnter('help', e.currentTarget.getBoundingClientRect())}
                        onMouseLeave={handleSubMenuLeave}
                      >
                        <HelpCircle size={16} />
                        <span>Ayuda y Soporte</span>
                        <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                      </div>
                    </div>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupNav}>
                      <div
                        className={styles.popupItem}
                        onMouseEnter={e => handleSubMenuEnter('apps', e.currentTarget.getBoundingClientRect())}
                        onMouseLeave={handleSubMenuLeave}
                      >
                        <Layers size={16} />
                        <span>Apps e Integraciones</span>
                        <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                      </div>
                      <div className={styles.popupItem}>
                        <FlaskConical size={16} />
                        <span>Funciones Beta</span>
                        <span className={styles.betaBadge}>Próximamente</span>
                      </div>
                    </div>

                    <div className={styles.popupDivider} />

                    <div
                      className={styles.popupItem}
                      style={{ color: '#ef4444', cursor: 'pointer' }}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </div>
                  </div>

                  {/* Sub-menus */}
                  {activeSubMenu === 'help' && subMenuRect && (
                    <div
                      className={styles.subMenu}
                      style={{
                        position: 'fixed',
                        top: subMenuRect.top,
                        left: subMenuRect.left,
                        zIndex: 10000,
                      }}
                      onMouseEnter={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setActiveSubMenu('help');
                      }}
                      onMouseLeave={handleSubMenuLeave}
                    >
                      <div className={styles.popupItem}>
                        <HelpCircle size={16} />
                        <span>Centro de Ayuda</span>
                      </div>
                      <div className={styles.popupItem}>
                        <Lightbulb size={16} />
                        <span>Sugerir una función</span>
                      </div>
                      <div className={styles.popupItem}>
                        <Sparkles size={16} />
                        <span>Novedades</span>
                      </div>
                      <div className={styles.popupItem}>
                        <Keyboard size={16} />
                        <span>Atajos de teclado</span>
                      </div>
                      <div className={styles.popupDivider} />
                      <div className={styles.popupSectionTitle}>Estado de la App</div>
                      <div className={styles.popupItem}>
                        <div className={styles.statusDot} />
                        <span style={{ color: 'var(--success)' }}>Todos los sistemas operativos</span>
                      </div>
                    </div>
                  )}

                  {activeSubMenu === 'apps' && subMenuRect && (
                    <div
                      className={styles.subMenu}
                      style={{
                        position: 'fixed',
                        top: subMenuRect.top,
                        left: subMenuRect.left,
                        zIndex: 10000,
                      }}
                      onMouseEnter={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setActiveSubMenu('apps');
                      }}
                      onMouseLeave={handleSubMenuLeave}
                    >
                      <div className={cn(styles.popupItem, styles.disabledItem)}>
                        <span>Kern para iOS</span>
                        <span className={styles.comingSoonBadge}>Próximamente</span>
                      </div>
                      <div className={cn(styles.popupItem, styles.disabledItem)}>
                        <span>Kern para Android</span>
                        <span className={styles.comingSoonBadge}>Próximamente</span>
                      </div>
                      <div className={cn(styles.popupItem, styles.disabledItem)}>
                        <span>API</span>
                        <span className={styles.betaBadge}>Beta</span>
                      </div>
                      <div className={cn(styles.popupItem, styles.disabledItem)}>
                        <span>Integraciones</span>
                        <span className={styles.betaBadge}>Beta</span>
                      </div>
                    </div>
                  )}
                </>,
                document.body,
              )}
          </div>
        )}
      </aside>

      <div className={styles.contentWrapper}>
        <main className={styles.main}>{children}</main>
      </div>

      {isCustomModalOpen &&
        mounted &&
        createPortal(
          <div className={styles.modalOverlay} onClick={() => setIsCustomModalOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Conectar canal personalizado</h3>
                <p className={styles.modalDescription}>
                  Introduce el nombre de la plataforma para establecer una conexión de prueba.
                </p>
              </div>
              <form onSubmit={handleConnectCustomPlatform} className={styles.modalForm}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Nombre de la Plataforma</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. YouTube, Bluesky, Mastodon..."
                    value={customPlatformName}
                    onChange={e => setCustomPlatformName(e.target.value)}
                    className={styles.textInput}
                    autoFocus
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setIsCustomModalOpen(false)} className={styles.modalButton}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConnectingCustom || !customPlatformName.trim()}
                    className={cn(styles.modalButton, styles.modalButtonPrimary)}
                  >
                    {isConnectingCustom ? 'Conectando...' : 'Conectar Canal'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
