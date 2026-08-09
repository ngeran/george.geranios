"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setUrl(data.url);
      else alert(data.error || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <Input type="file" accept="image/*" onChange={onFile} disabled={busy} />
      {busy && <p className="text-sm text-muted-foreground">Uploading…</p>}
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
