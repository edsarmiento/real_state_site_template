import {
  DEFAULT_API_FAILURE_MESSAGE,
  parseApiFailureMessage,
  parseValidationErrors,
  type ValidationErrors,
} from "@/lib/validation";

export type NotificationVariant = "info" | "success" | "warning" | "error";

export type NotifyOptions = {
  title?: string;
  variant?: NotificationVariant;
  validationErrors?: ValidationErrors;
};

export type ConfirmOptions = {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type NotificationHost = {
  notify: (message: string, options?: NotifyOptions) => Promise<void>;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
};

let host: NotificationHost | null = null;

export function registerNotificationHost(next: NotificationHost): void {
  host = next;
}

export function unregisterNotificationHost(): void {
  host = null;
}

export async function notify(
  message: string,
  options?: NotifyOptions,
): Promise<void> {
  if (!host) {
    throw new Error("NotificationProvider no está montado");
  }
  await host.notify(message, options);
}

export async function notifyConfirm(
  message: string,
  options?: ConfirmOptions,
): Promise<boolean> {
  if (!host) {
    throw new Error("NotificationProvider no está montado");
  }
  return host.confirm(message, options);
}

export async function notifyApiFailure(
  data: unknown,
  fallback: string = DEFAULT_API_FAILURE_MESSAGE,
): Promise<void> {
  await notify(parseApiFailureMessage(data, fallback), {
    title: "No se pudo completar",
    variant: "error",
  });
}

export async function notifyValidationErrors(
  errors: ValidationErrors,
): Promise<void> {
  await notify("", {
    title: "Revisa los datos",
    variant: "error",
    validationErrors: errors,
  });
}

export async function notifyApiResponseFailure(
  data: unknown,
  fallback: string = DEFAULT_API_FAILURE_MESSAGE,
): Promise<void> {
  const message = parseApiFailureMessage(data, "");
  const fieldErr = parseValidationErrors(data);

  if (fieldErr) {
    const keys = Object.keys(fieldErr);
    const onlyBase = keys.length === 1 && keys[0] === "base";
    if (onlyBase && message) {
      await notifyApiFailure(data, fallback);
      return;
    }
    await notifyValidationErrors(fieldErr);
    return;
  }
  await notifyApiFailure(data, fallback);
}

/** Mensaje de éxito devuelto por el API (`message`). */
export function parseApiSuccessMessage(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const message = (data as { message?: string }).message;
  return typeof message === "string" && message.trim() ? message : null;
}
