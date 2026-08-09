import type { Metadata } from "next";
import Link from "next/link";
import { getNews } from "@/lib/data";

export const revalidate = 60;
export const metadata: Metadata = { title: "News" };

const formatListDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

const pad2 = (n: number) => n.toString().padStart(2, "0");

export default async function NewsPage() {
  const news = await getNews();
  // Sort by date descending (nulls last). Dates are 'YYYY-MM-DD' so
  // lexicographic comparison is correct.
  const items = [...news].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });
  const total = items.length;

  return (
    <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <div className="max-w-[1440px] mx-auto">
        <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase tracking-tighter mb-section-gap">
          News
        </h1>

        {total === 0 ? (
          <p className="font-body text-body-lg text-on-surface-variant">
            No entries.
          </p>
        ) : (
          <div className="border-t border-structural-gray">
            {items.map((item, i) => (
              <article
                key={item.slug}
                className="group border-b border-structural-gray hover:bg-surface-container-low transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter py-gutter">
                  <div className="md:col-span-2 font-display text-label-caps uppercase text-on-surface-variant">
                    <span className="text-primary">{pad2(i + 1)}</span>
                    <span> / {pad2(total)}</span>
                    {item.date && (
                      <span className="block mt-1">
                        {formatListDate(item.date)}
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-7">
                    <Link href={`/news/${item.slug}`} className="block">
                      <h2 className="font-display text-headline-lg text-primary group-hover:translate-x-2 transition-transform duration-200">
                        {item.title}
                      </h2>
                      {item.summary && (
                        <p className="font-body text-body-md text-on-surface-variant mt-2">
                          {item.summary}
                        </p>
                      )}
                    </Link>
                  </div>

                  <div className="md:col-span-3 flex items-start justify-end">
                    <span
                      aria-hidden="true"
                      className="font-display text-headline-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
