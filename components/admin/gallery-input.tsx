"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ACCEPT_ATTR, UPLOAD_NOTE, validateClientFile } from "@/lib/upload";

/** Multiple images, each uploaded to /api/upload. Carried as repeated hidden
 *  inputs named `name` (so formData.getAll(name) returns the URL array). */
export function GalleryInput({
  name,
  label,
  defaultValue = [],
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const picked = Array.from(files);
    const errors: string[] = [];
    const valid = picked.filter((f) => {
      const bad = validateClientFile(f);
      if (bad) errors.push(bad);
      return !bad;
    });

    setBusy(true);
    try {
      const results = await Promise.allSettled(
        valid.map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.url) return data.url as string;
          throw new Error(data.error || "Upload failed");
        }),
      );
      const uploaded: string[] = [];
      for (const r of results) {
        if (r.status === "fulfilled") uploaded.push(r.value);
        else errors.push(r.reason instanceof Error ? r.reason.message : "Upload failed");
      }
      if (uploaded.length) setUrls((u) => [...u, ...uploaded]);
      setError(
        errors.length ? `${errors.length} of ${picked.length} rejected — ${errors[0]}` : null,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {urls.map((u, i) => (
        <div key={i} className="flex items-center gap-gutter">
          <input type="hidden" name={name} value={u} />
          <Image src={u} alt="" width={120} height={90} className="w-24 h-auto border border-structural-gray" />
          <Input
            value={u}
            onChange={(e) =>
              setUrls((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))
            }
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUrls((prev) => prev.filter((_, j) => j !== i))}
          >
            Remove
          </Button>
        </div>
      ))}
      <Input
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
        disabled={busy}
      />
      <p className="text-xs text-on-surface-variant">{UPLOAD_NOTE}</p>
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
