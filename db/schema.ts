import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Content schema for the photography CMS. Drizzle + Neon Postgres.
 * `date` columns are stored as 'YYYY-MM-DD'; `gallery` is an array of image URLs.
 */
export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    year: integer("year"),
    date: date("date", { mode: "string" }),
    ref: text("ref"),
    category: text("category"),
    location: text("location"),
    medium: text("medium"),
    dimensions: text("dimensions"),
    edition: text("edition"),
    availability: text("availability"), // for-sale | sold | reserved | not-for-sale
    series: text("series"),
    featured: boolean("featured").default(false),
    weight: integer("weight").default(1),
    image: text("image"), // cover image URL
    gallery: text("gallery").array(), // additional image URLs
    body: text("body"), // description (markdown)
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({ slugIdx: uniqueIndex("projects_slug_idx").on(t.slug) }),
);

export const publications = pgTable(
  "publications",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    year: integer("year"),
    date: date("date", { mode: "string" }),
    ref: text("ref"),
    category: text("category"),
    publisher: text("publisher"),
    author: text("author"),
    isbn: text("isbn"),
    pages: text("pages"),
    format: text("format"),
    edition: text("edition"),
    image: text("image"),
    gallery: text("gallery").array(),
    body: text("body"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({ slugIdx: uniqueIndex("publications_slug_idx").on(t.slug) }),
);

export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    date: date("date", { mode: "string" }),
    summary: text("summary"),
    image: text("image"),
    body: text("body"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => ({ slugIdx: uniqueIndex("news_slug_idx").on(t.slug) }),
);

/**
 * Singleton site-wide content (single row, id = 1). Edited via /admin/content.
 * Falls back to `seedSiteContent` in `db/seed-data.ts` when no DB / no row.
 */
export const siteContent = pgTable("site_content", {
  id: integer("id").primaryKey(),
  contactEmail: text("contact_email"),
  contactInstagramUrl: text("contact_instagram_url"),
  contactInstagramHandle: text("contact_instagram_handle"),
  contactIntro: text("contact_intro"),
  aboutPortrait: text("about_portrait"),
  aboutBio: text("about_bio"),
  aboutExhibitions: text("about_exhibitions"),
  availableHeading: text("available_heading"),
  availableIntro: text("available_intro"),
  heroTitle: text("hero_title"),
  heroSubtitle: text("hero_subtitle"),
  navProjectsLabel: text("nav_projects_label"),
  navAvailableLabel: text("nav_available_label"),
  navAboutLabel: text("nav_about_label"),
  navContactLabel: text("nav_contact_label"),
  navShowPublications: boolean("nav_show_publications").default(false),
  navShowNews: boolean("nav_show_news").default(false),
  projectCategories: text("project_categories"),
  navExtraLinks: text("nav_extra_links"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
