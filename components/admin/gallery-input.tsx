"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ACCEPT_ATTR,
  UPLOAD_NOTE,
  UPLOAD_RECOMMENDATION,
  MAX_GALLERY_IMAGES,
  validateClientFile,
} from "@/lib/upload";

/** Multiple images, each uploaded to /api/upload. Carried as repeated hidden
 *  inputs named `name` (so formData.getAll(name) returns the URL array). */
export function GalleryInput({
  name,
  label,
  defaultValue = [],
  note,
  maxItems = MAX_GALLERY_IMAGES,
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  note?: string;
  maxItems?: number;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = urls.length >= maxItems;

  async function addFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const picked = Array.from(files);
    const room = maxItems - urls.length;
    const errors: string[] = [];
    let valid = picked.filter((f) => {
      const bad = validateClientFile(f);
      if (bad) errors.push(bad);
      return !bad;
    });
    if (valid.length > room) {
      errors.push(`Only ${room} more fit the ${maxItems}-image limit.`);
      valid = valid.slice(0, room);
    }

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
      setError(errors.length ? errors[0] : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {note && <p className="text-xs text-on-surface-variant">{note}</p>}
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
      <div className="flex items-center gap-gutter">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          multiple
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
          disabled={busy || atMax}
          className="sr-only"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy || atMax}
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Add images"}
        </Button>
        <span className="font-body text-caption text-on-surface-variant">
          {urls.length} / {maxItems}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant">{UPLOAD_NOTE}</p>
      <p className="text-xs text-on-surface-variant">{UPLOAD_RECOMMENDATION}</p>
      {atMax && (
        <p className="text-sm text-on-surface-variant">
          Gallery limit reached ({maxItems} images).
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
