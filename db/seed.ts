/**
 * Seed the Neon database from db/seed-data.ts. Run with `npm run db:seed`
 * (requires DATABASE_URL). Idempotent: clears then re-inserts the sample rows.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { projects, publications, news, siteContent } from "./schema";
import { seedProjects, seedPublications, seedNews, seedSiteContent } from "./seed-data";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("✗ DATABASE_URL is not set. Add it to .env (local) or Vercel env vars.");
    process.exit(1);
  }
  const db = drizzle(neon(process.env.DATABASE_URL));

  console.log("→ clearing existing rows…");
  await db.delete(news);
  await db.delete(publications);
  await db.delete(projects);

  console.log("→ inserting seed content…");
  await db.insert(projects).values(seedProjects);
  await db.insert(publications).values(seedPublications);
  await db.insert(news).values(seedNews);

  // Site content is a singleton; only seed it if no row exists, so re-running
  // the seed (to reset projects/news) never overwrites the admin's edits.
  await db
    .insert(siteContent)
    .values({ id: 1, ...seedSiteContent })
    .onConflictDoNothing();

  console.log(
    `✓ done: ${seedProjects.length} projects, ${seedPublications.length} publications, ${seedNews.length} news, site content ready.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
