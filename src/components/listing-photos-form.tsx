"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ErrorBanner,
  DELETE_BUTTON_VARIANT,
  UPLOAD_BUTTON_VARIANT,
  fileInputClassName,
} from "@/components/ui";
import { notify, notifyApiResponseFailure } from "@/lib/notifications";
import { parseApiFailureMessage } from "@/lib/validation";
import type { ListingPhoto } from "@/lib/listing-types";

const MAX_PHOTOS = 12;

type Props = {
  listingId: number;
  photos: ListingPhoto[];
};

export function ListingPhotosForm({ listingId, photos }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const remaining = Math.max(0, MAX_PHOTOS - photos.length);
  const atLimit = remaining === 0;

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
    if (files.length > remaining) {
      setError(
        `Solo puedes subir ${remaining} foto${remaining === 1 ? "" : "s"} más (máx. ${MAX_PHOTOS}).`,
      );
    } else {
      setError(null);
    }

    setPending(true);
    try {
      let uploaded = 0;
      let lastError: string | null = null;
      for (const file of toUpload) {
        const result = await uploadOne(file);
        if (!result.ok) {
          lastError = result.message ?? "No se pudo subir una imagen.";
          await notifyApiResponseFailure({ message: lastError });
          break;
        }
        uploaded += 1;
      }

      if (uploaded > 0) {
        await notify(
          uploaded === 1
            ? "Foto añadida."
            : `${uploaded} fotos añadidas.`,
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
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Fotos
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Hasta {MAX_PHOTOS} imágenes ({photos.length}/{MAX_PHOTOS}).
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {photos.map((p) => (
          <div key={p.id} className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
              {p.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400">—</span>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant={DELETE_BUTTON_VARIANT}
              className="mt-1 w-full"
              disabled={pending}
              onClick={() => onRemove(p.id)}
            >
              Quitar
            </Button>
          </div>
        ))}
      </div>
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
          />
          <Button
            type="submit"
            size="sm"
            variant={UPLOAD_BUTTON_VARIANT}
            disabled={pending}
          >
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
