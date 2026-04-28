"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SocialPlatform } from "@/lib/api/types";
import { ContentStatus } from "@/lib/api/content-service/types";
import {
  useCreateContent,
  useUpdateContentStatus,
} from "@/lib/api/content-service/hooks";
import styles from "../page.module.css";

export function CreateIdeaModal({
  isOpen,
  onClose,
  initialStatus,
  organizationId,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: ContentStatus;
  organizationId: string;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>(
    SocialPlatform.TWITTER,
  );
  const [hashtagsStr, setHashtagsStr] = useState("");
  const [mediaUrlsStr, setMediaUrlsStr] = useState("");

  const formatDefaultDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [scheduledAt, setScheduledAt] = useState(formatDefaultDate());

  const createContent = useCreateContent();
  const updateStatus = useUpdateContentStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hashtags = hashtagsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const mediaUrls = mediaUrlsStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    createContent.mutate(
      {
        organizationId,
        title,
        body,
        platform,
        hashtags,
        mediaUrls,
        scheduledAt: new Date(scheduledAt).toISOString(),
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (data: any) => {
          if (initialStatus && initialStatus !== ContentStatus.DRAFT) {
            updateStatus.mutate({
              id: data.id || data._id,
              status: initialStatus,
            });
          }
          setTitle("");
          setBody("");
          setHashtagsStr("");
          setMediaUrlsStr("");
          setScheduledAt(formatDefaultDate());
          onClose();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.modalOverlay}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={styles.modalContent}
          >
            <div
              className={styles.modalHeader}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 className={styles.modalTitle}>Nueva Idea</h2>
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
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Post sobre novedades"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Contenido de la idea</label>
                <textarea
                  className={styles.textarea}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="¿En qué estás pensando?"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Plataforma</label>
                <select
                  className={styles.select}
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as SocialPlatform)
                  }
                >
                  <option value={SocialPlatform.INSTAGRAM}>Instagram</option>
                  <option value={SocialPlatform.LINKEDIN}>LinkedIn</option>
                  <option value={SocialPlatform.TWITTER}>Twitter</option>
                  <option value={SocialPlatform.TIKTOK}>TikTok</option>
                  <option value={SocialPlatform.FACEBOOK}>Facebook</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Hashtags (separados por coma)
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={hashtagsStr}
                  onChange={(e) => setHashtagsStr(e.target.value)}
                  placeholder="Ej: #tech, #dev"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  URLs de Media (separadas por coma)
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={mediaUrlsStr}
                  onChange={(e) => setMediaUrlsStr(e.target.value)}
                  placeholder="Ej: https://img.com/1.jpg"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Fecha y Hora de Publicación
                </label>
                <input
                  type="datetime-local"
                  className={styles.input}
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.createButton}
                  disabled={createContent.isPending || updateStatus.isPending}
                >
                  {createContent.isPending || updateStatus.isPending
                    ? "Creando..."
                    : "Crear Idea"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
