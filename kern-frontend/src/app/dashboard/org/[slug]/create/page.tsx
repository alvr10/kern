"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import {
  useKanbanBoard,
  useUpdateContentStatus,
} from "@/lib/api/content-service/hooks";
import { Sparkles, Plus } from "lucide-react";
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

  // 1. Get organizations to find the current one by slug
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find((org) => org.slug === slug);

  // 2. Get kanban board for the organization
  const { data: kanbanData, isLoading: kanbanLoading } = useKanbanBoard(
    currentOrg?.id || "",
  );

  const updateStatus = useUpdateContentStatus();

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

  const handleDragOver = (event: DragOverEvent) => {
    // optional: optimistic UI reorder here if you want instant visual feedback
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const activeItem = active.data.current?.item as ContentPieceResponse;
    const overType = over.data.current?.type;
    const overStatus = over.data.current?.status as ContentStatus;
    const overItem = over.data.current?.item as ContentPieceResponse;

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
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (kanbanData) {
        gsap.from(".column-anim", {
          x: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    },
    { scope: containerRef, dependencies: [kanbanData] },
  );

  const openAddModal = (status: ContentStatus) => {
    setSelectedStatus(status);
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
          <button className={styles.generateButton}>
            <Sparkles size={16} />
            Generar con IA
          </button>
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
      />
    </div>
  );
}
