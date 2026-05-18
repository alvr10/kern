import { redirect } from 'next/navigation';

export default async function OrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Redirect to the create/kanban view by default
  redirect(`/dashboard/org/${slug}/create`);
}
