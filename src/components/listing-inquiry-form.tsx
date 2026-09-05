"use client";

import { parseOfferType, type ListingOfferType } from "@/lib/listing-types";
import {
  useListingInquiry,
  type ListingInquiryCopy,
} from "@/lib/listing-inquiry";

export type ListingInquiryFormClassNames = {
  form?: string;
  field?: string;
  label?: string;
  control?: string;
  textarea?: string;
  error?: string;
  success?: string;
  submit?: string;
  submitPending?: string;
  submitLabel?: string;
};

type Props = {
  slug: string;
  offerType?: ListingOfferType | string | null;
  styledLayout?: boolean;
  copy?: ListingInquiryCopy;
  classNames?: ListingInquiryFormClassNames;
  inputIdPrefix?: string;
};

export function ListingInquiryForm({
  slug,
  offerType,
  styledLayout = true,
  copy,
  classNames,
  inputIdPrefix = "",
}: Props) {
  const { error, pending, sent, phone, onPhoneChange, onSubmit } =
    useListingInquiry(slug, copy);
  const isSale = parseOfferType(offerType) === "sale";
  const fieldId = (name: string) =>
    inputIdPrefix ? `${inputIdPrefix}-${name}` : name;

  const fieldFocus = styledLayout
    ? "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    : "focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20";
  const defaultSubmit = styledLayout
    ? "bg-blue-700 hover:bg-blue-600"
    : "bg-zinc-900 hover:bg-zinc-800";
  const defaultSuccess = styledLayout
    ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
    : "bg-zinc-100 text-zinc-900 ring-zinc-200";

  const formClass = classNames?.form ?? "space-y-4";
  const fieldClass = classNames?.field;
  const labelClass =
    classNames?.label ?? "mb-1 block text-sm font-medium text-zinc-700";
  const controlClass =
    classNames?.control ??
    `w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none ${fieldFocus}`;
  const textareaClass =
    classNames?.textarea ?? controlClass;
  const errorClass =
    classNames?.error ??
    "rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200";
  const successClass =
    classNames?.success ??
    `rounded-xl px-4 py-3 text-sm ring-1 ${defaultSuccess}`;
  const submitClass = [
    classNames?.submit ??
      `w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${defaultSubmit}`,
    pending ? classNames?.submitPending : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (sent) {
    return (
      <p className={successClass} role="status">
        {copy?.success ??
          "Tu mensaje fue enviado. La inmobiliaria se pondrá en contacto contigo."}
      </p>
    );
  }

  const submitLabel = pending
    ? (copy?.sending ?? "Enviando…")
    : (copy?.send ?? "Enviar mensaje");

  return (
    <form onSubmit={onSubmit} className={formClass}>
      {error ? (
        <p className={errorClass} role="alert">
          {error}
        </p>
      ) : null}
      <div className={fieldClass}>
        <label htmlFor={fieldId("name")} className={labelClass}>
          {copy?.name ?? "Nombre"}
        </label>
        <input
          id={fieldId("name")}
          name="name"
          required
          autoComplete="name"
          className={controlClass}
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor={fieldId("phone")} className={labelClass}>
          {copy?.phone ?? "Teléfono (10 dígitos)"}
        </label>
        <input
          id={fieldId("phone")}
          name="phone"
          inputMode="numeric"
          required
          autoComplete="tel"
          value={phone}
          onChange={onPhoneChange}
          className={controlClass}
        />
      </div>
      <div className={fieldClass}>
        <label htmlFor={fieldId("message")} className={labelClass}>
          {copy?.message ?? "Mensaje"}
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          rows={4}
          placeholder={
            isSale
              ? (copy?.placeholderSale ?? "Me interesa este inmueble en venta…")
              : (copy?.placeholderRent ?? "Me interesa rentar este inmueble…")
          }
          className={textareaClass}
        />
      </div>
      <button type="submit" disabled={pending} className={submitClass}>
        {classNames?.submitLabel ? (
          <span className={classNames.submitLabel}>{submitLabel}</span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
