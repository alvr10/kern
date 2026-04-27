import { redirect } from "next/navigation";

export default function OrgPage({ params }: { params: { slug: string } }) {
  // Redirect to the create/kanban view by default
  redirect(`/dashboard/org/${params.slug}/create`);
}
