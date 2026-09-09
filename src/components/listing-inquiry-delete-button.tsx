"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { notifyApiFailure, notifyConfirm } from "@/lib/notifications";

type Props = {
  inquiryId: number;
  inquiryName: string;
};

export function ListingInquiryDeleteButton({
  inquiryId,
  inquiryName,
}: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    const ok = await notifyConfirm(
      `¿Eliminar el lead de «${inquiryName}»? Esta acción no se puede deshacer.`,
      { title: "Eliminar lead", danger: true, confirmLabel: "Eliminar" },
    );
    if (!ok) return;
    setPending(true);
    try {
      const res = await fetch(`/api/v1/listing_inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      if (res.status === 204 || res.ok) {
        router.refresh();
        return;
      }
      const data: unknown = await res.json().catch(() => ({}));
      await notifyApiFailure(data);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onDelete()}
      disabled={pending}
      className="shrink-0 text-sm font-medium text-red-700 underline disabled:opacity-60"
    >
      {pending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
