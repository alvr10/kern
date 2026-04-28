"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Copy,
  Trash2,
  FolderInput,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContentPieceResponse,
  ContentStatus,
} from "@/lib/api/content-service/types";
import {
  useUpdateContentStatus,
  useCreateContent,
  useDeleteContent,
} from "@/lib/api/content-service/hooks";
import styles from "../page.module.css";

export function SortableCard({
  item,
  onEdit,
}: {
  item: ContentPieceResponse;
  onEdit?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [menuRect, setMenuRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateStatus = useUpdateContentStatus();
  const duplicateContent = useCreateContent();
  const deleteContent = useDeleteContent();

  const handleStatusChange = (newStatus: ContentStatus) => {
    updateStatus.mutate({ id: item.id || item._id!, status: newStatus });
    setIsMenuOpen(false);
    setShowStatusMenu(false);
  };

  const handleDuplicate = () => {
    duplicateContent.mutate({
      organizationId: item.organizationId,
      title: `${item.title} (Copia)`,
      body: item.body,
      platform: item.platform,
      hashtags: item.hashtags,
      mediaUrls: item.mediaUrls,
      scheduledAt: item.scheduledAt || new Date().toISOString(),
    });
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de que quieres eliminar esta idea?")) {
      deleteContent.mutate({
        id: item.id || item._id!,
        organizationId: item.organizationId,
      });
    }
    setIsMenuOpen(false);
  };

  // Update menu position when opened
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuRect({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 180, // 180 is minWidth
      });
    }
  }, [isMenuOpen]);

  const itemId = item.id || item._id!;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: itemId,
    data: {
      type: "card",
      item,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(styles.card, isDragging && styles.cardActive)}
      onClick={onEdit}
    >
      <div className={styles.cardTitle}>{item.title}</div>
      <div className={styles.cardBody}>{item.body}</div>
      <div className={styles.cardFooter}>
        <span className={styles.platformBadge}>{item.platform}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {item.status === "APPROVED" && (
            <CheckCircle2 size={14} color="#10b981" />
          )}
          {item.status === "DRAFT" && <Clock size={14} color="#666" />}
          {item.status === "IN_REVIEW" && (
            <AlertCircle size={14} color="#f59e0b" />
          )}
          <button
            ref={buttonRef}
            className={styles.iconButton}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
              setShowStatusMenu(false);
            }}
            style={{ padding: "2px" }}
          >
            <MoreHorizontal size={14} />
          </button>

          {isMenuOpen &&
            menuRect &&
            createPortal(
              <>
                {/* Overlay to close menu on click outside */}
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(false);
                  }}
                />
                <div
                  onPointerDown={(e) => e.stopPropagation()}
                  className={styles.cardActionMenu}
                  style={{
                    position: "absolute",
                    top: menuRect.top + 4,
                    left: menuRect.left,
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "4px",
                    zIndex: 9999,
                    minWidth: "180px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                >
                  <button
                    className={cn(
                      styles.menuItem,
                      showStatusMenu && styles.menuItemActive,
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusMenu(!showStatusMenu);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FolderInput size={14} />
                      <span>Mover a Grupo</span>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{
                        transform: showStatusMenu
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>

                  {showStatusMenu && (
                    <div
                      style={{
                        backgroundColor: "var(--secondary)",
                        borderRadius: "6px",
                        margin: "4px",
                        padding: "2px",
                      }}
                    >
                      {Object.values(ContentStatus).map((status) => (
                        <button
                          key={status}
                          className={cn(
                            styles.menuSubItem,
                            item.status === status && styles.menuItemActive,
                          )}
                          onClick={() => handleStatusChange(status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}

                  <button className={styles.menuItem} onClick={handleDuplicate}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Copy size={14} />
                      <span>Duplicar</span>
                    </div>
                  </button>

                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "var(--border)",
                      margin: "4px 0",
                    }}
                  />

                  <button
                    className={cn(styles.menuItem, styles.menuItemDelete)}
                    onClick={handleDelete}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Trash2 size={14} />
                      <span>Eliminar</span>
                    </div>
                  </button>
                </div>
              </>,
              document.body,
            )}
        </div>
      </div>
    </div>
  );
}
