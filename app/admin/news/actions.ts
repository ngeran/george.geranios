"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { news } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

type Result = { error: string } | void;

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parse(fd: FormData) {
  const title = str(fd.get("title")) ?? "";
  const slug = slugify(str(fd.get("slug")) || title);
  return {
    slug,
    title,
    date: str(fd.get("date")),
    summary: str(fd.get("summary")),
    image: str(fd.get("image")),
    body: str(fd.get("body")),
  };
}

export async function createNews(_prev: unknown, fd: FormData): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db.insert(news).values(data);
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}

export async function updateNews(
  id: number,
  _prev: unknown,
  fd: FormData,
): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db.update(news).set({ ...data, updatedAt: new Date() }).where(eq(news.id, id));
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath(`/news/${data.slug}`);
  redirect("/admin/news");
}

export async function deleteNews(id: number): Promise<void> {
  await requireAdmin();
  if (!db) return;
  await db.delete(news).where(eq(news.id, id));
  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/news");
}
