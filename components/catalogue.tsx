"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type CatalogueItem = {
  href: string;
  ref: string | null;
  image: string | null;
  title: string;
  subtitle?: string | null; // series / publisher
  year: number | null;
  date: string | null;
  line1?: string | null; // medium / publisher
  line2?: string | null; // dimensions / pages
};

const ERAS = [
  { value: "all", label: "All Eras" },
  { value: "1980-1989", label: "1980 — 1989" },
  { value: "1990-1999", label: "1990 — 1999" },
  { value: "2000-2010", label: "2000 — 2010" },
  { value: "2011-Present", label: "2011 — Present" },
];

function eraOf(year: number | null): string {
  if (!year) return "Unknown";
  if (year < 1990) return "1980-1989";
  if (year < 2000) return "1990-1999";
  if (year < 2011) return "2000-2010";
  return "2011-Present";
}

export function Catalogue({
  items,
  noun = "Works",
}: {
  items: CatalogueItem[];
  noun?: string;
}) {
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState<"chrono" | "ref">("chrono");

  const visible = useMemo(() => {
    const filtered = items.filter(
      (i) => period === "all" || eraOf(i.year) === period,
    );
    return [...filtered].sort((a, b) =>
      sort === "ref"
        ? (a.ref ?? "").localeCompare(b.ref ?? "", undefined, { numeric: true })
        : (b.year ?? 0) - (a.year ?? 0),
    );
  }, [items, period, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-8 items-center font-display text-label-caps border-t lg:border-t-0 pt-gutter lg:pt-0 border-structural-gray mb-section-gap">
        <div className="flex flex-col gap-2">
          <span className="text-on-surface-variant/50">PERIOD</span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer uppercase text-primary font-bold"
          >
            {ERAS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-px h-8 bg-structural-gray hidden lg:block" />
        <div className="flex flex-col gap-2">
          <span className="text-on-surface-variant/50">SORT BY</span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSort("chrono")}
              className={`uppercase transition-opacity ${
                sort === "chrono" ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Chronological
            </button>
            <span className="text-structural-gray">/</span>
            <button
              type="button"
              onClick={() => setSort("ref")}
              className={`uppercase transition-colors ${
                sort === "ref" ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Reference No.
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-structural-gray">
        {visible.map((i) => (
          <article
            key={i.href}
            className="group py-6 md:py-8 grid grid-cols-[6rem_1fr] md:grid-cols-12 gap-gutter items-center w-full hover:bg-surface-container transition-colors duration-300"
          >
            <div className="hidden md:block md:col-span-2 font-display text-label-caps text-on-surface-variant opacity-50 whitespace-nowrap">
              {i.ref ? `#${i.ref}` : "—"}
            </div>
            <div className="md:col-span-2">
              {i.image && (
                <Link
                  href={i.href}
                  className="block aspect-[4/5] bg-surface-container-low group-hover:bg-surface-container overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
                >
                  <Image
                    src={i.image}
                    alt={i.title}
                    width={400}
                    height={500}
                    sizes="(min-width:768px) 12vw, 96px"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                  />
                </Link>
              )}
            </div>
            <div className="md:col-span-4 min-w-0">
              <div className="font-display text-[10px] text-on-surface-variant uppercase mb-1 md:hidden whitespace-nowrap">
                Ref: {i.ref ? `#${i.ref}` : "—"}
              </div>
              <h3 className="font-display text-headline-md text-primary uppercase">
                <Link
                  href={i.href}
                  className="group-hover:translate-x-2 inline-block transition-transform duration-500"
                >
                  {i.title}
                </Link>
              </h3>
              {i.subtitle && (
                <p className="font-body text-caption text-on-surface-variant mt-1">
                  {i.subtitle}
                </p>
              )}
              <div className="md:hidden mt-2 flex flex-wrap gap-x-gutter gap-y-1 font-body text-caption text-on-surface-variant uppercase">
                <span>{i.year ?? "—"}</span>
                {i.line1 && <span>{i.line1}</span>}
                {i.line2 && <span>{i.line2}</span>}
              </div>
            </div>
            <div className="hidden md:block md:col-span-1">
              <span className="font-display text-label-caps text-primary whitespace-nowrap">
                {i.year ?? "—"}
              </span>
            </div>
            <div className="hidden md:block md:col-span-3 md:text-right font-body text-caption text-on-surface-variant leading-relaxed">
              {i.line1 && <p>{i.line1}</p>}
              {i.line2 && <p>{i.line2}</p>}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-section-gap flex flex-col items-center gap-unit">
        <div className="w-full h-px bg-structural-gray mb-gutter" />
        <span className="font-display text-label-caps text-on-surface-variant">
          SHOWING {visible.length} OF {items.length} {noun.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
