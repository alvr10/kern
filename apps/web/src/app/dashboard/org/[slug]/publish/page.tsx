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
  Tag,
  Layers,
  X,
  Camera,
  AtSign,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import styles from './page.module.css';
import { cn } from '@/lib/utils';
import { useOrganizations } from '@/lib/api/organizations-service/hooks';
import { useContentList, useUpdateContentStatus, contentKeys } from '@/lib/api/content-service/hooks';
import { useSocialAccounts } from '@/lib/api/social-service/hooks';
import { CreateIdeaModal } from '../create/_components/create-idea-modal';
import { ContentStatus } from '@/lib/api/content-service/types';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Schedule / Publish Page
 */
export default function PublishPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  // Modal & Publishing States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [activePost, setActivePost] = useState<any>(null);
  const [publishingPlatformId, setPublishingPlatformId] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateContentStatus();

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

  // 2. Get all content pieces for this organization
  const { data: contentList } = useContentList({
    organizationId: currentOrg?.id || '',
    limit: 100,
  });
  const realPosts = Array.isArray(contentList) ? contentList : (contentList as any)?.data || [];

  // 3. Get all connected social accounts for the publish selection
  const { data: connectedAccounts = [] } = useSocialAccounts(currentOrg?.id || '');

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

  const filteredPosts = realPosts.filter((post: any) => {
    if (!post.scheduledAt) return false;
    const matchPlatform = !selectedPlatform || post.platform === selectedPlatform;
    const matchTag = !selectedTag || post.hashtags?.includes(selectedTag);
    return matchPlatform && matchTag;
  });

  // Dynamically extract all unique hashtags from real posts to populate the tags filter!
  const allHashtags = Array.from(new Set(realPosts.flatMap((post: any) => post.hashtags || []))) as string[];

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

  // Pre-select a connected account when opening the publish modal for a post
  const handleSelectPost = (post: any) => {
    setActivePost(post);
    setIsPublishModalOpen(true);
    setPublishStatus('idle');

    // Find if we have a connected account matching the target platform
    const matchingAccount = connectedAccounts.find(
      (acc: any) => acc.platform.toUpperCase() === post.platform.toUpperCase(),
    );

    if (matchingAccount) {
      setPublishingPlatformId(matchingAccount.id || (matchingAccount as any)._id);
    } else if (connectedAccounts.length > 0) {
      // Fallback to the first connected account
      setPublishingPlatformId(connectedAccounts[0].id || (connectedAccounts[0] as any)._id);
    } else {
      setPublishingPlatformId(null);
    }
  };

  // Perform active publishing & status updates
  const handlePublishNow = async () => {
    if (!activePost || !publishingPlatformId) return;
    setPublishStatus('loading');
    try {
      // Set Post Status to PUBLISHED in content-service Database
      await updateStatusMutation.mutateAsync({
        id: activePost.id || activePost._id,
        status: ContentStatus.PUBLISHED,
      });

      setPublishStatus('success');

      // 3. Invalidate query cache to trigger calendar card glow transition
      queryClient.invalidateQueries({ queryKey: contentKeys.lists(currentOrg?.id || '') });

      // Automatically dismiss the modal after 1.5 seconds
      setTimeout(() => {
        setIsPublishModalOpen(false);
        setPublishStatus('idle');
        setActivePost(null);
        setPublishingPlatformId(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to publish content piece:', err);
      setPublishStatus('error');
    }
  };

  const getPlatformIcon = (platform: string, size = 18) => {
    const clean = platform.toUpperCase();
    if (clean.includes('INSTAGRAM')) {
      return <Camera size={size} style={{ color: '#e1306c' }} />;
    } else if (clean.includes('THREADS')) {
      return <AtSign size={size} />;
    } else if (clean.includes('LINKEDIN')) {
      return <Briefcase size={size} style={{ color: '#0077b5' }} />;
    } else {
      return <Sparkles size={size} style={{ color: '#f59e0b' }} />;
    }
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
          <button className={styles.newPostBtn} onClick={() => setIsCreateModalOpen(true)}>
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
        </div>
        <div className={styles.controlsRight}>
          <div style={{ position: 'relative' }}>
            <button
              className={styles.filterBtn}
              onClick={() => {
                setIsPlatformOpen(!isPlatformOpen);
                setIsTagOpen(false);
              }}
            >
              <Layers size={16} /> {selectedPlatform ? `Canal: ${selectedPlatform}` : 'Canales'}{' '}
              <ChevronDown size={14} />
            </button>
            {isPlatformOpen && (
              <div className={styles.filterDropdown}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedPlatform(null);
                    setIsPlatformOpen(false);
                  }}
                >
                  Todos los Canales
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedPlatform('INSTAGRAM');
                    setIsPlatformOpen(false);
                  }}
                >
                  Instagram
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedPlatform('THREADS');
                    setIsPlatformOpen(false);
                  }}
                >
                  Threads
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedPlatform('LINKEDIN');
                    setIsPlatformOpen(false);
                  }}
                >
                  LinkedIn
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className={styles.filterBtn}
              onClick={() => {
                setIsTagOpen(!isTagOpen);
                setIsPlatformOpen(false);
              }}
            >
              <Tag size={16} /> {selectedTag ? `Etiqueta: ${selectedTag}` : 'Etiquetas'} <ChevronDown size={14} />
            </button>
            {isTagOpen && (
              <div className={styles.filterDropdown}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedTag(null);
                    setIsTagOpen(false);
                  }}
                >
                  Todas las Etiquetas
                </div>
                {allHashtags.length > 0 ? (
                  allHashtags.map(tag => (
                    <div
                      key={tag}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsTagOpen(false);
                      }}
                    >
                      {tag}
                    </div>
                  ))
                ) : (
                  <div className={cn(styles.dropdownItem, 'opacity-50 pointer-events-none')}>Sin etiquetas</div>
                )}
              </div>
            )}
          </div>
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
                      {/* Render dynamic filtered posts */}
                      {filteredPosts
                        .filter((post: any) => {
                          if (!post.scheduledAt) return false;
                          const postDate = new Date(post.scheduledAt);
                          const dayDate = days[dayIndex].fullDate;
                          return (
                            postDate.getHours() === h.value &&
                            postDate.getDate() === dayDate.getDate() &&
                            postDate.getMonth() === dayDate.getMonth() &&
                            postDate.getFullYear() === dayDate.getFullYear()
                          );
                        })
                        .map((post: any) => (
                          <div
                            key={post.id || post._id}
                            onClick={() => handleSelectPost(post)}
                            className={cn(
                              styles.event,
                              styles[`event_${post.platform.toLowerCase()}`],
                              post.status === 'PUBLISHED' && styles.event_published,
                            )}
                            title={`${post.title} | Estado: ${post.status} | Plataforma: ${post.platform} | Etiquetas: ${post.hashtags?.join(', ') || ''}`}
                          >
                            <span className={styles.eventTitle}>{post.title}</span>
                            <div className={styles.eventMeta}>
                              <span className={styles.eventPlatform}>{post.platform}</span>
                            </div>
                            {post.status === 'PUBLISHED' && (
                              <div className={styles.publishedBadge} title="Publicado con éxito">
                                ✓
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Create Idea Modal for new post creation directly in PUBLISHED state */}
      <CreateIdeaModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          queryClient.invalidateQueries({ queryKey: contentKeys.lists(currentOrg?.id || '') });
        }}
        initialStatus={ContentStatus.PUBLISHED}
        organizationId={currentOrg?.id || ''}
      />

      {/* Glassmorphic Publish Modal Overlay Portal */}
      {isPublishModalOpen &&
        activePost &&
        typeof window !== 'undefined' &&
        createPortal(
          <div className={styles.publishModalOverlay} onClick={() => setIsPublishModalOpen(false)}>
            <div className={styles.publishModalContent} onClick={e => e.stopPropagation()}>
              <button
                className={styles.closeBtn}
                onClick={() => setIsPublishModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Publicar Contenido</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                  Publica esta pieza directamente en tus canales sociales conectados.
                </p>
              </div>

              {/* Preview Box */}
              <div className={styles.postPreview}>
                <div className={styles.postPreviewTitle}>{activePost.title}</div>
                <div className={styles.postPreviewBody}>{activePost.body}</div>
                {activePost.hashtags && activePost.hashtags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {activePost.hashtags.map((tag: string) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          color: '#4ade80',
                          backgroundColor: 'rgba(74, 222, 128, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Channel Selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--muted-foreground)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Selecciona el Canal Social
                </span>

                {connectedAccounts.length > 0 ? (
                  <div className={styles.channelSelectGroup}>
                    {connectedAccounts.map((account: any) => {
                      const accountId = account.id || account._id;
                      const isActive = publishingPlatformId === accountId;
                      return (
                        <button
                          key={accountId}
                          onClick={() => {
                            if (activePost.status !== 'PUBLISHED') {
                              setPublishingPlatformId(accountId);
                            }
                          }}
                          className={cn(styles.channelOption, isActive && styles.channelOptionActive)}
                          disabled={activePost.status === 'PUBLISHED'}
                        >
                          <img
                            src={
                              (account.profileData?.avatar as string) ||
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${account.platform}`
                            }
                            alt={account.platform}
                            className={styles.channelOptionAvatar}
                          />
                          <div className={styles.channelOptionInfo}>
                            <span className={styles.channelOptionName}>
                              {(account.profileData?.name as string) || account.platform}
                            </span>
                            <span className={styles.channelOptionHandle}>
                              {(account.profileData?.handle as string) || `@${account.platform.toLowerCase()}`}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--secondary)',
                            }}
                          >
                            {getPlatformIcon(account.platform, 16)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className={styles.noChannelsWarning}>
                    <Layers size={24} style={{ color: 'var(--muted-foreground)', marginBottom: '4px' }} />
                    <span>No tienes ningún canal conectado para esta organización.</span>
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>
                      Ve a la barra lateral izquierda para conectar un canal de Instagram, Threads o LinkedIn.
                    </span>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {publishStatus === 'success' && (
                  <div className={styles.publishStatusSuccess}>
                    ✓ ¡Publicado con éxito en{' '}
                    {connectedAccounts.find((a: any) => (a.id || a._id) === publishingPlatformId)?.platform}!
                  </div>
                )}
                {publishStatus === 'error' && (
                  <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}>
                    ❌ Error al publicar. Inténtalo de nuevo.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setIsPublishModalOpen(false)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                    }}
                    disabled={publishStatus === 'loading'}
                  >
                    {activePost.status === 'PUBLISHED' ? 'Cerrar' : 'Cancelar'}
                  </button>

                  {activePost.status !== 'PUBLISHED' && (
                    <button
                      onClick={handlePublishNow}
                      className={styles.newPostBtn}
                      style={{
                        padding: '10px 24px',
                        height: 'auto',
                        opacity: !publishingPlatformId || publishStatus === 'loading' ? 0.6 : 1,
                        cursor: !publishingPlatformId || publishStatus === 'loading' ? 'not-allowed' : 'pointer',
                      }}
                      disabled={!publishingPlatformId || publishStatus === 'loading'}
                    >
                      {publishStatus === 'loading' ? 'Publicando...' : 'Publicar Ahora'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
