'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
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
} from 'lucide-react';
import styles from './page.module.css';
import { cn } from '@/lib/utils';
import { useOrganizations } from '@/lib/api/organizations-service/hooks';
import { useContentCalendar } from '@/lib/api/content-service/hooks';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Schedule / Publish Page
 */
export default function PublishPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to current time on mount
  React.useEffect(() => {
    if (scrollContainerRef.current && view === 'calendar') {
      const now = new Date();
      const hour = now.getHours();
      // Each hour is 80px high
      const scrollTo = Math.max(0, hour * 80 - 160); // Show a bit of the previous hours context
      scrollContainerRef.current.scrollTop = scrollTo;
    }
  }, [view]);

  // 1. Get organizations to find the current one by slug
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find(org => org.slug === slug);

  // 2. Get calendar data
  useContentCalendar(currentOrg?.id || '', '2026-04-26T00:00:00Z', '2026-05-02T23:59:59Z');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0); // -1 for past, 1 for future

  const variants = {
    enter: (direction: number) => ({
      x: direction * 50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction * -50,
      opacity: 0,
    }),
  };

  // Generate 7 days: 3 past, reference, 3 future
  const generateDays = () => {
    const result = [];
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);

      // Determine if it's the real "today"
      const realToday = new Date();
      const isToday =
        date.getDate() === realToday.getDate() &&
        date.getMonth() === realToday.getMonth() &&
        date.getFullYear() === realToday.getFullYear();

      result.push({
        name: dayNames[date.getDay()],
        date: date.getDate(),
        active: isToday,
        fullDate: date,
      });
    }
    return result;
  };

  const days = generateDays();

  const handlePrevWeek = () => {
    setDirection(-1);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    setDirection(1);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    setDirection(today > currentDate ? 1 : -1);
    setCurrentDate(today);
  };

  // 24 hours for the grid
  const hours = Array.from({ length: 24 }).map((_, i) => {
    const hour = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return {
      value: i,
      label: `${hour} ${ampm}`,
      showLabel: i % 2 === 0, // Show labels every 2 hours
    };
  });

  // Format current month range for the header
  const getMonthRange = () => {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const startMonth = months[days[0].fullDate.getMonth()];
    const endMonth = months[days[days.length - 1].fullDate.getMonth()];
    const year = days[0].fullDate.getFullYear();

    if (startMonth === endMonth) return `${startMonth} ${year}`;
    return `${startMonth} - ${endMonth} ${year}`;
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.title}>
            <div className={styles.iconWrapper}>
              <LayoutGrid size={18} />
            </div>
            Todos los Canales
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button
              className={cn(styles.toggleBtn, view === 'list' && styles.toggleBtnActive)}
              onClick={() => setView('list')}
            >
              <List size={16} />
              Lista
            </button>
            <button
              className={cn(styles.toggleBtn, view === 'calendar' && styles.toggleBtnActive)}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={16} />
              Calendario
            </button>
          </div>
          <button className={styles.newPostBtn}>
            <Plus size={18} />
            Nueva Publicación
          </button>
        </div>
      </header>

      {/* Controls Bar */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.dateNav}>
            <button className={styles.navIconBtn} onClick={handlePrevWeek}>
              <ChevronLeft size={20} />
            </button>
            <button className={styles.navIconBtn} onClick={handleNextWeek}>
              <ChevronRight size={20} />
            </button>
            <span className={styles.currentDate}>{getMonthRange()}</span>
          </div>
          <button className={styles.todayBtn} onClick={handleToday}>
            Hoy
          </button>
          <div className={styles.weekSelector}>
            Semana <ChevronDown size={14} />
          </div>
        </div>
        <div className={styles.controlsRight}>
          <button className={styles.filterBtn}>
            <MessageSquare size={16} /> Todos los Posts <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Layers size={16} /> Canales <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Tag size={16} /> Etiquetas <ChevronDown size={14} />
          </button>
          <button className={styles.filterBtn}>
            <Globe size={16} /> Madrid <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendarWrapper}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentDate.getTime()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={styles.calendarInner}
          >
            <div className={styles.gridHeader}>
              <div className={styles.timeHeader} />
              {days.map(day => (
                <div key={day.name} className={cn(styles.dayLabel, day.active && styles.dayLabelActive)}>
                  <span className={styles.dayName}>{day.name}</span>
                  <span className={styles.dayNum}>{day.date}</span>
                </div>
              ))}
            </div>

            <div className={styles.gridBody} ref={scrollContainerRef}>
              {hours.map(h => (
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
                      {h.value === 20 && dayIndex === 3 && <div className={styles.event}>Post Mock Idea</div>}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
