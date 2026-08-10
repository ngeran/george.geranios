import type { Metadata } from "next";
import { getAvailableProjects, getSiteContent } from "@/lib/data";
import { Catalogue, type CatalogueItem } from "@/components/catalogue";

export const revalidate = 60;
export const metadata: Metadata = { title: "Available Works" };

export default async function AvailablePage() {
  const [projects, site] = await Promise.all([getAvailableProjects(), getSiteContent()]);
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
            AVAILABLE WORKS / FOR SALE
          </span>
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase leading-none">
            {site.availableHeading || "Available Works"}
          </h1>
        </div>
      </section>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap bg-background">
        <div className="max-w-[1440px] mx-auto">
          <Catalogue items={items} noun="Works" />
          {site.availableIntro && (
            <p className="mt-section-gap font-body text-caption text-on-surface-variant max-w-md text-center mx-auto">
              {site.availableIntro}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
