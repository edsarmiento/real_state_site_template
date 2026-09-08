const GENERIC_FAILURE = "No se pudo completar la solicitud.";

export function parseApiFailureMessage(data: unknown): string {
  if (!data || typeof data !== "object") return GENERIC_FAILURE;
  const obj = data as Record<string, unknown>;
  if (typeof obj.error === "string") return obj.error;
  if (typeof obj.message === "string") return obj.message;
  const errors = obj.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.map(String).join(". ");
  }
  if (errors && typeof errors === "object") {
    return Object.values(errors as Record<string, unknown>)
      .flat()
      .map(String)
      .join(". ");
  }
  return GENERIC_FAILURE;
}

export async function submitListingInquiry(
  slug: string,
  inquiry: { name: string; phone: string; message: string },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const res = await fetch(
    `/api/public/listings/${encodeURIComponent(slug)}/inquiries`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiry }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, message: parseApiFailureMessage(data) };
  }
  return { ok: true };
}
