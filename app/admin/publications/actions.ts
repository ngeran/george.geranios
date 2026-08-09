"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { publications } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

type Result = { error: string } | void;

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
function int(v: FormDataEntryValue | null): number | null {
  const n = Number(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}
function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parse(fd: FormData) {
  const title = str(fd.get("title")) ?? "";
  const slug = str(fd.get("slug")) || slugify(title);
  return {
    slug,
    title,
    year: int(fd.get("year")),
    date: str(fd.get("date")),
    ref: str(fd.get("ref")),
    category: str(fd.get("category")),
    publisher: str(fd.get("publisher")),
    author: str(fd.get("author")),
    isbn: str(fd.get("isbn")),
    pages: str(fd.get("pages")),
    format: str(fd.get("format")),
    edition: str(fd.get("edition")),
    image: str(fd.get("image")),
    gallery: fd.getAll("gallery").filter(Boolean) as string[],
    body: str(fd.get("body")),
  };
}

export async function createPublication(_prev: unknown, fd: FormData): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db.insert(publications).values(data);
  revalidatePath("/publications");
  revalidatePath("/");
  redirect("/admin/publications");
}

export async function updatePublication(
  id: number,
  _prev: unknown,
  fd: FormData,
): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db
    .update(publications)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(publications.id, id));
  revalidatePath("/publications");
  revalidatePath("/");
  revalidatePath(`/publications/${data.slug}`);
  redirect("/admin/publications");
}

export async function deletePublication(id: number): Promise<void> {
  await requireAdmin();
  if (!db) return;
  await db.delete(publications).where(eq(publications.id, id));
  revalidatePath("/publications");
  revalidatePath("/");
  redirect("/admin/publications");
}
