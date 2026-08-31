"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ErrorBanner,
  DELETE_BUTTON_VARIANT,
  UPLOAD_BUTTON_VARIANT,
  fileInputClassName,
} from "@/components/ui";
import { useSiteLayoutStyled } from "@/components/site-layout-variant-provider";
import { notify, notifyApiResponseFailure } from "@/lib/notifications";
import { parseApiFailureMessage } from "@/lib/validation";
import type { ListingPhoto } from "@/lib/listing-types";

const MAX_PHOTOS = 12;

type Props = {
  listingId: number;
  photos: ListingPhoto[];
};

function sortPhotos(photos: ListingPhoto[]): ListingPhoto[] {
  return [...photos].sort(
    (a, b) => a.position - b.position || a.id - b.id,
  );
}

function movePhoto(
  photos: ListingPhoto[],
  fromId: number,
  toId: number,
): ListingPhoto[] {
  const fromIndex = photos.findIndex((p) => p.id === fromId);
  const toIndex = photos.findIndex((p) => p.id === toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return photos;

  const next = [...photos];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function shiftPhoto(
  photos: ListingPhoto[],
  photoId: number,
  direction: -1 | 1,
): ListingPhoto[] {
  const index = photos.findIndex((p) => p.id === photoId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= photos.length) return photos;

  return movePhoto(photos, photoId, photos[target].id);
}

function photosSignature(photos: ListingPhoto[]): string {
  return photos.map((p) => `${p.id}:${p.position}`).join("|");
}

export function ListingPhotosForm({ listingId, photos }: Props) {
  const router = useRouter();
  const styledLayout = useSiteLayoutStyled();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [reordering, setReordering] = useState(false);
  const signature = photosSignature(photos);
  const [ordered, setOrdered] = useState(() => sortPhotos(photos));
  const [prevSignature, setPrevSignature] = useState(signature);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const dragIdRef = useRef<number | null>(null);

  if (signature !== prevSignature) {
    setPrevSignature(signature);
    setOrdered(sortPhotos(photos));
  }

  const remaining = Math.max(0, MAX_PHOTOS - ordered.length);
  const atLimit = remaining === 0;
  const canReorder = ordered.length > 1;
  const busy = pending || reordering;

  async function persistOrder(next: ListingPhoto[], previous: ListingPhoto[]) {
    setReordering(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/listings/${listingId}/photos/reorder`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photo_ids: next.map((p) => p.id) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOrdered(previous);
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      router.refresh();
    } finally {
      setReordering(false);
    }
  }

  function applyOrder(next: ListingPhoto[]) {
    const previous = ordered;
    setOrdered(next);
    void persistOrder(next, previous);
  }

  async function uploadOne(file: File): Promise<{ ok: boolean; message?: string }> {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch(`/api/v1/listings/${listingId}/photos`, {
      method: "POST",
      body,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: parseApiFailureMessage(data) };
    }
    return { ok: true };
  }

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (atLimit) {
      setError(`Máximo ${MAX_PHOTOS} fotos por anuncio.`);
      return;
    }

    const form = e.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const files = input?.files ? Array.from(input.files) : [];
    if (files.length === 0) {
      setError("Selecciona una o más imágenes.");
      return;
    }

    const toUpload = files.slice(0, remaining);
    setError(null);
    setPending(true);
    try {
      let uploaded = 0;
      let lastError: string | null = null;
      for (const file of toUpload) {
        const result = await uploadOne(file);
        if (!result.ok) {
          lastError = result.message ?? "No se pudo subir una imagen.";
          break;
        }
        uploaded += 1;
      }

      if (uploaded > 0) {
        await notify(
          uploaded === 1 ? "Foto añadida." : `${uploaded} fotos añadidas.`,
          { variant: "success" },
        );
        form.reset();
        router.refresh();
      } else if (lastError) {
        setError(lastError);
      }
    } finally {
      setPending(false);
    }
  }

  async function onRemove(photoId: number) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/v1/listings/${listingId}/photos/${photoId}`,
        { method: "DELETE" },
      );
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      await notify("Foto eliminada.", { variant: "success" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-800">Fotos</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Hasta {MAX_PHOTOS} imágenes ({ordered.length}/{MAX_PHOTOS}).
        {canReorder
          ? " Arrastra para reordenar. La primera es la portada del catálogo."
          : null}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {ordered.map((p, index) => (
          <div
            key={p.id}
            draggable={canReorder && !busy}
            onDragStart={() => {
              dragIdRef.current = p.id;
              setDraggingId(p.id);
            }}
            onDragEnd={() => {
              dragIdRef.current = null;
              setDraggingId(null);
              setDropTargetId(null);
            }}
            onDragOver={(e) => {
              if (!canReorder || busy) return;
              e.preventDefault();
              setDropTargetId(p.id);
            }}
            onDragLeave={() => {
              if (dropTargetId === p.id) setDropTargetId(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromId = dragIdRef.current;
              dragIdRef.current = null;
              setDraggingId(null);
              setDropTargetId(null);
              if (fromId == null || fromId === p.id || busy) return;
              applyOrder(movePhoto(ordered, fromId, p.id));
            }}
            className={[
              "relative w-28 rounded-lg transition",
              canReorder && !busy ? "cursor-grab active:cursor-grabbing" : "",
              draggingId === p.id ? "opacity-40" : "",
              dropTargetId === p.id && draggingId !== p.id
                ? styledLayout
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : "ring-2 ring-zinc-500 ring-offset-2"
                : "",
            ].join(" ")}
          >
            <div className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
              {p.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.url} alt="" draggable={false} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-zinc-400">—</span>
              )}
              <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white tabular-nums">
                {index + 1}
              </span>
              {index === 0 ? (
                <span
                  className={`absolute bottom-1 left-1 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-white ${
                    styledLayout ? "bg-blue-600/90" : "bg-zinc-700"
                  }`}
                >
                  Portada
                </span>
              ) : null}
            </div>
            {canReorder ? (
              <div className="mt-1 flex gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="min-w-0 flex-1 px-2"
                  disabled={busy || index === 0}
                  onClick={() => applyOrder(shiftPhoto(ordered, p.id, -1))}
                >
                  ←
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="min-w-0 flex-1 px-2"
                  disabled={busy || index === ordered.length - 1}
                  onClick={() => applyOrder(shiftPhoto(ordered, p.id, 1))}
                >
                  →
                </Button>
              </div>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant={DELETE_BUTTON_VARIANT}
              className="mt-1 w-full"
              disabled={busy}
              onClick={() => onRemove(p.id)}
            >
              Quitar
            </Button>
          </div>
        ))}
      </div>

      {reordering ? (
        <p className="mt-2 text-xs text-zinc-500">Guardando orden…</p>
      ) : null}

      {atLimit ? (
        <p className="mt-4 text-sm text-zinc-500">
          Límite alcanzado. Quita una foto para subir otra.
        </p>
      ) : (
        <form className="mt-4 space-y-2" onSubmit={onUpload}>
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className={fileInputClassName}
            disabled={busy}
          />
          <Button type="submit" size="sm" variant={UPLOAD_BUTTON_VARIANT} disabled={busy}>
            {pending ? "Subiendo…" : "Subir fotos"}
          </Button>
        </form>
      )}
      {error ? (
        <div className="mt-3">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}
    </div>
  );
}
