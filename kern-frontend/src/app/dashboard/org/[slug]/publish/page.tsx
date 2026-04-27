"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Tag,
  Layers,
  MessageSquare,
} from "lucide-react";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { useProjects } from "@/lib/api/projects-service/hooks";
import { useContentCalendar } from "@/lib/api/content-service/hooks";

/**
 * Schedule / Publish Page
 */
export default function PublishPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [view, setView] = useState<"list" | "calendar">("calendar");

  // 1. Get organizations to find the current one by slug
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find((org) => org.slug === slug);

  // 2. Get projects for this organization
  const { data: projects } = useProjects(currentOrg?.id || "");
  const defaultProject = projects?.[0];

  // 3. Get calendar data
  const { data: calendarData } = useContentCalendar(
    defaultProject?.id || "",
    "2026-04-26T00:00:00Z",
    "2026-05-02T23:59:59Z",
  );

  const days = [
    { name: "Sunday", date: 26 },
    { name: "Monday", date: 27, active: true },
    { name: "Tuesday", date: 28 },
    { name: "Wednesday", date: 29 },
    { name: "Thursday", date: 30 },
    { name: "Friday", date: 1 },
    { name: "Saturday", date: 2 },
  ];

  // 24 hours for the grid
  const hours = Array.from({ length: 24 }).map((_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? "AM" : "PM";
    return {
      value: i,
      label: `${hour} ${ampm}`,
      showLabel: i % 2 === 0 && i >= 12, // Show labels every 2 hours, starting from 12 PM as a reference
    };
  });

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.title}>
            <div className={styles.iconWrapper}>
              <LayoutGrid size={18} />
            </div>
            All Channels
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button
              className={cn(
                styles.toggleBtn,
                view === "list" && styles.toggleBtnActive,
              )}
              onClick={() => setView("list")}
            >
              <List size={16} />
              List
            </button>
            <button
              className={cn(
                styles.toggleBtn,
                view === "calendar" && styles.toggleBtnActive,
              )}
              onClick={() => setView("calendar")}
            >
              <CalendarIcon size={16} />
              Calendar
            </button>
          </div>
          <button className={styles.newPostBtn}>
            <Plus size={18} />
            New Post
          </button>
        </div>
      </header>

      {/* Controls Bar */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.dateNav}>
            <button className={styles.navIconBtn}>
              <ChevronLeft size={20} />
            </button>
            <button className={styles.navIconBtn}>
              <ChevronRight size={20} />
            </button>
            <span className={styles.currentDate}>Apr-May 2026</span>
          </div>
          <button className={styles.todayBtn}>Today</button>
          <div className={styles.weekSelector}>
            Week <ChevronDown size={14} />
          </div>
        </div>
        <div className={styles.controlsRight}>
          <button className={styles.filterBtn}>
            <MessageSquare size={16} /> All Posts <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Layers size={16} /> Channels <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Tag size={16} /> Tags <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Globe size={16} /> Madrid <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarWrapper}>
        <div className={styles.gridHeader}>
          <div className={styles.timeHeader} />
          {days.map((day) => (
            <div
              key={day.name}
              className={cn(
                styles.dayLabel,
                day.active && styles.dayLabelActive,
              )}
            >
              <span className={styles.dayName}>{day.name}</span>
              <span className={styles.dayNum}>{day.date}</span>
            </div>
          ))}
        </div>

        <div className={styles.gridBody}>
          {hours.map((h) => (
            <React.Fragment key={h.value}>
              <div className={styles.hourMarker}>
                {h.showLabel && <span className={styles.timeLabel}>{h.label}</span>}
              </div>
              {days.map((_, dayIndex) => (
                <div key={`${h.value}-${dayIndex}`} className={styles.cell}>
                  <div className={styles.cellPlus}>
                    <Plus size={16} />
                  </div>
                  {/* Mock event */}
                  {h.value === 20 && dayIndex === 3 && (
                    <div className={styles.event}>Post Mock Idea</div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
