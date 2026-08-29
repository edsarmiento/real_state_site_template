"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ValidationErrorList } from "@/components/ui/feedback";
import type { ConfirmOptions, NotifyOptions } from "@/lib/notifications";

export type AlertModalState = {
  kind: "alert";
  message: string;
  options?: NotifyOptions;
  resolve: () => void;
};

export type ConfirmModalState = {
  kind: "confirm";
  message: string;
  options?: ConfirmOptions;
  resolve: (ok: boolean) => void;
};

export type NotificationModalState = AlertModalState | ConfirmModalState;

const variantTitle: Record<
  NonNullable<NotifyOptions["variant"]>,
  string
> = {
  info: "Aviso",
  success: "Listo",
  warning: "Atención",
  error: "Error",
};

const variantAccent: Record<
  NonNullable<NotifyOptions["variant"]>,
  string
> = {
  info: "border-zinc-200 dark:border-zinc-700",
  success: "border-emerald-200 dark:border-emerald-900",
  warning: "border-amber-200 dark:border-amber-900",
  error: "border-red-200 dark:border-red-900",
};

type Props = {
  state: NotificationModalState;
  onClose: () => void;
};

export function NotificationModal({ state, onClose }: Props) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, [state.kind]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (state.kind === "confirm") {
          state.resolve(false);
        } else {
          state.resolve();
        }
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [state, onClose]);

  const isConfirm = state.kind === "confirm";
  const alertOpts = state.kind === "alert" ? state.options : undefined;
  const confirmOpts = state.kind === "confirm" ? state.options : undefined;
  const variant = alertOpts?.variant ?? "info";
  const title =
    alertOpts?.title ??
    confirmOpts?.title ??
    (isConfirm ? "Confirmar" : variantTitle[variant]);

  function finishAlert() {
    if (state.kind === "alert") state.resolve();
    onClose();
  }

  function finishConfirm(ok: boolean) {
    if (state.kind === "confirm") state.resolve(ok);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-[1px]"
        aria-label="Cerrar"
        onClick={() =>
          isConfirm ? finishConfirm(false) : finishAlert()
        }
      />
      <div
        role={isConfirm ? "alertdialog" : "alert"}
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative w-full max-w-md rounded-xl border bg-white p-5 shadow-xl dark:bg-zinc-900 ${variantAccent[variant]}`}
      >
        <h2
          id={titleId}
          className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
        <div className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
          {alertOpts?.validationErrors ? (
            <ValidationErrorList
              errors={alertOpts.validationErrors}
              title=""
            />
          ) : state.message ? (
            <p className="whitespace-pre-wrap">{state.message}</p>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {isConfirm ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => finishConfirm(false)}
              >
                {confirmOpts?.cancelLabel ?? "Cancelar"}
              </Button>
              <Button
                ref={confirmRef}
                type="button"
                variant={confirmOpts?.danger ? "danger" : "primary"}
                size="sm"
                onClick={() => finishConfirm(true)}
              >
                {confirmOpts?.confirmLabel ?? "Confirmar"}
              </Button>
            </>
          ) : (
            <Button
              ref={confirmRef}
              type="button"
              variant="primary"
              size="sm"
              onClick={finishAlert}
            >
              Aceptar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
