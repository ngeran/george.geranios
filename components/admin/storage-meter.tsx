import { BLOB_QUOTA_BYTES, BLOB_QUOTA_MB, formatMB, type BlobUsage } from "@/lib/blob";

/** Image-storage usage bar (Vercel Blob vs the configured quota). Server-rendered. */
export function StorageMeter({ usage }: { usage: BlobUsage | null }) {
  if (!usage) {
    return (
      <p className="font-body text-caption text-on-surface-variant border border-structural-gray p-gutter">
        Storage tracking unavailable — set <code>BLOB_READ_WRITE_TOKEN</code> to enable.
      </p>
    );
  }

  const pct = Math.min(100, Math.round((usage.usedBytes / BLOB_QUOTA_BYTES) * 100));
  const danger = pct >= 95;
  const warn = pct >= 80;

  return (
    <div className="border border-structural-gray p-gutter">
      <div className="flex items-baseline justify-between mb-unit gap-gutter">
        <span className="font-display text-label-caps uppercase text-on-surface-variant">
          Image storage
        </span>
        <span className="font-body text-caption text-on-surface-variant whitespace-nowrap">
          {formatMB(usage.usedBytes)} MB of {BLOB_QUOTA_MB} MB · {usage.count} file
          {usage.count === 1 ? "" : "s"}
        </span>
      </div>
      <div
        className="h-2 w-full bg-surface-container rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full transition-all ${danger ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </div>
      {warn && (
        <p
          className={`font-body text-caption mt-unit ${
            danger ? "text-destructive" : "text-on-surface-variant"
          }`}
        >
          {danger
            ? "Storage almost full — delete unused files in Media to free space."
            : "Approaching the storage limit."}
        </p>
      )}
    </div>
  );
}
