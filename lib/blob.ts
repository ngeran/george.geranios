import { list } from "@vercel/blob";

/**
 * Server-only helpers for Vercel Blob. Uploaded images live here (NOT in the
 * Neon database — the DB only stores URL strings). These power the storage
 * meter, the upload quota guard, and the Media page.
 */

/** Storage budget in MB. Set BLOB_QUOTA_MB to your Vercel Blob plan's limit. */
export const BLOB_QUOTA_MB = Number(process.env.BLOB_QUOTA_MB) || 500;
export const BLOB_QUOTA_BYTES = BLOB_QUOTA_MB * 1024 * 1024;

export type BlobUsage = { usedBytes: number; count: number };
export type BlobItem = {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

async function collect<T>(map: (b: Awaited<ReturnType<typeof list>>["blobs"][number]) => T): Promise<{ items: T[]; usedBytes: number; count: number } | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const items: T[] = [];
    let usedBytes = 0;
    let count = 0;
    let cursor: string | undefined;
    do {
      const res = await list({ cursor, limit: 1000 });
      for (const b of res.blobs) {
        items.push(map(b));
        usedBytes += b.size;
        count++;
      }
      cursor = res.hasMore ? res.cursor : undefined;
    } while (cursor);
    return { items, usedBytes, count };
  } catch (e) {
    console.error("[blob] list failed", e);
    return null;
  }
}

/** Total bytes + count of all stored blobs. Null if Blob isn't configured. */
export async function getBlobUsage(): Promise<BlobUsage | null> {
  const r = await collect(() => null);
  if (!r) return null;
  return { usedBytes: r.usedBytes, count: r.count };
}

/** Every blob, newest first. Null if Blob isn't configured. */
export async function listBlobs(): Promise<BlobItem[] | null> {
  const r = await collect((b) => ({
    url: b.url,
    pathname: b.pathname,
    size: b.size,
    uploadedAt: new Date(b.uploadedAt),
  }));
  if (!r) return null;
  return (r.items as BlobItem[]).sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
}

export const formatMB = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  return mb >= 10 ? mb.toFixed(0) : mb.toFixed(1);
};
