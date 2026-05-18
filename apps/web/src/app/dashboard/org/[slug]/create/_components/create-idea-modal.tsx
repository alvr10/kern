'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SocialPlatform } from '@/lib/api/types';
import { ContentStatus } from '@/lib/api/content-service/types';
import { useCreateContent, useUpdateContentStatus, useUpdateContent } from '@/lib/api/content-service/hooks';
import styles from '../page.module.css';
import { ContentPieceResponse } from '@/lib/api/content-service/types';
import { useSubscription } from '@/lib/api/billing-service/hooks';
import { Sparkles, Wand2, HandCoins } from 'lucide-react';
import { useGenerateContent } from '@/lib/api/ai-service/hooks';

export function CreateIdeaModal({
  isOpen,
  onClose,
  initialStatus,
  organizationId,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: ContentStatus;
  organizationId: string;
  item?: ContentPieceResponse;
}) {
  const isEditing = !!item;
  const { data: subscription } = useSubscription(organizationId);

  const [title, setTitle] = useState(item?.title || '');
  const [body, setBody] = useState(item?.body || '');
  const [platform, setPlatform] = useState<SocialPlatform>(item?.platform || SocialPlatform.TWITTER);
  const [hashtagsStr, setHashtagsStr] = useState(item?.hashtags?.join(', ') || '');
  const [mediaUrlsStr, setMediaUrlsStr] = useState(item?.mediaUrls?.join(', ') || '');

  // AI Generation States
  const [aiTopic, setAiTopic] = useState('');
  const [draftId, setDraftId] = useState<string | null>(item?.draftId || null);

  const formatDefaultDate = (dateStr?: string) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };
  const [scheduledAt, setScheduledAt] = useState(formatDefaultDate(item?.scheduledAt as string | undefined));

  // Sync state with item when it changes
  React.useEffect(() => {
    if (item) {
      setTitle(item.title);
      setBody(item.body);
      setPlatform(item.platform as SocialPlatform);
      setHashtagsStr(item.hashtags?.join(', ') || '');
      setMediaUrlsStr(item.mediaUrls?.join(', ') || '');
      setScheduledAt(formatDefaultDate(item.scheduledAt as string | undefined));
      setDraftId(item.draftId);
    } else {
      setTitle('');
      setBody('');
      setPlatform(SocialPlatform.TWITTER);
      setHashtagsStr('');
      setMediaUrlsStr('');
      setScheduledAt(formatDefaultDate());
      setDraftId(crypto.randomUUID());
    }
  }, [item, isOpen]);

  const createContent = useCreateContent();
  const updateStatus = useUpdateContentStatus();
  const updateContent = useUpdateContent();
  const generateAI = useGenerateContent();

  const handleAIGenerate = () => {
    if (!aiTopic) return;

    generateAI.mutate(
      {
        organizationId,
        platform,
        topic: aiTopic,
        draftId,
      },
      {
        onSuccess: response => {
          try {
            // Try to parse if AI returns JSON-like structure
            // Otherwise assume generatedText is the body
            const text = response.generatedText;

            // Simple parsing logic for Title: Body: Hashtags:
            const titleMatch = text.match(/T[ií]tulo:\s*(.*)/i);
            const bodyMatch = text.match(/Contenido:\s*([\s\S]*?)(?=Hashtags:|$)/i);
            const hashtagsMatch = text.match(/Hashtags:\s*(.*)/i);

            if (titleMatch) setTitle(titleMatch[1].trim());
            if (bodyMatch) setBody(bodyMatch[1].trim());
            if (hashtagsMatch) setHashtagsStr(hashtagsMatch[1].trim());

            // If no structured matches, set body to entire text
            if (!titleMatch && !bodyMatch) {
              setBody(text);
            }
          } catch {
            setBody(response.generatedText);
          }
        },
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hashtags = hashtagsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');
    const mediaUrls = mediaUrlsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    if (isEditing && item) {
      updateContent.mutate(
        {
          id: item.id || (item as any)._id,
          data: {
            title,
            body,
            hashtags,
            mediaUrls,
            scheduledAt: new Date(scheduledAt).toISOString(),
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } else {
      createContent.mutate(
        {
          organizationId,
          title,
          body,
          platform,
          hashtags,
          mediaUrls,
          scheduledAt: new Date(scheduledAt).toISOString(),
          draftId,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSuccess: (data: any) => {
            // New ideas from AI or manual usually go to DRAFT (initialStatus)
            if (initialStatus && initialStatus !== ContentStatus.DRAFT) {
              updateStatus.mutate({
                id: data.id || data._id,
                status: initialStatus,
              });
            }
            onClose();
          },
        },
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <motion.div layout className={styles.modalWrapper}>
            <motion.div
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={styles.modalContent}
            >
              <div
                className={styles.modalHeader}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2 className={styles.modalTitle}>{isEditing ? 'Editar Idea' : 'Nueva Idea'}</h2>
                <button onClick={onClose} className={styles.iconButton}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Título de la idea</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ej: Post sobre novedades"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Contenido de la idea</label>
                  <textarea
                    className={styles.textarea}
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="¿En qué estás pensando?"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Plataforma</label>
                  <select
                    className={styles.select}
                    value={platform}
                    onChange={e => setPlatform(e.target.value as SocialPlatform)}
                  >
                    <option value={SocialPlatform.INSTAGRAM}>Instagram</option>
                    <option value={SocialPlatform.LINKEDIN}>LinkedIn</option>
                    <option value={SocialPlatform.TWITTER}>Twitter</option>
                    <option value={SocialPlatform.TIKTOK}>TikTok</option>
                    <option value={SocialPlatform.FACEBOOK}>Facebook</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Hashtags (separados por coma)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={hashtagsStr}
                    onChange={e => setHashtagsStr(e.target.value)}
                    placeholder="Ej: #tech, #dev"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>URLs de Media (separadas por coma)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={mediaUrlsStr}
                    onChange={e => setMediaUrlsStr(e.target.value)}
                    placeholder="Ej: https://img.com/1.jpg"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Fecha y Hora de Publicación</label>
                  <input
                    type="datetime-local"
                    className={styles.input}
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" onClick={onClose} className={styles.cancelButton}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.createButton}
                    disabled={
                      createContent.isPending ||
                      updateStatus.isPending ||
                      updateContent.isPending ||
                      generateAI.isPending
                    }
                  >
                    {createContent.isPending || updateStatus.isPending || updateContent.isPending
                      ? 'Guardando...'
                      : isEditing
                        ? 'Guardar Cambios'
                        : 'Crear Idea'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              layout
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className={styles.aiExtension}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3 className={styles.aiTitle}>
                  <Wand2 size={20} />
                  Asistente IA
                </h3>
                {subscription && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--muted-foreground)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <HandCoins size={12} />
                    {subscription.tokensLimit - subscription.tokensUsed}
                  </div>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>¿Sobre qué quieres escribir?</label>
                <textarea
                  className={styles.textarea}
                  style={{ minHeight: '120px' }}
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="Ej: Un post sobre los beneficios de la meditación para programadores..."
                />
              </div>

              <div className={styles.proTip}>
                <b>Pro Tip:</b> Sé específico con el tema y el tono que deseas para obtener mejores resultados.
              </div>

              <button
                type="button"
                className={styles.generateAIButton}
                onClick={handleAIGenerate}
                disabled={generateAI.isPending || !aiTopic}
              >
                {generateAI.isPending ? (
                  'Generando...'
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generar con IA
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
