"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ListingPhoto } from "@/lib/listing-types";

type Props = {
  title: string;
  photos: ListingPhoto[];
  fallbackUrl?: string | null;
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ListingPhotoGallery({ title, photos, fallbackUrl }: Props) {
  const urls = photos
    .map((p) => p.url)
    .filter((url): url is string => Boolean(url));
  if (urls.length === 0 && fallbackUrl) urls.push(fallbackUrl);

  const count = urls.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useEffect(() => {
    if (count <= 1) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goNext, goPrev]);

  const activeUrl = urls[activeIndex] ?? null;

  if (!activeUrl) {
    return (
      <div className="-mx-4 overflow-hidden bg-zinc-200 ring-1 ring-blue-950/10 sm:mx-0 sm:rounded-3xl">
        <div className="flex aspect-[4/3] items-center justify-center text-base text-zinc-500 sm:aspect-[16/9] sm:text-sm">
          Sin fotos
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="relative -mx-4 overflow-hidden bg-zinc-200 shadow-[0_24px_60px_-36px_rgba(37,99,235,0.55)] ring-1 ring-blue-950/10 sm:mx-0 sm:rounded-3xl"
        role="region"
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${title}`}
        onTouchStart={(e) => {
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current == null || count <= 1) return;
          const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
          const delta = endX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) goPrev();
          else goNext();
        }}
      >
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
          <div
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {urls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="h-full min-w-full w-full shrink-0 basis-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${title} — foto ${index + 1} de ${count}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Foto anterior"
                className="absolute top-1/2 left-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Foto siguiente"
                className="absolute top-1/2 right-3 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md ring-1 ring-black/5 transition hover:bg-white sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute right-3 bottom-3 rounded-full bg-black/55 px-3 py-1.5 text-sm font-medium text-white tabular-nums sm:text-xs">
                {activeIndex + 1} / {count}
              </div>

              <div
                className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
                role="tablist"
                aria-label="Indicadores de foto"
              >
                {urls.map((_, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-label={`Ir a foto ${index + 1}`}
                      onClick={() => goTo(index)}
                      className={[
                        "h-2.5 rounded-full transition sm:h-2",
                        selected
                          ? "w-7 bg-white sm:w-6"
                          : "w-2.5 bg-white/55 hover:bg-white/80 sm:w-2",
                      ].join(" ")}
                    />
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </div>

      {count > 1 ? (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, index) => {
            const selected = index === activeIndex;
            return (
              <li key={`${url}-${index}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ver foto ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                  className={[
                    "h-24 w-32 overflow-hidden rounded-xl bg-zinc-200 transition sm:h-20 sm:w-28",
                    selected
                      ? "ring-2 ring-blue-600 ring-offset-2"
                      : "ring-1 ring-blue-950/10 hover:ring-blue-600/40",
                  ].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
