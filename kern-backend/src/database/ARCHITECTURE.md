# Kern — Database Architecture

## Split Overview

| Concern         | Database                | Why                                                         |
| --------------- | ----------------------- | ----------------------------------------------------------- |
| Auth / Profiles | **Supabase PostgreSQL** | Tied to Supabase Auth UUID, strict identity                 |
| Organizations   | **Supabase PostgreSQL** | Relational access control, billing anchor                   |
| Memberships     | **Supabase PostgreSQL** | ACID role enforcement per user/org pair                     |
| Invitations     | **Supabase PostgreSQL** | Transactional, token-based, expires                         |
| Plans           | **Supabase PostgreSQL** | Static catalog, FK to subscriptions                         |
| Subscriptions   | **Supabase PostgreSQL** | Financial data, strict consistency with Stripe              |
| Projects        | **Supabase PostgreSQL** | Relational anchor for content, org scoping                  |
| Content Pieces  | **MongoDB**             | Document-shaped, flexible body, embeds reviews & comments   |
| Comments        | **MongoDB**             | Embedded in ContentPiece, no cross-table joins needed       |
| Content Reviews | **MongoDB**             | Embedded in ContentPiece, approval state lives with content |
| AI Generations  | **MongoDB**             | Append-only log, high volume, flexible per-model metadata   |
| Notifications   | **MongoDB**             | Per-user activity feed, document-shaped, no joins           |

---

## Cross-DB Reference Convention

MongoDB documents reference PostgreSQL rows using **plain string IDs** — never ObjectId for cross-DB refs.

| MongoDB field    | Points to                                                   |
| ---------------- | ----------------------------------------------------------- |
| `profileId`      | `profiles.id` — Supabase Auth UUID (string)                 |
| `organizationId` | `organizations.id` — cuid (string)                          |
| `projectId`      | `projects.id` — cuid (string)                               |
| `contentPieceId` | `content_pieces._id` — MongoDB ObjectId (within Mongo only) |

---

## Environment Variables

```env
# PostgreSQL — Supabase
DATABASE_URL="postgresql://..."   # Transaction pooler, port 6543
DIRECT_URL="postgresql://..."     # Direct connection, port 5432

# MongoDB
MONGODB_URI="mongodb+srv://..."   # MongoDB Atlas connection string
```

---

## Key Design Decisions

**Why embed Comments and Reviews inside ContentPiece?**
They are never queried independently — you always load them in the context of a piece. Embedding eliminates a join and maps naturally to how the Kanban card UI renders.

**Why keep Projects in PostgreSQL if content is in MongoDB?**
Project membership and visibility rules are enforced relationally alongside org membership. A MongoDB document referencing `projectId` can always be validated against the PostgreSQL `projects` table at the API layer.

**Why is AiGeneration in MongoDB?**
It's a high-volume, append-only log with flexible metadata that varies by model and action type. MongoDB's schemaless nature handles new model fields without migrations.
