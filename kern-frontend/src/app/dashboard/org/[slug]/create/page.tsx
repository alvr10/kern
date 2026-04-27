"use client";

import React, { useRef, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { useProjects } from "@/lib/api/projects-service/hooks";
import {
  useKanbanBoard,
  useCreateContent,
  useUpdateContentStatus,
} from "@/lib/api/content-service/hooks";
import {
  Plus,
  Sparkles,
  MoreHorizontal,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./page.module.css";
import {
  ContentPieceResponse,
  ContentStatus,
} from "@/lib/api/content-service/types";
import { SocialPlatform } from "@/lib/api/types";

/**
 * Sortable Item (Kanban Card)
 */
function SortableCard({ item }: { item: ContentPieceResponse }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
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
        {item.status === "APPROVED" && (
          <CheckCircle2 size={14} color="#10b981" />
        )}
        {item.status === "DRAFT" && <Clock size={14} color="#666" />}
        {item.status === "IN_REVIEW" && (
          <AlertCircle size={14} color="#f59e0b" />
        )}
      </div>
    </div>
  );
}

/**
 * Kanban Column Section
 */
function KanbanColumn({
  id,
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
  const { setNodeRef } = useSortable({
    id,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <div ref={setNodeRef} className={styles.column}>
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
      <div className={styles.cardList}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <SortableCard key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
      <button
        className={styles.newCardButton}
        onClick={() => onAddIdea(status)}
      >
        <PlusCircle size={16} />
        Nuevo Idea
      </button>
    </div>
  );
}

/**
 * Create Idea Modal
 */
function CreateIdeaModal({
  isOpen,
  onClose,
  initialStatus,
  projectId,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialStatus: ContentStatus;
  projectId: string;
}) {
  const [body, setBody] = useState("");
  const [platform, setPlatform] = useState<SocialPlatform>(
    SocialPlatform.INSTAGRAM,
  );
  const createContent = useCreateContent();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createContent.mutate(
      {
        projectId,
        body,
        platform,
        status: initialStatus,
        scheduledFor: new Date().toISOString(), // Default to now
      },
      {
        onSuccess: () => {
          setBody("");
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
                  <option value={"THREADS"}>Threads</option>
                  <option value={SocialPlatform.TIKTOK}>TikTok</option>
                </select>
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
                  disabled={createContent.isPending}
                >
                  {createContent.isPending ? "Creando..." : "Crear Idea"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

import { cn } from "@/lib/utils";

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

  // 2. Get projects for this organization
  const { data: projects, isLoading: projectsLoading } = useProjects(
    currentOrg?.id || "",
  );

  // 3. Get kanban board for the first project
  const defaultProject = projects?.[0];
  const { data: kanbanData, isLoading: kanbanLoading } = useKanbanBoard(
    defaultProject?.id || "",
  );

  const updateStatus = useUpdateContentStatus();

  // Sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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
      updateStatus.mutate({ id: activeItem.id, status: targetStatus });
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

  if (projectsLoading || kanbanLoading) {
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
      </DndContext>

      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialStatus={selectedStatus}
        projectId={defaultProject?.id || ""}
      />
    </div>
  );
}
