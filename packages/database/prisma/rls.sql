-- ============================================================
-- Kern — Row Level Security Policies
-- Run this in the Supabase SQL editor after running migrations.
-- All tables live in the public schema.
-- auth.uid() refers to the currently authenticated Supabase user.
--
-- NOTE: Prisma fields are mapped to snake_case in the database.
-- All multi-word columns are now snake_case.
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
    where m.organization_id = org_id
      and m.profile_id      = auth.uid()::text
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
      join public.memberships m2 on m2.organization_id = m1.organization_id
      where m1.profile_id = auth.uid()::text
        and m2.profile_id = profiles.id
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
    public.is_org_member(organization_id, array['ADMIN'::"MemberRole"])
  );

-- ============================================================
-- organizations
-- ============================================================

alter table public.organizations enable row level security;

create policy "organizations: members can select"
  on public.organizations for select
  using (
    owner_id = auth.uid()::text
    or public.is_org_member(
      id,
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
    )
  );

create policy "organizations: authenticated can insert"
  on public.organizations for insert
  with check (
    auth.role() = 'authenticated'
    and owner_id = auth.uid()::text
  );

create policy "organizations: owner or admin can update"
  on public.organizations for update
  using  (
    owner_id = auth.uid()::text
    or public.is_org_member(id, array['ADMIN'::"MemberRole"])
  )
  with check (
    owner_id = auth.uid()::text
    or public.is_org_member(id, array['ADMIN'::"MemberRole"])
  );

create policy "organizations: owner or admin can delete"
  on public.organizations for delete
  using (
    owner_id = auth.uid()::text
    or public.is_org_member(id, array['ADMIN'::"MemberRole"])
  );

-- ============================================================
-- memberships
-- ============================================================

alter table public.memberships enable row level security;

create policy "memberships: org members can select"
  on public.memberships for select
  using (
    public.is_org_member(
      organization_id,
      array['ADMIN'::"MemberRole", 'EDITOR'::"MemberRole", 'VIEWER'::"MemberRole"]
    )
  );

create policy "memberships: admin can insert"
  on public.memberships for insert
  with check (
    public.is_org_member(organization_id, array['ADMIN'::"MemberRole"])
  );

create policy "memberships: admin can update"
  on public.memberships for update
  using  (public.is_org_member(organization_id, array['ADMIN'::"MemberRole"]))
  with check (public.is_org_member(organization_id, array['ADMIN'::"MemberRole"]));

create policy "memberships: admin or self can delete"
  on public.memberships for delete
  using (
    public.is_org_member(organization_id, array['ADMIN'::"MemberRole"])
    or profile_id = auth.uid()::text
  );

-- ============================================================
-- invitations
-- ============================================================

alter table public.invitations enable row level security;

create policy "invitations: admin or invitee can select"
  on public.invitations for select
  using (
    public.is_org_member(organization_id, array['ADMIN'::"MemberRole"])
    or email = (select email from public.profiles where id = auth.uid()::text)
  );

create policy "invitations: admin can insert"
  on public.invitations for insert
  with check (
    public.is_org_member(organization_id, array['ADMIN'::"MemberRole"])
    and invited_by_id = auth.uid()::text
  );

create policy "invitations: admin can update"
  on public.invitations for update
  using  (public.is_org_member(organization_id, array['ADMIN'::"MemberRole"]))
  with check (public.is_org_member(organization_id, array['ADMIN'::"MemberRole"]));

create policy "invitations: admin can delete"
  on public.invitations for delete
  using (public.is_org_member(organization_id, array['ADMIN'::"MemberRole"]));
