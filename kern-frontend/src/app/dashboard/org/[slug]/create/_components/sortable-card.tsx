"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, Clock, AlertCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContentPieceResponse,
  ContentStatus,
} from "@/lib/api/content-service/types";
import { useUpdateContentStatus } from "@/lib/api/content-service/hooks";
import styles from "../page.module.css";

export function SortableCard({ item }: { item: ContentPieceResponse }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const updateStatus = useUpdateContentStatus();

  const handleStatusChange = (newStatus: ContentStatus) => {
    updateStatus.mutate({ id: item.id || item._id!, status: newStatus });
    setIsMenuOpen(false);
  };

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
    >
      <div className={styles.cardBody}>{item.body}</div>
      <div className={styles.cardFooter}>
        <span className={styles.platformBadge}>{item.platform}</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            position: "relative",
          }}
        >
          {item.status === "APPROVED" && (
            <CheckCircle2 size={14} color="#10b981" />
          )}
          {item.status === "DRAFT" && <Clock size={14} color="#666" />}
          {item.status === "IN_REVIEW" && (
            <AlertCircle size={14} color="#f59e0b" />
          )}
          <button
            className={styles.iconButton}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking menu
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            style={{ padding: "2px" }}
          >
            <MoreHorizontal size={14} />
          </button>

          {isMenuOpen && (
            <div
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking inside menu
              style={{
                position: "absolute",
                bottom: "100%",
                right: 0,
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "4px",
                zIndex: 10,
                minWidth: "120px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                marginBottom: "4px",
              }}
            >
              {Object.values(ContentStatus).map((status) => (
                <button
                  key={status}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    fontSize: "12px",
                    background:
                      item.status === status ? "var(--accent)" : "none",
                    border: "none",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
