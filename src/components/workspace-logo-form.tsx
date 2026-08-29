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

type Props = {
  accountName: string;
  logoUrl: string | null;
  canEdit: boolean;
};

export function WorkspaceLogoForm({ accountName, logoUrl, canEdit }: Props) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canEdit) return;

    const form = e.currentTarget;
    const input = form.elements.namedItem("logo") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setError("Selecciona una imagen.");
      return;
    }

    setError(null);
    setPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/v1/account/logo", {
        method: "POST",
        body,
      });
      const data = (await res.json().catch(() => ({}))) as {
        logo_url?: string;
        message?: string;
      };
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      setPreviewUrl(data.logo_url ?? null);
      await notify("Logo actualizado.", { variant: "success" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function onRemove() {
    if (!canEdit) return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/v1/account/logo", { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      setPreviewUrl(null);
      await notify("Logo eliminado.", { variant: "success" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Logo de {accountName}
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Imagen de la inmobiliaria (JPEG, PNG, WebP o GIF, máx. 5 MB).
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={`Logo de ${accountName}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-zinc-400">Sin logo</span>
          )}
        </div>

        {canEdit ? (
          <form className="flex min-w-0 flex-1 flex-col gap-2" onSubmit={onUpload}>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className={fileInputClassName}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                size="sm"
                variant={UPLOAD_BUTTON_VARIANT}
                disabled={pending}
              >
                {pending ? "Guardando…" : "Subir logo"}
              </Button>
              {previewUrl ? (
                <Button
                  type="button"
                  size="sm"
                  variant={DELETE_BUTTON_VARIANT}
                  disabled={pending}
                  onClick={onRemove}
                >
                  Quitar
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="text-sm text-zinc-500">
            Solo el staff del workspace puede cambiar el logo.
          </p>
        )}
      </div>

      {error ? (
        <div className="mt-3">
          <ErrorBanner>{error}</ErrorBanner>
        </div>
      ) : null}
    </div>
  );
}
