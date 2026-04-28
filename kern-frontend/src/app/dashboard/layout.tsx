"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Bell,
  Search,
  Lightbulb,
  Calendar,
  MessageSquare,
  Camera,
  Briefcase,
  AtSign,
  Plus,
  Settings,
  PanelLeftClose,
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
  Users,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { useAuth } from "@/lib/api/auth/hooks";
import { cn } from "@/lib/utils";

/**
 * Dashboard Layout
 * Provides sidebar navigation and main content area
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
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
  const [activeSubMenu, setActiveSubMenu] = useState<"help" | "apps" | null>(
    null,
  );
  const [subMenuRect, setSubMenuRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  const handleSubMenuEnter = (type: "help" | "apps", rect: DOMRect) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const estimatedHeight = type === "help" ? 240 : 220;
    const top =
      rect.top + estimatedHeight > window.innerHeight
        ? window.innerHeight - estimatedHeight - 10
        : rect.top;

    // Use a small overlap (left: rect.right - 2) to bridge the hover gap
    setSubMenuRect({ top, left: rect.right - 2 });
    setActiveSubMenu(type);
  };

  const handleSubMenuLeave = () => {
    closeTimer.current = setTimeout(() => {
      setActiveSubMenu(null);
    }, 150); // Grace period to move mouse to sub-menu
  };
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find((org) => org.slug === slug);

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

  const isOrgPage = pathname.includes("/dashboard/org/");

  const navItems = [
    {
      label: "Crear",
      icon: <Lightbulb size={20} />,
      href: `/dashboard/org/${slug}/create`,
      active: pathname.includes("/create"),
    },
    {
      label: "Publicar",
      icon: <Calendar size={20} />,
      href: `/dashboard/org/${slug}/publish`,
      active: pathname.includes("/publish"),
      badge: "0",
    },
    {
      label: "Comunidad",
      icon: <MessageSquare size={20} />,
      href: "#",
      active: pathname.includes("/community"),
      badge: "Próximamente",
      disabled: true,
    },
  ];

  const channels = [
    {
      label: "Instagram",
      icon: <Camera size={18} className="text-pink-500" />,
      href: "#",
    },
    {
      label: "Threads",
      icon: (
        <AtSign
          size={18}
          className={cn(theme === "dark" ? "text-white" : "text-black")}
        />
      ),
      href: "#",
    },
    {
      label: "LinkedIn",
      icon: <Briefcase size={18} className="text-blue-600" />,
      href: "#",
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
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        styles.navItem,
                        item.active && styles.activeNavItem,
                        item.disabled && styles.disabledNavItem,
                      )}
                      onClick={(e) => item.disabled && e.preventDefault()}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            styles.badge,
                            item.badge === "Próximamente" &&
                              styles.badgeComingSoon,
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className={styles.sectionDivider} />

                <div className={styles.channelsSection}>
                  <div className={styles.sectionHeader}>
                    <span>Conectar canales</span>
                    <div className={styles.sectionActions}>
                      <Search size={14} />
                      <Settings size={14} />
                      <Plus size={14} />
                    </div>
                  </div>
                  <div className={styles.channelList}>
                    {channels.map((channel) => (
                      <Link
                        key={channel.label}
                        href={channel.href}
                        className={styles.channelItem}
                      >
                        <div className={styles.channelIconWrapper}>
                          {channel.icon}
                          <div className={styles.plusOverlay}>
                            <Plus size={8} />
                          </div>
                        </div>
                        <span>{channel.label}</span>
                      </Link>
                    ))}
                    <button className={styles.moreChannels}>
                      <div className={styles.plusIcon}>
                        <Plus size={16} />
                      </div>
                      <span>Más canales</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.navGroup}>
                <Link
                  href="/dashboard/organizations"
                  className={cn(
                    styles.navItem,
                    pathname === "/dashboard/organizations" &&
                      styles.activeNavItem,
                  )}
                >
                  <Building2 size={20} />
                  <span>Organizaciones</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={cn(
                    styles.navItem,
                    pathname === "/dashboard/settings" && styles.activeNavItem,
                  )}
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
                  <div
                    className={styles.promoIcon}
                    style={{ background: "#000" }}
                  >
                    <AtSign size={12} color="#fff" />
                  </div>
                  <div
                    className={styles.promoIcon}
                    style={{ background: "#1877F2" }}
                  >
                    <Briefcase size={12} color="#fff" />
                  </div>
                  <div
                    className={styles.promoIcon}
                    style={{ background: "#9146FF" }}
                  >
                    <AtSign size={12} color="#fff" />
                  </div>
                  <div
                    className={styles.promoIcon}
                    style={{ background: "#FF0000" }}
                  >
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
                style={{ cursor: "pointer" }}
              >
                <div className={styles.avatar}>
                  <Building2 size={16} />
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {currentOrg?.name || "Mi Organización"}
                  </span>
                  <span className={styles.planName}>Plan Gratuito</span>
                </div>
                <button className={styles.collapseButton}>
                  <PanelLeftClose size={16} />
                </button>
              </div>
            </div>

            {isProfileMenuOpen &&
              profileMenuRect &&
              createPortal(
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div
                    className={styles.orgPopup}
                    style={{
                      position: "fixed",
                      bottom: profileMenuRect.bottom,
                      left: profileMenuRect.left,
                      zIndex: 9999,
                    }}
                  >
                    <div className={styles.popupHeader}>
                      <div className={styles.userEmail}>
                        {user?.email || "usuario@ejemplo.com"}
                      </div>
                      <div className={styles.orgName}>
                        {currentOrg?.name || "Mi Organización"}
                      </div>
                      <div className={styles.planDetails}>
                        Plan gratuito · 0 canales
                      </div>
                      <button className={styles.upgradeButton}>
                        <Sparkles size={14} style={{ marginRight: 8 }} />
                        Mejorar Plan
                      </button>
                    </div>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupNav}>
                      <div className={styles.popupItem}>
                        <Settings size={16} />
                        <span>Ajustes</span>
                      </div>
                      <div className={styles.popupItem}>
                        <LayoutGrid size={16} />
                        <span>Canales</span>
                      </div>
                      <div className={styles.popupItem}>
                        <CreditCard size={16} />
                        <span>Planes y Facturación</span>
                      </div>
                      <div
                        className={styles.popupItem}
                        onMouseEnter={(e) =>
                          handleSubMenuEnter(
                            "help",
                            e.currentTarget.getBoundingClientRect(),
                          )
                        }
                        onMouseLeave={handleSubMenuLeave}
                      >
                        <HelpCircle size={16} />
                        <span>Ayuda y Soporte</span>
                        <ChevronRight
                          size={14}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                    </div>

                    <div className={styles.popupDivider} />

                    <div className={styles.popupNav}>
                      <div
                        className={styles.popupItem}
                        onMouseEnter={(e) =>
                          handleSubMenuEnter(
                            "apps",
                            e.currentTarget.getBoundingClientRect(),
                          )
                        }
                        onMouseLeave={handleSubMenuLeave}
                      >
                        <Layers size={16} />
                        <span>Apps e Integraciones</span>
                        <ChevronRight
                          size={14}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <div className={styles.popupItem}>
                        <FlaskConical size={16} />
                        <span>Funciones Beta</span>
                        <span className={styles.betaBadge}>Próximamente</span>
                      </div>
                      <Link
                        href={`/dashboard/org/${slug}/settings/invite-member`}
                        className={styles.popupItem}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Users size={16} />
                        <span>Invitar miembros</span>
                      </Link>
                    </div>

                    <div className={styles.popupDivider} />

                    <div
                      className={styles.popupItem}
                      style={{ color: "#ef4444" }}
                    >
                      <LogOut size={16} />
                      <span>Cerrar sesión</span>
                    </div>
                  </div>

                  {/* Sub-menus */}
                  {activeSubMenu === "help" && subMenuRect && (
                    <div
                      className={styles.subMenu}
                      style={{
                        position: "fixed",
                        top: subMenuRect.top,
                        left: subMenuRect.left,
                        zIndex: 10000,
                      }}
                      onMouseEnter={() => {
                        if (closeTimer.current)
                          clearTimeout(closeTimer.current);
                        setActiveSubMenu("help");
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
                      <div className={styles.popupSectionTitle}>
                        Estado de la App
                      </div>
                      <div className={styles.popupItem}>
                        <div className={styles.statusDot} />
                        <span style={{ color: "var(--success)" }}>
                          Todos los sistemas operativos
                        </span>
                      </div>
                    </div>
                  )}

                  {activeSubMenu === "apps" && subMenuRect && (
                    <div
                      className={styles.subMenu}
                      style={{
                        position: "fixed",
                        top: subMenuRect.top,
                        left: subMenuRect.left,
                        zIndex: 10000,
                      }}
                      onMouseEnter={() => {
                        if (closeTimer.current)
                          clearTimeout(closeTimer.current);
                        setActiveSubMenu("apps");
                      }}
                      onMouseLeave={handleSubMenuLeave}
                    >
                      <div
                        className={cn(styles.popupItem, styles.disabledItem)}
                      >
                        <span>Kern para iOS</span>
                        <span className={styles.comingSoonBadge}>
                          Próximamente
                        </span>
                      </div>
                      <div
                        className={cn(styles.popupItem, styles.disabledItem)}
                      >
                        <span>Kern para Android</span>
                        <span className={styles.comingSoonBadge}>
                          Próximamente
                        </span>
                      </div>
                      <div
                        className={cn(styles.popupItem, styles.disabledItem)}
                      >
                        <span>API</span>
                        <span className={styles.betaBadge}>Beta</span>
                      </div>
                      <div
                        className={cn(styles.popupItem, styles.disabledItem)}
                      >
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

      {/* Top Navbar (Slimmer, for search/notif) */}
      <div className={styles.contentWrapper}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            {/* Breadcrumbs or search could go here */}
          </div>
          <div className={styles.headerRight}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={styles.iconButton}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && (
                  <motion.div
                    key={theme}
                    initial={{ y: 10, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -10, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <button className={styles.iconButton}>
              <Bell size={20} />
            </button>
            <div className={styles.headerAvatar}>A</div>
          </div>
        </header>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
