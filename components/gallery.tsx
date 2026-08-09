"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

/**
 * Gallery grid + watermarked lightbox. Clicking an image opens a full-screen
 * overlay with a repeating "george geranios" watermark and download friction
 * (context menu + drag disabled). Deterrent only — not absolute protection.
 */
export function Gallery({
  images,
  altPrefix = "Image",
}: {
  images: string[];
  altPrefix?: string;
}) {
  const [idx, setIdx] = useState<number | null>(null);

  const close = useCallback(() => setIdx(null), []);
  const prev = useCallback(
    () => setIdx((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setIdx((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, close, prev, next]);

  return (
    <>
      <div className="space-y-gutter">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            aria-label={`Enlarge image ${i + 1}`}
            className="group block w-full bg-surface-container overflow-hidden cursor-zoom-in"
          >
            <Image
              src={src}
              alt={`${altPrefix} ${i + 1}`}
              width={1600}
              height={1000}
              sizes="(min-width:1024px) 90vw, 100vw"
              className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>

      {idx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/92 flex items-center justify-center select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 text-white text-3xl leading-none px-2 hover:opacity-70"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2 hover:opacity-70"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-2 hover:opacity-70"
          >
            ›
          </button>
          <div
            className="relative"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            <Image
              src={images[idx]}
              alt={`${altPrefix} ${idx + 1}`}
              width={2048}
              height={1365}
              draggable={false}
              className="max-w-[90vw] max-h-[86vh] w-auto h-auto object-contain pointer-events-none select-none"
            />
            <div className="lightbox__watermark" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
}
