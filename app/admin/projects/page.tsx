import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { getProjects } from "@/lib/data";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  // Admin reads from the DB when present (so edits/deletes reflect); otherwise
  // shows the seed fallback as a read-only preview.
  const rows = db
    ? await db.select().from(projects).orderBy(desc(projects.year))
    : await getProjects();

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="Projects" />

        {!db && (
          <p className="font-body text-caption text-on-surface-variant border border-structural-gray p-gutter mb-section-gap">
            Showing seed preview — set <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push</code> to enable editing.
          </p>
        )}

        <div className="mb-section-gap">
          <Link href="/admin/projects/new">
            <Button>+ New project</Button>
          </Link>
        </div>

        <div className="border border-structural-gray">
          <div className="grid grid-cols-[1fr_6rem_8rem_8rem] gap-gutter px-gutter py-unit font-display text-label-caps uppercase text-on-surface-variant border-b border-structural-gray">
            <span>Title</span>
            <span>Year</span>
            <span>Availability</span>
            <span></span>
          </div>
          {rows.length === 0 && (
            <p className="px-gutter py-gutter text-on-surface-variant">No projects yet.</p>
          )}
          {rows.map((p: any) => (
            <div
              key={p.id ?? p.slug}
              className="grid grid-cols-[1fr_6rem_8rem_8rem] gap-gutter px-gutter py-unit items-center border-b border-structural-gray last:border-0"
            >
              <span className="truncate">{p.title}</span>
              <span className="text-on-surface-variant">{p.year ?? "—"}</span>
              <span className="text-on-surface-variant text-sm">{p.availability ?? "—"}</span>
              <div className="flex gap-unit">
                {db && p.id && (
                  <Link href={`/admin/projects/${p.id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                )}
                {db && p.id && (
                  <form action={deleteProject.bind(null, p.id as number)}>
                    <Button type="submit" size="sm" variant="outline">
                      Delete
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
