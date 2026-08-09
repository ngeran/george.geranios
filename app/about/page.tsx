import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Biography" };

export default function AboutPage() {
  return (
    <section className="px-edge-margin-mobile lg:px-edge-margin-desktop py-section-gap">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="lg:col-span-3">
          <h1 className="font-display text-display-xl-mobile lg:text-display-xl uppercase tracking-tighter">
            Biography
          </h1>
        </div>
        <div className="lg:col-span-8 lg:col-start-5 max-w-2xl">
          <div className="mb-section-gap max-w-xs">
            <Image
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80&fit=crop"
              alt="Portrait of George Geranios"
              width={1000}
              height={1200}
              className="w-full h-auto"
            />
          </div>
          <div className="font-body text-body-lg text-on-surface space-y-6">
            <p>
              Based in Düsseldorf, the photographer has spent three decades
              documenting the systems and structures that define the
              contemporary landscape — from stock exchanges and factory floors
              to solar fields and emptied galleries.
            </p>
            <p>
              The work is characterised by an extreme distance: a vantage point
              high enough that the individual dissolves into pattern, and the
              scale of human activity becomes legible only as geometry.
            </p>
            <h2 className="font-display text-headline-md uppercase pt-section-gap">
              Selected solo exhibitions
            </h2>
            <ul className="space-y-1">
              <li>2023 — Kunstmuseum, Basel</li>
              <li>2021 — Hayward Gallery, London</li>
              <li>2019 — Museum of Modern Art, New York</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
