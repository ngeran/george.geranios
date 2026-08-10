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
  validateClientFile,
} from "@/lib/upload";

/** Single image: upload to /api/upload (Vercel Blob), or paste a URL. The
 *  resolved URL is carried in a hidden input named `name`. */
export function ImageInput({
  name,
  label,
  defaultValue = "",
  note,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  note?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
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
      {note && <p className="text-xs text-on-surface-variant">{note}</p>}
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-gutter">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={onFile}
          disabled={busy}
          className="sr-only"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
        </Button>
        {url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setUrl("");
              setError(null);
            }}
          >
            Remove
          </Button>
        )}
      </div>
      <p className="text-xs text-on-surface-variant">{UPLOAD_NOTE}</p>
      <p className="text-xs text-on-surface-variant">{UPLOAD_RECOMMENDATION}</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {url && (
        <Image
          src={url}
          alt=""
          width={400}
          height={300}
          className="w-48 h-auto border border-structural-gray"
        />
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
