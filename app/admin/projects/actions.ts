"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

type Result = { error: string } | void;

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}
function int(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null; // blank stays blank — Number("") is 0, not empty
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
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
    year: int(fd.get("year")),
    date: str(fd.get("date")),
    ref: str(fd.get("ref")),
    category: str(fd.get("category")),
    location: str(fd.get("location")),
    medium: str(fd.get("medium")),
    dimensions: str(fd.get("dimensions")),
    edition: str(fd.get("edition")),
    availability: str(fd.get("availability")),
    series: str(fd.get("series")),
    featured: fd.get("featured") === "on",
    weight: int(fd.get("weight")) ?? 1,
    image: str(fd.get("image")),
    gallery: (fd.getAll("gallery") as string[]).filter(Boolean),
    body: str(fd.get("body")),
  };
}

export async function createProject(_prev: unknown, fd: FormData): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db.insert(projects).values(data);
  revalidatePath("/projects");
  revalidatePath("/available");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(
  id: number,
  _prev: unknown,
  fd: FormData,
): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  if (!data.title) return { error: "Title is required." };
  await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id));
  revalidatePath("/projects");
  revalidatePath("/available");
  revalidatePath("/");
  revalidatePath(`/projects/${data.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(id: number): Promise<void> {
  await requireAdmin();
  if (!db) return;
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
  revalidatePath("/available");
  revalidatePath("/");
  redirect("/admin/projects");
}
