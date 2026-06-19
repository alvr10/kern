'use client';

import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, PlusCircle } from 'lucide-react';
import { ContentPieceResponse, ContentStatus } from '@/lib/api/content-service/types';
import { SortableCard } from './sortable-card';
import styles from '../page.module.css';

export function KanbanColumn({
  id,
  title,
  status,
  items,
  count,
  onAddIdea,
  onEditIdea,
}: {
  id: string;
  title: string;
  status: ContentStatus;
  items: ContentPieceResponse[];
  count: number;
  onAddIdea: (status: ContentStatus) => void;
  onEditIdea: (item: ContentPieceResponse) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: 'column', status },
  });

  return (
    <div ref={setNodeRef} className={cn(styles.column, isOver && styles.columnOver)}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          {title}
          <span className={styles.count}>{count}</span>
        </div>
        <div className={styles.columnActions}>
          <button className={styles.iconButton} onClick={() => onAddIdea(status)}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <SortableContext items={items.map(i => i.id || i._id!)} strategy={verticalListSortingStrategy}>
        <div className={styles.cardList}>
          {items.map(item => (
            <SortableCard key={item.id || item._id!} item={item} onEdit={() => onEditIdea(item)} />
          ))}
          {/* Invisible padding to ensure drops work even when list is empty */}
          {items.length === 0 && <div style={{ height: '100px', width: '100%' }} />}
        </div>
      </SortableContext>

      <button className={styles.newCardButton} onClick={() => onAddIdea(status)}>
        <PlusCircle size={16} />
        Nueva Idea
      </button>
    </div>
  );
}
