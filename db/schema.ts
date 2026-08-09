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
