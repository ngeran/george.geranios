"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

  async function addFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
      }
      setUrls((u) => [...u, ...uploaded]);
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
      <Input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} disabled={busy} />
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
    </div>
  );
}
