"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
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

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isOrgPage = pathname.includes("/dashboard/org/");

  const navItems = [
    {
      label: "Create",
      icon: <Lightbulb size={20} />,
      href: `/dashboard/org/${slug}/create`,
      active: pathname.includes("/create"),
    },
    {
      label: "Publish",
      icon: <Calendar size={20} />,
      href: `/dashboard/org/${slug}/publish`,
      active: pathname.includes("/publish"),
      badge: "0",
    },
    {
      label: "Community",
      icon: <MessageSquare size={20} />,
      href: `/dashboard/org/${slug}/community`,
      active: pathname.includes("/community"),
      badge: "New",
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
                      )}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            styles.badge,
                            item.badge === "New" && styles.badgeNew,
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
                    <span>Connect channels</span>
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
                      <span>More channels</span>
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

        <div className={styles.sidebarBottom}>
          {/* Promo Card */}
          <div className={styles.promoCard}>
            <div className={styles.promoContent}>
              <div className={styles.promoHeader}>
                <MessageSquare size={16} />
                <span>Community</span>
                <div className={styles.dot} />
              </div>
              <div className={styles.promoIcons}>
                <div className={styles.promoIcon} style={{ background: "#000" }}>
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
              <span className={styles.badgeNew}>New</span>
              <span>Four new channels in Community →</span>
            </div>
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                <Building2 size={16} />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>My Organization</span>
                <span className={styles.planName}>Free Plan</span>
              </div>
              <button className={styles.collapseButton}>
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>
        </div>
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
