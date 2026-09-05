"use client";

import { useMemo, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ErrorBanner,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/ui";
import { notify, notifyApiResponseFailure } from "@/lib/notifications";
import { isMxLocalPhone, onlyPhoneDigits, toMxLocalPhone } from "@/lib/phone";
import { parseApiFailureMessage } from "@/lib/validation";
import {
  parseOfferType,
  type ListingOfferType,
  type StaffListing,
} from "@/lib/listing-types";

export type ListingUnitOption = {
  id: number;
  label: string;
  status: string;
};

type Props = {
  listing?: StaffListing | null;
  units: ListingUnitOption[];
  emailConfirmed?: boolean;
};

function unitsForOffer(
  units: ListingUnitOption[],
  offerType: ListingOfferType,
): ListingUnitOption[] {
  return units.filter((u) => {
    if (u.status === "inactive") return false;
    if (offerType === "rent") return u.status === "available";
    return true;
  });
}

export function ListingForm({ listing, units, emailConfirmed = true }: Props) {
  const router = useRouter();
  const isEdit = Boolean(listing);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [offerType, setOfferType] = useState<ListingOfferType>(
    parseOfferType(listing?.offer_type),
  );
  const [contactPhone, setContactPhone] = useState(
    toMxLocalPhone(listing?.contact_phone),
  );

  const visibleUnits = useMemo(
    () => unitsForOffer(units, offerType),
    [units, offerType],
  );

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    setContactPhone(onlyPhoneDigits(e.target.value));
  }

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const status = String(fd.get("status") || "draft");
    const phoneDigits = onlyPhoneDigits(
      String(fd.get("contact_phone") || contactPhone),
    );

    if (status === "published" && !isMxLocalPhone(phoneDigits)) {
      setError(
        "El teléfono de contacto (WhatsApp) es obligatorio para publicar (10 dígitos).",
      );
      return;
    }
    if (phoneDigits && !isMxLocalPhone(phoneDigits)) {
      setError("El teléfono de contacto debe tener exactamente 10 dígitos.");
      return;
    }

    const rentPesos = Number(fd.get("rent_pesos") || 0);
    const body = {
      listing: {
        ...(isEdit ? {} : { unit_id: Number(fd.get("unit_id")) }),
        title: String(fd.get("title") || "").trim(),
        description: String(fd.get("description") || "").trim() || null,
        rent_cents: Math.round(rentPesos * 100),
        currency: String(fd.get("currency") || "MXN"),
        status,
        offer_type: offerType,
        show_exact_address: fd.get("show_exact_address") === "on",
        contact_phone: phoneDigits || null,
      },
    };

    setError(null);
    setPending(true);
    try {
      const res = await fetch(
        isEdit ? `/api/v1/listings/${listing!.id}` : "/api/v1/listings",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiFailureMessage(data));
        await notifyApiResponseFailure(data);
        return;
      }
      await notify(isEdit ? "Anuncio guardado." : "Anuncio creado.", {
        variant: "success",
      });
      const id = (data as StaffListing).id ?? listing?.id;
      router.push(id ? `/listings/${id}` : "/listings");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const priceLabel =
    offerType === "sale" ? "Precio de venta" : "Renta mensual";

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <SelectField
        id="offer_type"
        name="offer_type"
        label="Tipo de anuncio"
        value={offerType}
        onChange={(e) => setOfferType(parseOfferType(e.target.value))}
      >
        <option value="rent">Renta</option>
        <option value="sale">Venta</option>
      </SelectField>

      {!isEdit ? (
        visibleUnits.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {offerType === "rent"
              ? "No hay unidades disponibles para rentar. Libera una unidad o publica una venta."
              : "No hay unidades para anunciar en venta."}
          </p>
        ) : (
          <SelectField
            id="unit_id"
            name="unit_id"
            label="Unidad"
            required
            key={offerType}
          >
            <option value="">
              {offerType === "sale"
                ? "Selecciona una unidad…"
                : "Selecciona una unidad disponible…"}
            </option>
            {visibleUnits.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </SelectField>
        )
      ) : null}

      <TextField
        id="title"
        name="title"
        label="Título del anuncio"
        required
        defaultValue={listing?.title ?? ""}
      />
      <TextAreaField
        id="description"
        name="description"
        label="Descripción"
        rows={5}
        defaultValue={listing?.description ?? ""}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="rent_pesos"
          name="rent_pesos"
          label={priceLabel}
          type="number"
          min={1}
          step="1"
          required
          defaultValue={
            listing ? String(Math.round(listing.rent_cents / 100)) : ""
          }
        />
        <SelectField
          id="currency"
          name="currency"
          label="Moneda"
          defaultValue={listing?.currency ?? "MXN"}
        >
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
        </SelectField>
      </div>

      <TextField
        id="contact_phone"
        name="contact_phone"
        label="WhatsApp de contacto"
        inputMode="numeric"
        autoComplete="tel-national"
        pattern="\d{10}"
        maxLength={10}
        value={contactPhone}
        onChange={onPhoneChange}
        hint="10 dígitos. Obligatorio para publicar; los interesados abren chat con este número."
      />

      {isEdit && listing ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Ubicación y tipología vienen de la propiedad
          {listing.property_name ? ` «${listing.property_name}»` : ""}:{" "}
          {[listing.city, listing.colony, listing.street_address]
            .filter(Boolean)
            .join(" · ") || "—"}
          . Edítalas en Propiedades.
        </p>
      ) : null}

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          name="show_exact_address"
          defaultChecked={listing?.show_exact_address ?? false}
          className="rounded border-zinc-300"
        />
        Mostrar dirección exacta en el catálogo público
      </label>
      <SelectField
        id="status"
        name="status"
        label="Estado"
        defaultValue={
          !emailConfirmed && listing?.status !== "published"
            ? "draft"
            : (listing?.status ?? "draft")
        }
      >
        <option value="draft">Borrador</option>
        <option value="published" disabled={!emailConfirmed}>
          Publicado
        </option>
        <option value="paused">Pausado</option>
      </SelectField>
      {!emailConfirmed ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Confirma tu correo para publicar anuncios.
        </p>
      ) : null}

      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
      <Button
        type="submit"
        disabled={pending || (!isEdit && visibleUnits.length === 0)}
      >
        {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear anuncio"}
      </Button>
    </form>
  );
}
