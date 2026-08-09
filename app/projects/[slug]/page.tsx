import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/data";
import { Gallery } from "@/components/gallery";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  return { title: p?.title ?? "Project" };
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-display text-label-caps uppercase text-on-surface-variant/60 mb-1">
        {label}
      </dt>
      <dd className="font-body text-body-md text-on-surface">{value}</dd>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();

  return (
    <>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop pt-gutter">
        <div className="max-w-[1440px] mx-auto">
          <Link
            href="/projects"
            className="font-display text-label-caps uppercase text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
          >
            ← Projects
          </Link>
        </div>
      </section>

      <header className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap border-b border-structural-gray">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
          <div className="lg:col-span-8">
            <span className="font-display text-label-caps text-on-surface-variant block mb-4 uppercase">
              {p.category}
              {p.year ? ` · ${p.year}` : ""}
            </span>
            <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-primary uppercase leading-none">
              {p.title}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:text-right space-y-1">
            {p.location && (
              <p className="font-display text-label-caps uppercase text-on-surface-variant">
                {p.location}
              </p>
            )}
            {p.date && (
              <p className="font-display text-label-caps uppercase text-on-surface-variant">
                {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>
            )}
          </div>
        </div>
      </header>

      {p.image && (
        <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
          <div className="max-w-[1440px] mx-auto bg-surface-container overflow-hidden">
            <Image
              src={p.image}
              alt={p.title}
              width={2048}
              height={1365}
              priority
              sizes="(min-width:1024px) 80vw, 100vw"
              className="w-full h-auto"
            />
          </div>
        </section>
      )}

      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop pb-section-gap">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <dl className="lg:col-span-3 space-y-4">
            <Meta label="Year" value={p.year ? String(p.year) : null} />
            <Meta label="Date" value={p.date} />
            <Meta label="Category" value={p.category} />
            <Meta label="Location" value={p.location} />
            <Meta label="Medium" value={p.medium} />
            <Meta label="Dimensions" value={p.dimensions} />
            <Meta label="Edition" value={p.edition} />
            <Meta label="Availability" value={p.availability} />
            <Meta label="Series" value={p.series} />
            <Meta label="Reference" value={p.ref ? `#${p.ref}` : null} />
          </dl>
          <div className="lg:col-span-8 lg:col-start-5 max-w-2xl font-body text-body-lg text-on-surface space-y-6">
            {p.body && <p className="whitespace-pre-line">{p.body}</p>}
          </div>
        </div>
      </section>

      {p.gallery.length > 0 && (
        <section className="px-edge-margin-mobile lg:px-edge-margin-desktop pb-section-gap">
          <div className="max-w-[1440px] mx-auto">
            <Gallery images={p.gallery} altPrefix={p.title} />
          </div>
        </section>
      )}
    </>
  );
}
