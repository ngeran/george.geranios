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

// ── Projects ────────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  if (!db) return seedProjects;
  const rows = await db.select().from(projects).orderBy(desc(projects.year));
  return rows.map(asProject);
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!db) return seedProjects.filter((p) => p.featured);
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(desc(projects.year));
  return rows.map(asProject);
}

export async function getAvailableProjects(): Promise<Project[]> {
  if (!db) return seedProjects.filter((p) => p.availability === "for-sale");
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.availability, "for-sale"))
    .orderBy(desc(projects.year));
  return rows.map(asProject);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!db) return seedProjects.find((p) => p.slug === slug) ?? null;
  const rows = await db.select().from(projects).where(eq(projects.slug, slug)).limit(1);
  return rows[0] ? asProject(rows[0]) : null;
}

// ── Publications ────────────────────────────────────────────────────────
export async function getPublications(): Promise<Publication[]> {
  if (!db) return seedPublications;
  const rows = await db
    .select()
    .from(publications)
    .orderBy(desc(publications.year));
  return rows.map(asPublication);
}

export async function getPublication(slug: string): Promise<Publication | null> {
  if (!db) return seedPublications.find((p) => p.slug === slug) ?? null;
  const rows = await db
    .select()
    .from(publications)
    .where(eq(publications.slug, slug))
    .limit(1);
  return rows[0] ? asPublication(rows[0]) : null;
}

// ── News ────────────────────────────────────────────────────────────────
export async function getNews(): Promise<NewsItem[]> {
  if (!db) return seedNews;
  const rows = await db.select().from(news).orderBy(desc(news.date));
  return rows.map(asNews);
}

export async function getNewsItem(slug: string): Promise<NewsItem | null> {
  if (!db) return seedNews.find((n) => n.slug === slug) ?? null;
  const rows = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  return rows[0] ? asNews(rows[0]) : null;
}
