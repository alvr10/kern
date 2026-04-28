"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useKanbanBoard,
  useUpdateContentStatus,
  contentKeys,
} from "@/lib/api/content-service/hooks";
import { contentClient } from "@/lib/api/content-service/client";
import { Plus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import styles from "./page.module.css";
import {
  ContentPieceResponse,
  ContentStatus,
} from "@/lib/api/content-service/types";
import { KanbanColumn } from "./_components/kanban-column";
import { CreateIdeaModal } from "./_components/create-idea-modal";

/**
 * Create Content (Kanban) Page
 */
export default function CreateContentPage(): React.JSX.Element {
  const params = useParams();
  const slug = params.slug as string;

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus>(
    ContentStatus.DRAFT,
  );
  const [editingItem, setEditingItem] = useState<ContentPieceResponse | null>(
    null,
  );

  // 1. Get organizations to find the current one by slug
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find((org) => org.slug === slug);

  // 2. Get kanban board for the organization
  const { data: kanbanData, isLoading: kanbanLoading } = useKanbanBoard(
    currentOrg?.id || "",
  );

  const updateStatus = useUpdateContentStatus();
  const queryClient = useQueryClient();

  // Sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // State for drag
  const [activeItem, setActiveItem] = useState<ContentPieceResponse | null>(
    null,
  );

  const handleDragStart = (event: DragStartEvent) => {
    const item = event.active.data.current?.item as ContentPieceResponse;
    if (item) setActiveItem(item);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragOver = (event: DragOverEvent) => {
    // optional: optimistic UI reorder here if you want instant visual feedback
  };

  const updateContent = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      contentClient.updateContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contentKeys.kanban(data.organizationId),
      });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = active.data.current?.item as ContentPieceResponse;
    const overType = over.data.current?.type;
    const overStatus = over.data.current?.status as ContentStatus;
    const overItem = over.data.current?.item as ContentPieceResponse;

    // 1. Handle cross-column drag
    let targetStatus: ContentStatus | null = null;
    if (overType === "column") {
      targetStatus = overStatus;
    } else if (overType === "card" && overItem) {
      targetStatus = overItem.status;
    }

    if (targetStatus && activeItem && activeItem.status !== targetStatus) {
      updateStatus.mutate({
        id: activeItem.id || activeItem._id!,
        status: targetStatus,
      });
      return;
    }

    // 2. Handle same-column reordering
    if (
      activeId !== overId &&
      activeItem &&
      overItem &&
      activeItem.status === overItem.status
    ) {
      const status = activeItem.status;
      const columnItems = kanbanData?.[status] || [];
      const oldIndex = columnItems.findIndex(
        (i) => (i.id || i._id) === activeId,
      );
      const newIndex = columnItems.findIndex((i) => (i.id || i._id) === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        // We update the position to the new index
        // Note: For a real production app, you'd want a bulk update or a smarter position algorithm (like fractional indexing)
        updateContent.mutate({
          id: activeItem.id || activeItem._id!,
          data: { kanbanPosition: newIndex },
        });
      }
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);

  useGSAP(
    () => {
      if (kanbanData && !hasAnimated.current) {
        gsap.from(".column-anim", {
          x: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
        hasAnimated.current = true;
      }
    },
    { scope: containerRef, dependencies: [kanbanData] },
  );

  const openAddModal = (status: ContentStatus) => {
    setEditingItem(null);
    setSelectedStatus(status);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ContentPieceResponse) => {
    setEditingItem(item);
    setSelectedStatus(item.status as ContentStatus);
    setIsModalOpen(true);
  };

  if (kanbanLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Crear Contenido</h1>
          <p className={styles.subtitle}>
            Organiza tus ideas y planifica tus publicaciones para{" "}
            {currentOrg?.name}.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.createButton}
            onClick={() => openAddModal(ContentStatus.DRAFT)}
          >
            Nueva Idea
          </button>
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          <div className="column-anim">
            <KanbanColumn
              id="col-draft"
              title="Borradores"
              status={ContentStatus.DRAFT}
              items={kanbanData?.DRAFT || []}
              count={kanbanData?.DRAFT.length || 0}
              onAddIdea={openAddModal}
              onEditIdea={openEditModal}
            />
          </div>
          <div className="column-anim">
            <KanbanColumn
              id="col-review"
              title="En Revisión"
              status={ContentStatus.IN_REVIEW}
              items={kanbanData?.IN_REVIEW || []}
              count={kanbanData?.IN_REVIEW.length || 0}
              onAddIdea={openAddModal}
              onEditIdea={openEditModal}
            />
          </div>
          <div className="column-anim">
            <KanbanColumn
              id="col-approved"
              title="Aprobado"
              status={ContentStatus.APPROVED}
              items={kanbanData?.APPROVED || []}
              count={kanbanData?.APPROVED.length || 0}
              onAddIdea={openAddModal}
              onEditIdea={openEditModal}
            />
          </div>
          <div className="column-anim">
            <KanbanColumn
              id="col-published"
              title="Publicado"
              status={ContentStatus.PUBLISHED}
              items={kanbanData?.PUBLISHED || []}
              count={kanbanData?.PUBLISHED.length || 0}
              onAddIdea={openAddModal}
              onEditIdea={openEditModal}
            />
          </div>

          <div
            className={`${styles.column} column-anim`}
            style={{
              backgroundColor: "transparent",
              borderStyle: "dashed",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              minWidth: "200px",
              flex: "0 0 200px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--muted-foreground)",
              }}
            >
              <Plus size={20} />
              <span style={{ fontWeight: 500 }}>Nuevo Grupo</span>
            </div>
          </div>
        </div>

        {/* Floating card that follows the mouse */}
        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeItem ? (
            <div
              className={styles.card}
              style={{
                boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                transform: "rotate(2deg) scale(1.03)",
                opacity: 0.95,
                cursor: "grabbing",
                pointerEvents: "none",
              }}
            >
              <div className={styles.cardTitle}>{activeItem.title}</div>
              <div className={styles.cardBody}>{activeItem.body}</div>
              <div className={styles.cardFooter}>
                <span className={styles.platformBadge}>
                  {activeItem.platform}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStatus={selectedStatus}
        organizationId={currentOrg?.id || ""}
        item={editingItem || undefined}
      />
    </div>
  );
}
