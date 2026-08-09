import type { Metadata } from "next";
import { getPublications } from "@/lib/data";
import { Catalogue, type CatalogueItem } from "@/components/catalogue";

export const revalidate = 60;
export const metadata: Metadata = { title: "Publications" };

export default async function PublicationsPage() {
  const publications = await getPublications();
  const items: CatalogueItem[] = publications.map((p) => ({
    href: `/publications/${p.slug}`,
    ref: p.ref,
    image: p.image,
    title: p.title,
    subtitle: p.publisher,
    year: p.year,
    date: p.date,
    line1: p.publisher,
    line2: p.pages,
  }));

  return (
    <>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap border-b border-structural-gray">
        <div className="max-w-[1440px] mx-auto">
          <span className="font-display text-label-caps text-on-surface-variant mb-4 block">
            PUBLICATIONS / CATALOGUE
          </span>
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase leading-none">
            Publications
          </h1>
        </div>
      </section>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap bg-background">
        <div className="max-w-[1440px] mx-auto">
          <Catalogue items={items} noun="Publications" />
        </div>
      </section>
    </>
  );
}
