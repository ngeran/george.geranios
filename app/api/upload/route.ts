import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { verifyToken, SESSION_COOKIE } from "@/lib/session";
import { MAX_BYTES, detectImageType, mimeFor } from "@/lib/upload";
import { getBlobUsage, BLOB_QUOTA_BYTES, BLOB_QUOTA_MB } from "@/lib/blob";

/** Image upload → Vercel Blob. Admin-only (session cookie checked). Enforces
 *  JPEG/PNG/WebP + 5 MB and verifies the actual bytes (magic numbers) so a
 *  renamed or non-image file is rejected. */
export async function POST(req: Request) {
  const store = await cookies();
  if (!(await verifyToken(store.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set — uploads unavailable." },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 5 MB." },
      { status: 413 },
    );
  }

  // Storage quota guard: reject uploads that would push total Blob usage over
  // the configured budget.
  const usage = await getBlobUsage();
  if (usage && usage.usedBytes + file.size > BLOB_QUOTA_BYTES) {
    return NextResponse.json(
      {
        error: `Upload would exceed the ${BLOB_QUOTA_MB} MB storage quota. Delete unused files in Media to free space.`,
      },
      { status: 413 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectImageType(buf);
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported image format. Use JPEG, PNG, or WebP." },
      { status: 415 },
    );
  }

  // Sanitize the original name (no spaces, unicode, or path bits) for the path.
  const base =
    (file.name || "upload")
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "upload";
  const pathname = `${base}.${ext}`;

  try {
    const blob = await put(pathname, buf, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeFor(ext),
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error("[upload] Blob put failed", e);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 },
    );
  }
}
