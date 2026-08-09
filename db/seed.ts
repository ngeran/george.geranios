/**
 * Seed the Neon database from db/seed-data.ts. Run with `npm run db:seed`
 * (requires DATABASE_URL). Idempotent: clears then re-inserts the sample rows.
 */
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { projects, publications, news } from "./schema";
import { seedProjects, seedPublications, seedNews } from "./seed-data";

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

  console.log(
    `✓ done: ${seedProjects.length} projects, ${seedPublications.length} publications, ${seedNews.length} news.`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
