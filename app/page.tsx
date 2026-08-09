import { HomeHero } from "@/components/home-hero";
import { getFeaturedProjects } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const featured = await getFeaturedProjects();
  const projects = featured
    .filter((p) => p.image)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      year: p.year ?? 0,
      image: p.image as string,
    }));

  return <HomeHero projects={projects} />;
}
