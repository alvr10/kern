"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { useOrganizations } from "@/lib/api/organizations-service/hooks";
import { useProjects } from "@/lib/api/projects-service/hooks";
import { useKanbanBoard } from "@/lib/api/content-service/hooks";
import { 
  Plus, 
  Sparkles, 
  MoreHorizontal, 
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Layout
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./page.module.css";
import { ContentPieceResponse, ContentStatus } from "@/lib/api/content-service/types";

/**
 * Kanban Column Section
 */
function KanbanColumn({ 
  title, 
  status, 
  items, 
  count 
}: { 
  title: string; 
  status: ContentStatus; 
  items: ContentPieceResponse[];
  count: number;
}) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          {title}
          <span className={styles.count}>{count}</span>
        </div>
        <div className={styles.columnActions}>
          <button className={styles.iconButton}><Plus size={16} /></button>
          <button className={styles.iconButton}><MoreHorizontal size={16} /></button>
        </div>
      </div>
      <div className={styles.cardList}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardBody}>
              {item.body}
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.platformBadge}>{item.platform}</span>
              {item.status === "APPROVED" && <CheckCircle2 size={14} color="#10b981" />}
              {item.status === "DRAFT" && <Clock size={14} color="#666" />}
              {item.status === "IN_REVIEW" && <AlertCircle size={14} color="#f59e0b" />}
            </div>
          </div>
        ))}
      </div>
      <button className={styles.newCardButton}>
        <PlusCircle size={16} />
        Nuevo Idea
      </button>
    </div>
  );
}

/**
 * Create Content (Kanban) Page
 */
export default function CreateContentPage(): React.JSX.Element {
  const params = useParams();
  const slug = params.slug as string;

  // 1. Get organizations to find the current one by slug
  const { data: organizations } = useOrganizations();
  const currentOrg = organizations?.find(org => org.slug === slug);

  // 2. Get projects for this organization
  const { data: projects, isLoading: projectsLoading } = useProjects(currentOrg?.id || "");
  
  // 3. Get kanban board for the first project (default behavior)
  const defaultProject = projects?.[0];
  const { data: kanbanData, isLoading: kanbanLoading } = useKanbanBoard(defaultProject?.id || "");

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (kanbanData) {
      gsap.from(".column-anim", {
        x: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });
    }
  }, { scope: containerRef, dependencies: [kanbanData] });

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
            Organiza tus ideas y planifica tus publicaciones para {currentOrg?.name}.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.generateButton}>
            <Sparkles size={16} />
            Generar con IA
          </button>
          <button className={styles.createButton}>
            Nueva Idea
          </button>
        </div>
      </header>

      <div className={styles.board}>
        <div className="column-anim">
          <KanbanColumn 
            title="Borradores" 
            status={ContentStatus.DRAFT} 
            items={kanbanData?.DRAFT || []} 
            count={kanbanData?.DRAFT.length || 0}
          />
        </div>
        <div className="column-anim">
          <KanbanColumn 
            title="En Revisión" 
            status={ContentStatus.IN_REVIEW} 
            items={kanbanData?.IN_REVIEW || []} 
            count={kanbanData?.IN_REVIEW.length || 0}
          />
        </div>
        <div className="column-anim">
          <KanbanColumn 
            title="Aprobado" 
            status={ContentStatus.APPROVED} 
            items={kanbanData?.APPROVED || []} 
            count={kanbanData?.APPROVED.length || 0}
          />
        </div>
        <div className="column-anim">
          <KanbanColumn 
            title="Publicado" 
            status={ContentStatus.PUBLISHED} 
            items={kanbanData?.PUBLISHED || []} 
            count={kanbanData?.PUBLISHED.length || 0}
          />
        </div>
        
        {/* Placeholder for adding new groups/columns like in the image */}
        <div className={`${styles.column} column-anim`} style={{ backgroundColor: "transparent", borderStyle: "dashed", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#444" }}>
            <Plus size={20} />
            <span style={{ fontWeight: 500 }}>Nuevo Grupo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
