import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { Catalogue, type CatalogueItem } from "@/components/catalogue";

export const revalidate = 60;
export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  const items: CatalogueItem[] = projects.map((p) => ({
    href: `/projects/${p.slug}`,
    ref: p.ref,
    image: p.image,
    title: p.title,
    subtitle: p.series,
    year: p.year,
    date: p.date,
    line1: p.medium,
    line2: p.dimensions,
  }));

  return (
    <>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap border-b border-structural-gray">
        <div className="max-w-[1440px] mx-auto">
          <span className="font-display text-label-caps text-on-surface-variant mb-4 block">
            INVENTORY INDEX / SYSTEMATIC CATALOGUE
          </span>
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase leading-none">
            Projects
          </h1>
        </div>
      </section>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap bg-background">
        <div className="max-w-[1440px] mx-auto">
          <Catalogue items={items} noun="Works" />
        </div>
      </section>
    </>
  );
}
