import { db } from "@/lib/db";
import { getSiteContent } from "@/lib/data";
import { AdminHeader } from "@/components/admin/admin-header";
import { SiteContentForm } from "@/components/admin/site-content-form";
import { saveSiteContent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const defaults = await getSiteContent();

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="Site Content" />

        {!db && (
          <p className="font-body text-caption text-on-surface-variant border border-structural-gray p-gutter mb-section-gap">
            Showing seed preview — set <code>DATABASE_URL</code> and run{" "}
            <code>npm run db:push</code> to enable editing.
          </p>
        )}

        <SiteContentForm action={saveSiteContent} defaults={defaults} disabled={!db} />
      </div>
    </div>
  );
}
