"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { siteContent } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

type Result = { error: string } | void;

function str(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

function parse(fd: FormData) {
  return {
    contactEmail: str(fd.get("contactEmail")),
    contactInstagramUrl: str(fd.get("contactInstagramUrl")),
    contactInstagramHandle: str(fd.get("contactInstagramHandle")),
    contactIntro: str(fd.get("contactIntro")),
    aboutPortrait: str(fd.get("aboutPortrait")),
    aboutBio: str(fd.get("aboutBio")),
    aboutExhibitions: str(fd.get("aboutExhibitions")),
    availableHeading: str(fd.get("availableHeading")),
    availableIntro: str(fd.get("availableIntro")),
    heroTitle: str(fd.get("heroTitle")),
    heroSubtitle: str(fd.get("heroSubtitle")),
  };
}

/** Upsert the singleton site-content row (id = 1). */
export async function saveSiteContent(_prev: unknown, fd: FormData): Promise<Result> {
  await requireAdmin();
  if (!db) return { error: "Database not configured (set DATABASE_URL)." };
  const data = parse(fd);
  await db
    .insert(siteContent)
    .values({ id: 1, ...data })
    .onConflictDoUpdate({
      target: siteContent.id,
      set: { ...data, updatedAt: new Date() },
    });
  // Site content is read in the root layout (sidebar) + several pages.
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/available");
  redirect("/admin/content");
}
