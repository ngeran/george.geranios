import { desc, eq } from "drizzle-orm";
import { projects, publications, news } from "@/db/schema";
import { db } from "@/lib/db";
import {
  seedProjects,
  seedPublications,
  seedNews,
  type Project,
  type Publication,
  type NewsItem,
} from "@/db/seed-data";

export type { Project, Publication, NewsItem };

/* eslint-disable @typescript-eslint/no-explicit-any */
const asProject = (r: any): Project => ({
  slug: r.slug,
  title: r.title,
  year: r.year ?? null,
  date: r.date ?? null,
  ref: r.ref ?? null,
  category: r.category ?? null,
  location: r.location ?? null,
  medium: r.medium ?? null,
  dimensions: r.dimensions ?? null,
  edition: r.edition ?? null,
  availability: r.availability ?? null,
  series: r.series ?? null,
  featured: !!r.featured,
  weight: r.weight ?? 1,
  image: r.image ?? null,
  gallery: r.gallery ?? [],
  body: r.body ?? null,
});

const asPublication = (r: any): Publication => ({
  slug: r.slug,
  title: r.title,
  year: r.year ?? null,
  date: r.date ?? null,
  ref: r.ref ?? null,
  category: r.category ?? null,
  publisher: r.publisher ?? null,
  author: r.author ?? null,
  isbn: r.isbn ?? null,
  pages: r.pages ?? null,
  format: r.format ?? null,
  edition: r.edition ?? null,
  image: r.image ?? null,
  gallery: r.gallery ?? [],
  body: r.body ?? null,
});

const asNews = (r: any): NewsItem => ({
  slug: r.slug,
  title: r.title,
  date: r.date ?? null,
  summary: r.summary ?? null,
  image: r.image ?? null,
  body: r.body ?? null,
});
/* eslint-enable @typescript-eslint/no-explicit-any */

// `db` is null when DATABASE_URL is unset. Even when it IS set, the database may
// be unreachable or its tables may not exist yet — e.g. a fresh Neon project
// before `npm run db:push`, which is exactly when `next build` runs on Vercel.
// In either case we fall back to the built-in seed data so the public site
// (and the production build) always succeeds. Each query logs a warning on
// failure so a genuinely broken query doesn't fail silently.
async function readOrSeed<T>(
  label: string,
  read: () => Promise<T>,
  seed: T,
): Promise<T> {
  if (!db) return seed;
  try {
    return await read();
  } catch (err) {
    console.warn(`[data] ${label}: DB unavailable, rendering seed data.`, err);
    return seed;
  }
}

// ── Projects ────────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  return readOrSeed("getProjects", async () => {
    const rows = await db!.select().from(projects).orderBy(desc(projects.year));
    return rows.map(asProject);
  }, seedProjects);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return readOrSeed("getFeaturedProjects", async () => {
    const rows = await db!
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(desc(projects.year));
    return rows.map(asProject);
  }, seedProjects.filter((p) => p.featured));
}

export async function getAvailableProjects(): Promise<Project[]> {
  return readOrSeed("getAvailableProjects", async () => {
    const rows = await db!
      .select()
      .from(projects)
      .where(eq(projects.availability, "for-sale"))
      .orderBy(desc(projects.year));
    return rows.map(asProject);
  }, seedProjects.filter((p) => p.availability === "for-sale"));
}

export async function getProject(slug: string): Promise<Project | null> {
  return readOrSeed("getProject", async () => {
    const rows = await db!.select().from(projects).where(eq(projects.slug, slug)).limit(1);
    return rows[0] ? asProject(rows[0]) : null;
  }, seedProjects.find((p) => p.slug === slug) ?? null);
}

// ── Publications ────────────────────────────────────────────────────────
export async function getPublications(): Promise<Publication[]> {
  return readOrSeed("getPublications", async () => {
    const rows = await db!
      .select()
      .from(publications)
      .orderBy(desc(publications.year));
    return rows.map(asPublication);
  }, seedPublications);
}

export async function getPublication(slug: string): Promise<Publication | null> {
  return readOrSeed("getPublication", async () => {
    const rows = await db!
      .select()
      .from(publications)
      .where(eq(publications.slug, slug))
      .limit(1);
    return rows[0] ? asPublication(rows[0]) : null;
  }, seedPublications.find((p) => p.slug === slug) ?? null);
}

// ── News ────────────────────────────────────────────────────────────────
export async function getNews(): Promise<NewsItem[]> {
  return readOrSeed("getNews", async () => {
    const rows = await db!.select().from(news).orderBy(desc(news.date));
    return rows.map(asNews);
  }, seedNews);
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  return readOrSeed("getNewsItem", async () => {
    const rows = await db!.select().from(news).where(eq(news.slug, slug)).limit(1);
    return rows[0] ? asNews(rows[0]) : null;
  }, seedNews.find((n) => n.slug === slug) ?? null);
}
