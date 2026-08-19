import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { news } from "@/db/schema";
import { getNews } from "@/lib/data";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { deleteNews } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  // Admin reads from the DB when present (so edits/deletes reflect); otherwise
  // shows the seed fallback as a read-only preview.
  const rows = db
    ? await db.select().from(news).orderBy(desc(news.date))
    : await getNews();

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="News" />

        {!db && (
          <p className="font-body text-caption text-on-surface-variant border border-structural-gray p-gutter mb-section-gap">
            Showing seed preview — set <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push</code> to enable editing.
          </p>
        )}

        <div className="mb-section-gap">
          <Link href="/admin/news/new">
            <Button>+ New news item</Button>
          </Link>
        </div>

        <div className="border border-structural-gray">
          <div className="grid grid-cols-[1fr_10rem_8rem] gap-gutter px-gutter py-unit font-display text-label-caps uppercase text-on-surface-variant border-b border-structural-gray">
            <span>Title</span>
            <span>Date</span>
            <span></span>
          </div>
          {rows.length === 0 && (
            <p className="px-gutter py-gutter text-on-surface-variant">No news items yet.</p>
          )}
          {rows.map((n: any) => (
            <div
              key={n.id ?? n.slug}
              className="grid grid-cols-[1fr_10rem_8rem] gap-gutter px-gutter py-unit items-center border-b border-structural-gray last:border-0"
            >
              <span className="truncate">{n.title}</span>
              <span className="text-on-surface-variant">{n.date ?? "—"}</span>
              <div className="flex gap-unit">
                {db && n.id && (
                  <Link href={`/admin/news/${n.id}`}>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                )}
                {db && n.id && (
                  <form action={deleteNews.bind(null, n.id as number)}>
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
