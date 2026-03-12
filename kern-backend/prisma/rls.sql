-- ============================================================
-- Kern — Row Level Security Policies
-- Run this in the Supabase SQL editor after running migrations.
-- All tables live in the public schema.
-- auth.uid() refers to the currently authenticated Supabase user.
--
-- NOTE: Prisma fields without @map keep camelCase column names
-- in Postgres, so multi-word columns are double-quoted below.
-- ============================================================

-- Helper function: returns true if the calling user is a member
-- of the given organization with any of the specified roles.
create or replace function public.is_org_member(
  org_id text,
  allowed_roles "MemberRole"[]
)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.memberships m
    where m."organizationId" = org_id
      and m."profileId"      = auth.uid()::text
      and m.role             = any(allowed_roles)
  );
$$;

-- ============================================================
-- profiles
-- ============================================================

alter table public.profiles enable row level security;

create policy "profiles: self or shared org member can select"
  on public.profiles for select
  using (
    id = auth.uid()::text
    or exists (
      select 1
      from public.memberships m1
      join public.memberships m2 on m2."organizationId" = m1."organizationId"
      where m1."profileId" = auth.uid()::text
        and m2."profileId" = profiles.id
    )
  );

create policy "profiles: owner can update"
  on public.profiles for update
  using (id = auth.uid()::text)
  with check (id = auth.uid()::text);

-- Insert is handled exclusively by the DB trigger (handle_new_user).
create policy "profiles: trigger insert only"
  on public.profiles for insert
  with check (id = auth.uid()::text);

-- ============================================================
-- plans
-- ============================================================

alter table public.plans enable row level security;

create policy "plans: authenticated read"
  on public.plans for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- subscriptions
-- ============================================================

alter table public.subscriptions enable row level security;

create policy "subscriptions: org admin can select"
  on public.subscriptions for select
  using (
    public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
  );

-- ============================================================
-- organizations
-- ============================================================

alter table public.organizations enable row level security;

create policy "organizations: members can select"
  on public.organizations for select
  using (
    public.is_org_member(
      id,
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
    )
  );

create policy "organizations: authenticated can insert"
  on public.organizations for insert
  with check (auth.role() = 'authenticated');

create policy "organizations: admin can update"
  on public.organizations for update
  using  (public.is_org_member(id, array['ADMIN'::"MemberRole"]))
  with check (public.is_org_member(id, array['ADMIN'::"MemberRole"]));

create policy "organizations: admin can delete"
  on public.organizations for delete
  using (public.is_org_member(id, array['ADMIN'::"MemberRole"]));

-- ============================================================
-- memberships
-- ============================================================

alter table public.memberships enable row level security;

create policy "memberships: org members can select"
  on public.memberships for select
  using (
    public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
    )
  );

create policy "memberships: admin can insert"
  on public.memberships for insert
  with check (
    public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
  );

create policy "memberships: admin can update"
  on public.memberships for update
  using  (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]))
  with check (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]));

create policy "memberships: admin or self can delete"
  on public.memberships for delete
  using (
    public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
    or "profileId" = auth.uid()::text
  );

-- ============================================================
-- invitations
-- ============================================================

alter table public.invitations enable row level security;

create policy "invitations: admin or invitee can select"
  on public.invitations for select
  using (
    public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
    or email = (select email from public.profiles where id = auth.uid()::text)
  );

create policy "invitations: admin can insert"
  on public.invitations for insert
  with check (
    public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
    and "invitedById" = auth.uid()::text
  );

create policy "invitations: admin can update"
  on public.invitations for update
  using  (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]))
  with check (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]));

create policy "invitations: admin can delete"
  on public.invitations for delete
  using (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]));

-- ============================================================
-- projects
-- ============================================================

alter table public.projects enable row level security;

create policy "projects: org members can select"
  on public.projects for select
  using (
    public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
    )
  );

create policy "projects: admin or editor can insert"
  on public.projects for insert
  with check (
    public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
    )
  );

create policy "projects: admin or editor can update"
  on public.projects for update
  using (
    public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
    )
  )
  with check (
    public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
    )
  );

create policy "projects: admin can delete"
  on public.projects for delete
  using (public.is_org_member("organizationId", array['ADMIN'::"MemberRole"]));

-- ============================================================
-- content_pieces
-- ============================================================

alter table public.content_pieces enable row level security;

create policy "content_pieces: org members can select"
  on public.content_pieces for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = content_pieces."projectId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
        )
    )
  );

create policy "content_pieces: admin or editor can insert"
  on public.content_pieces for insert
  with check (
    "authorId" = auth.uid()::text
    and exists (
      select 1 from public.projects p
      where p.id = content_pieces."projectId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
        )
    )
  );

create policy "content_pieces: admin or editor can update"
  on public.content_pieces for update
  using (
    exists (
      select 1 from public.projects p
      where p.id = content_pieces."projectId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
        )
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = content_pieces."projectId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
        )
    )
  );

create policy "content_pieces: admin can delete"
  on public.content_pieces for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = content_pieces."projectId"
        and public.is_org_member(p."organizationId", array['ADMIN'::"MemberRole"])
    )
  );

-- ============================================================
-- content_reviews
-- ============================================================

alter table public.content_reviews enable row level security;

create policy "content_reviews: org members can select"
  on public.content_reviews for select
  using (
    exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = content_reviews."contentPieceId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
        )
    )
  );

-- Any org member may submit a review.
create policy "content_reviews: org members can insert"
  on public.content_reviews for insert
  with check (
    "reviewerId" = auth.uid()::text
    and exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = content_reviews."contentPieceId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
        )
    )
  );

-- Reviews are immutable once submitted; no update policy.

create policy "content_reviews: admin can delete"
  on public.content_reviews for delete
  using (
    exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = content_reviews."contentPieceId"
        and public.is_org_member(p."organizationId", array['ADMIN'::"MemberRole"])
    )
  );

-- ============================================================
-- comments
-- ============================================================

alter table public.comments enable row level security;

create policy "comments: org members can select"
  on public.comments for select
  using (
    exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = comments."contentPieceId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
        )
    )
  );

create policy "comments: org members can insert"
  on public.comments for insert
  with check (
    "authorId" = auth.uid()::text
    and exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = comments."contentPieceId"
        and public.is_org_member(
          p."organizationId",
          array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
        )
    )
  );

create policy "comments: author or admin can update"
  on public.comments for update
  using (
    "authorId" = auth.uid()::text
    or exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = comments."contentPieceId"
        and public.is_org_member(p."organizationId", array['ADMIN'::"MemberRole"])
    )
  )
  with check (
    "authorId" = auth.uid()::text
    or exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = comments."contentPieceId"
        and public.is_org_member(p."organizationId", array['ADMIN'::"MemberRole"])
    )
  );

create policy "comments: author or admin can delete"
  on public.comments for delete
  using (
    "authorId" = auth.uid()::text
    or exists (
      select 1
      from public.content_pieces cp
      join public.projects p on p.id = cp."projectId"
      where cp.id = comments."contentPieceId"
        and public.is_org_member(p."organizationId", array['ADMIN'::"MemberRole"])
    )
  );

-- ============================================================
-- ai_generations
-- ============================================================

alter table public.ai_generations enable row level security;

create policy "ai_generations: owner or admin can select"
  on public.ai_generations for select
  using (
    "profileId" = auth.uid()::text
    or public.is_org_member("organizationId", array['ADMIN'::"MemberRole"])
  );

create policy "ai_generations: owner can insert"
  on public.ai_generations for insert
  with check (
    "profileId" = auth.uid()::text
    and public.is_org_member(
      "organizationId",
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole"]
    )
  );

-- AI generation logs are immutable; no update or delete policies.

-- ============================================================
-- notifications
-- ============================================================

alter table public.notifications enable row level security;

create policy "notifications: owner can select"
  on public.notifications for select
  using ("profileId" = auth.uid()::text);

-- Inserts are performed by server-side triggers / Edge Functions (service role).

create policy "notifications: owner can update"
  on public.notifications for update
  using  ("profileId" = auth.uid()::text)
  with check ("profileId" = auth.uid()::text);

create policy "notifications: owner can delete"
  on public.notifications for delete
  using ("profileId" = auth.uid()::text);
