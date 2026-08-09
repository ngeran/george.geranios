import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publications } from "@/db/schema";
import { AdminHeader } from "@/components/admin/admin-header";
import { PublicationForm } from "@/components/admin/publication-form";
import { updatePublication } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!db) notFound();
  const { id } = await params;
  const rows = await db.select().from(publications).where(eq(publications.id, Number(id))).limit(1);
  const row = rows[0];
  if (!row) notFound();

  const boundUpdate = updatePublication.bind(null, row.id);

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title={`Edit: ${row.title}`} />
        <PublicationForm action={boundUpdate} defaults={row} />
      </div>
    </div>
  );
}
