import Image from "next/image";
import { AdminHeader } from "@/components/admin/admin-header";
import { StorageMeter } from "@/components/admin/storage-meter";
import { Button } from "@/components/ui/button";
import { listBlobs, getBlobUsage, formatMB } from "@/lib/blob";
import { getReferencedImageUrls } from "@/lib/data";
import { deleteBlob } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const [blobs, usage, referenced] = await Promise.all([
    listBlobs(),
    getBlobUsage(),
    getReferencedImageUrls(),
  ]);

  return (
    <div className="px-edge-margin-mobile lg:px-edge-margin-desktop py-gutter">
      <div className="max-w-[1100px] mx-auto">
        <AdminHeader title="Media" />

        <div className="mb-section-gap">
          <StorageMeter usage={usage} />
        </div>

        {blobs === null ? (
          <p className="font-body text-caption text-on-surface-variant border border-structural-gray p-gutter">
            Uploads aren&apos;t configured — set <code>BLOB_READ_WRITE_TOKEN</code> to manage images.
          </p>
        ) : blobs.length === 0 ? (
          <p className="font-body text-body-md text-on-surface-variant">No uploads yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {blobs.map((b) => {
              const inUse = referenced.has(b.url);
              return (
                <div key={b.url} className="border border-structural-gray flex flex-col">
                  <div className="relative aspect-[4/3] bg-surface-container">
                    <Image
                      src={b.url}
                      alt={b.pathname}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-gutter flex-1 flex flex-col gap-unit">
                    <div className="font-body text-caption text-on-surface truncate" title={b.pathname}>
                      {b.pathname}
                    </div>
                    <div className="font-body text-caption text-on-surface-variant">
                      {formatMB(b.size)} MB · {b.uploadedAt.toLocaleDateString()}
                    </div>
                    <div className="mt-unit">
                      {inUse ? (
                        <span className="inline-block font-display text-label-caps uppercase text-on-surface-variant border border-structural-gray px-unit py-1">
                          In use
                        </span>
                      ) : (
                        <form action={deleteBlob.bind(null, b.url)}>
                          <Button type="submit" size="sm" variant="outline">
                            Delete
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
