"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  ContentPieceResponse,
  ContentStatus,
} from "@/lib/api/content-service/types";
import { SortableCard } from "./sortable-card";
import styles from "../page.module.css";

export function KanbanColumn({
  title,
  status,
  items,
  count,
  onAddIdea,
}: {
  id: string;
  title: string;
  status: ContentStatus;
  items: ContentPieceResponse[];
  count: number;
  onAddIdea: (status: ContentStatus) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${status}`,
    data: { type: "column", status },
  });

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          {title}
          <span className={styles.count}>{count}</span>
        </div>
        <div className={styles.columnActions}>
          <button
            className={styles.iconButton}
            onClick={() => onAddIdea(status)}
          >
            <Plus size={16} />
          </button>
          <button className={styles.iconButton}>
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <SortableContext
        items={items.map((i) => i.id || i._id!)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={styles.cardList}
          style={{
            minHeight: 80,
            backgroundColor: isOver ? "var(--accent)" : undefined,
            borderRadius: 8,
            transition: "background-color 0.2s",
          }}
        >
          {items.map((item) => (
            <SortableCard key={item.id || item._id!} item={item} />
          ))}
        </div>
      </SortableContext>

      <button
        className={styles.newCardButton}
        onClick={() => onAddIdea(status)}
      >
        <PlusCircle size={16} />
        Nueva Idea
      </button>
    </div>
  );
}
