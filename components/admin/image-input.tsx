"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ACCEPT_ATTR, UPLOAD_NOTE, validateClientFile } from "@/lib/upload";

/** Single image: upload to /api/upload (Vercel Blob), or paste a URL. The
 *  resolved URL is carried in a hidden input named `name`. */
export function ImageInput({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-picking the same file
    const invalid = validateClientFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) setUrl(data.url);
      else setError(data.error || "Upload failed.");
    } catch {
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <Input type="file" accept={ACCEPT_ATTR} onChange={onFile} disabled={busy} />
      <p className="text-xs text-on-surface-variant">{UPLOAD_NOTE}</p>
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {url && (
        <div className="flex items-start gap-gutter">
          <Image
            src={url}
            alt=""
            width={400}
            height={300}
            className="w-48 h-auto border border-structural-gray"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setUrl("");
              setError(null);
            }}
          >
            Remove
          </Button>
        </div>
      )}
      {url && (
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Image URL"
        />
      )}
    </div>
  );
}
