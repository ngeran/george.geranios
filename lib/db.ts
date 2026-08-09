import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

/**
 * Drizzle client over Neon (HTTP/serverless driver). Only created when
 * DATABASE_URL is set. When unset, `db` is null and lib/data.ts falls back to
 * seed data — so the site renders locally with no database.
 */
export const db =
  process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0
    ? drizzle(neon(process.env.DATABASE_URL), { schema })
    : null;
