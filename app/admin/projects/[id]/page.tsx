import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!db) notFound();
  const { id } = await params;
  const rows = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  const row = rows[0];
  if (!row) notFound();

  const boundUpdate = updateProject.bind(null, row.id);

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title={`Edit: ${row.title}`} />
        <ProjectForm action={boundUpdate} defaults={row} />
      </div>
    </div>
  );
}
