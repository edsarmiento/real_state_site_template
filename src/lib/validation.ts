/**
 * Validation errors as returned by the Rails API.
 *
 * Field keys map to arrays of human-readable messages, matching the
 * `ValidationErrors` schema in the OpenAPI spec.
 */
export type ValidationErrors = Record<string, string[]>;

/** Cuando el API no devuelve `message` ni errores por campo. */
export const DEFAULT_API_FAILURE_MESSAGE =
  "No se pudo completar la operación. Inténtalo de nuevo.";

/** Human labels for common API field keys (forms + alerts). */
export const API_FIELD_LABELS: Record<string, string> = {
  full_name: "Nombre",
  email: "Email",
  phone: "Teléfono",
  contact_phone: "WhatsApp de contacto",
  tax_id: "Identificación fiscal",
  notes: "Notas",
  tenant_id: "Inquilino",
  unit_id: "Espacio",
  start_date: "Fecha de inicio",
  end_date: "Fecha de fin",
  rent_cents: "Precio",
  offer_type: "Tipo de anuncio",
  currency: "Moneda",
  payment_due_day: "Día de pago",
  deposit_cents: "Depósito",
  guarantor_name: "Nombre del aval",
  document_type: "Tipo de documento",
  file: "Archivo",
  status: "Estado",
  base: "General",
  amount_cents: "Importe",
  payment_method: "Método de pago",
  paid_at: "Fecha de pago",
};

/**
 * Best-effort extraction of field-level errors from an unknown response body.
 *
 * Accepts both `{ errors: { field: ["msg"] } }` and the flat `{ field: ["msg"] }`
 * shapes; returns `null` when the payload doesn't contain any field errors.
 */
export function parseValidationErrors(data: unknown): ValidationErrors | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;
  const nested =
    obj.errors && typeof obj.errors === "object" && obj.errors !== null
      ? (obj.errors as Record<string, unknown>)
      : obj;
  const out: ValidationErrors = {};
  for (const [k, v] of Object.entries(nested)) {
    if (
      Array.isArray(v) &&
      v.length > 0 &&
      v.every((x) => typeof x === "string")
    ) {
      out[k] = v as string[];
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

/** Extracts a top-level `error` string from an unknown error payload. */
export function parseErrorMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;
  return typeof obj.error === "string" ? obj.error : null;
}

/** Prefer API `message` for failed fetch responses. */
export function parseApiFailureMessage(
  data: unknown,
  fallback: string = DEFAULT_API_FAILURE_MESSAGE,
): string {
  if (typeof data !== "object" || data === null) return fallback;
  const obj = data as { message?: string };
  if (typeof obj.message === "string" && obj.message.trim()) return obj.message;
  return fallback;
}

/** Aplica errores del API a estado de formulario (campos o banner). */
export function applyApiFormErrors(
  data: unknown,
  setError: (message: string | null) => void,
  setFieldErrors: (errors: ValidationErrors | null) => void,
): void {
  const fieldErr = parseValidationErrors(data);
  if (fieldErr) {
    setFieldErrors(fieldErr);
    setError(null);
    return;
  }
  setFieldErrors(null);
  setError(parseApiFailureMessage(data));
}

export function formatValidationErrors(errors: ValidationErrors): string {
  return Object.entries(errors)
    .map(
      ([field, messages]) =>
        `${API_FIELD_LABELS[field] ?? field}: ${messages.join(", ")}`,
    )
    .join("\n");
}
