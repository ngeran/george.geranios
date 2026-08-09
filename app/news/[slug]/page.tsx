import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNews, getNewsItem } from "@/lib/data";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getNews();
  return all.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  return { title: item?.title ?? "News" };
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsItem(slug);
  if (!item) notFound();

  return (
    <>
      <section className="px-edge-margin-mobile lg:px-edge-margin-desktop pt-gutter">
        <div className="max-w-[1440px] mx-auto">
          <Link
            href="/news"
            className="font-display text-label-caps uppercase text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
          >
            ← News
          </Link>
        </div>
      </section>

      <header className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap border-b border-structural-gray">
        <div className="max-w-[1440px] mx-auto">
          {item.date && (
            <p className="font-display text-label-caps uppercase text-on-surface-variant mb-4">
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-primary uppercase leading-none">
            {item.title}
          </h1>
        </div>
      </header>

      {item.image && (
        <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
          <div className="max-w-[1440px] mx-auto bg-surface-container overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
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
        <div className="max-w-[1440px] mx-auto">
          <div className="font-body text-body-lg text-on-surface max-w-3xl space-y-6">
            {item.summary && (
              <p className="text-on-surface-variant">{item.summary}</p>
            )}
            {item.body && <p className="whitespace-pre-line">{item.body}</p>}
          </div>
        </div>
      </section>
    </>
  );
}
