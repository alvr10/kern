"use client";

import React from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Bell, Search } from "lucide-react";

/**
 * Dashboard Layout
 * Provides common shell for all dashboard pages
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      {/* Top Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarLeft}>
          <Link href="/dashboard/organizations" className={styles.logo}>
            KERN
          </Link>
          <div className={styles.divider} />
          <div className={styles.orgSwitcher}>
            <Building2 size={16} />
            <span>Seleccionar Org</span>
          </div>
        </div>

        <div className={styles.navbarRight}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <span>Buscar...</span>
          </div>
          <button className={styles.iconButton}>
            <Bell size={20} />
          </button>
          <div className={styles.avatar}>A</div>
        </div>
      </nav>

      {/* Sub-navbar / Breadcrumbs */}
      <div className={styles.subnav}>
        <div className={styles.tabs}>
          {pathname.includes("/dashboard/org/") ? (
            <>
              <Link
                href={`/dashboard/org/${pathname.split("/")[3]}/create`}
                className={`${styles.tab} ${
                  pathname.includes("/create") ? styles.activeTab : ""
                }`}
              >
                Crear
              </Link>
              <Link
                href={`/dashboard/org/${pathname.split("/")[3]}/publish`}
                className={`${styles.tab} ${
                  pathname.includes("/publish") ? styles.activeTab : ""
                }`}
              >
                Publicar
              </Link>
              <Link
                href={`/dashboard/org/${pathname.split("/")[3]}/calendar`}
                className={`${styles.tab} ${
                  pathname.includes("/calendar") ? styles.activeTab : ""
                }`}
              >
                Calendario
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/organizations"
                className={`${styles.tab} ${
                  pathname === "/dashboard/organizations" ? styles.activeTab : ""
                }`}
              >
                Organizaciones
              </Link>
              <Link
                href="/dashboard/settings"
                className={`${styles.tab} ${
                  pathname === "/dashboard/settings" ? styles.activeTab : ""
                }`}
              >
                Ajustes
              </Link>
            </>
          )}
        </div>
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
