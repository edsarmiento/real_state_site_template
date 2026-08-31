import type { ReactNode } from "react";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import { ListingPhotoGallery } from "@/components/listing-photo-gallery";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import { OpenInMapsLink } from "@/components/open-in-maps-link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  formatRentCents,
  listingPriceSuffix,
  listingPublicSpecs,
  parseOfferType,
} from "@/lib/listing-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { PropertyType } from "@/lib/property-types";
import { listingPublicUrl } from "@/lib/site-config-env";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import type { ListingDetailThemeProps } from "@/themes/theme-types";

function specStyles(label: string) {
  const styles: Record<
    string,
    { panel: string; label: string; value: string }
  > = {
    Recámaras: {
      panel:
        "bg-gradient-to-br from-blue-100/95 to-indigo-100/75 ring-blue-300/55 shadow-sm shadow-blue-950/8",
      label: "text-blue-800/75",
      value: "text-blue-950",
    },
    Baños: {
      panel:
        "bg-gradient-to-br from-sky-100/95 to-cyan-100/75 ring-sky-300/55 shadow-sm shadow-sky-950/8",
      label: "text-sky-900/70",
      value: "text-sky-950",
    },
    Terreno: {
      panel:
        "bg-gradient-to-br from-emerald-100/95 to-teal-100/75 ring-emerald-300/55 shadow-sm shadow-emerald-950/8",
      label: "text-emerald-900/70",
      value: "text-emerald-950",
    },
    Construcción: {
      panel:
        "bg-gradient-to-br from-violet-100/95 to-purple-100/75 ring-violet-300/55 shadow-sm shadow-violet-950/8",
      label: "text-violet-900/70",
      value: "text-violet-950",
    },
  };

  return (
    styles[label] ?? {
      panel:
        "bg-gradient-to-br from-white to-blue-50/80 ring-blue-950/10 shadow-sm",
      label: "text-zinc-500",
      value: "text-zinc-950",
    }
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  const tone = specStyles(label);

  return (
    <div
      className={`min-w-[calc(50%-0.3125rem)] flex-1 rounded-2xl px-4 py-3.5 ring-1 sm:min-w-[6.5rem] sm:flex-none sm:py-3.5 ${tone.panel}`}
    >
      <dt
        className={`text-xs font-semibold uppercase tracking-[0.14em] sm:text-[0.65rem] sm:tracking-[0.16em] ${tone.label}`}
      >
        {label}
      </dt>
      <dd
        className={`mt-1 text-3xl font-semibold tabular-nums tracking-tight sm:text-2xl ${tone.value}`}
      >
        {value}
      </dd>
    </div>
  );
}

type InfoCardVariant = "description" | "location";

const INFO_CARD_STYLES: Record<
  InfoCardVariant,
  { panel: string; title: string; accent: string }
> = {
  description: {
    panel:
      "bg-gradient-to-br from-amber-50/95 via-orange-50/35 to-blue-50/90 ring-amber-200/65 shadow-md shadow-amber-950/6",
    title: "text-amber-900/75",
    accent: "border-amber-400/80",
  },
  location: {
    panel:
      "bg-gradient-to-br from-emerald-50/95 via-teal-50/40 to-sky-50/85 ring-emerald-200/65 shadow-md shadow-emerald-950/6",
    title: "text-emerald-900/75",
    accent: "border-emerald-400/80",
  },
};

function InfoCard({
  title,
  variant,
  children,
}: {
  title: string;
  variant: InfoCardVariant;
  children: ReactNode;
}) {
  const tone = INFO_CARD_STYLES[variant];

  return (
    <div
      className={`mt-8 rounded-2xl border-l-4 px-5 py-6 ring-1 sm:px-6 sm:py-5 ${tone.panel} ${tone.accent}`}
    >
      <h2
        className={`text-xs font-semibold uppercase tracking-[0.14em] sm:text-[0.65rem] sm:tracking-[0.16em] ${tone.title}`}
      >
        {title}
      </h2>
      <div className="mt-3.5 sm:mt-3">{children}</div>
    </div>
  );
}

export async function DefaultListingDetail({ listing }: ListingDetailThemeProps) {
  const config = await getResolvedSiteConfig();
  const listingUrl = listingPublicUrl(listing.slug, config.siteOrigin);
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const priceSuffix = listingPriceSuffix(offerType);
  const specs = listingPublicSpecs(listing);
  const typeLabel =
    propertyTypeLabel[listing.property_type as PropertyType] ??
    listing.property_type;
  const isSale = offerType === "sale";
  const agency = listing.agency_name || config.siteName;

  return (
    <div className="relative min-h-screen bg-[#f3f6fb]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_at_top,_#dbeafe_0%,_transparent_55%),linear-gradient(180deg,_#eff6ff_0%,_#f3f6fb_75%)]"
        aria-hidden
      />

      <div className="relative">
        <SiteHeader />

        <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
          <ListingPhotoGallery
            title={listing.title}
            photos={photos}
            fallbackUrl={listing.photo_url}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <article>
              <div className="flex flex-wrap items-center gap-2">
                <ListingOfferBadge offerType={offerType} />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  {typeLabel}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700 sm:text-xs sm:tracking-[0.2em]">
                {listing.location_label}
              </p>
              <h1 className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl sm:leading-[1.12]">
                {listing.title}
              </h1>

              <p className="mt-5 text-[2.15rem] font-semibold tabular-nums tracking-tight text-blue-700 sm:mt-6 sm:text-4xl">
                {formatRentCents(listing.rent_cents, listing.currency)}
                {priceSuffix ? (
                  <span className="ml-2 text-lg font-medium tracking-normal text-zinc-500 sm:text-base">
                    {priceSuffix}
                  </span>
                ) : null}
              </p>

              <dl className="mt-8 flex flex-wrap gap-2.5 sm:gap-3">
                {specs.map((spec) => (
                  <Spec key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </dl>

              {listing.description ? (
                <InfoCard title="Descripción" variant="description">
                  <p className="whitespace-pre-wrap text-justify text-lg leading-8 text-zinc-800 sm:text-base sm:leading-relaxed">
                    {listing.description}
                  </p>
                </InfoCard>
              ) : null}

              {listing.address_label ||
              (listing.latitude != null && listing.longitude != null) ? (
                <InfoCard title="Ubicación" variant="location">
                  {listing.address_label ? (
                    <p className="text-lg leading-8 text-zinc-800 sm:text-base sm:leading-relaxed">
                      {listing.address_label}
                    </p>
                  ) : null}
                  {listing.latitude != null && listing.longitude != null ? (
                    <div
                      className={
                        listing.address_label ? "mt-4 sm:mt-3" : undefined
                      }
                    >
                      <OpenInMapsLink
                        latitude={listing.latitude}
                        longitude={listing.longitude}
                        label={listing.title}
                        showCoordinates={false}
                        linkText="Ver en el mapa"
                      />
                    </div>
                  ) : null}
                </InfoCard>
              ) : null}

              <p className="mt-10 text-base text-zinc-500 sm:text-sm">
                Anunciado por{" "}
                <span className="font-semibold text-zinc-900">{agency}</span>
              </p>
            </article>

            <aside className="rounded-3xl bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.04),0_18px_40px_-24px_rgba(37,99,235,0.4)] ring-1 ring-blue-950/10 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-[1.65rem] font-semibold tracking-tight text-zinc-950 sm:text-2xl">
                {isSale ? "Me interesa comprar" : "Me interesa rentar"}
              </h2>
              <p className="mt-2 text-base font-semibold leading-relaxed text-zinc-800 sm:text-sm">
                {isSale
                  ? "Pregunta precio, escrituración o visita."
                  : "Tu mensaje llega directo a la inmobiliaria."}
              </p>
              {listing.contact_phone ? (
                <div className="mt-5">
                  <ListingWhatsAppButton
                    phone={listing.contact_phone}
                    title={listing.title}
                    listingUrl={listingUrl}
                    offerType={offerType}
                  />
                </div>
              ) : null}
              <div className={listing.contact_phone ? "mt-6" : "mt-5"}>
                {listing.contact_phone ? (
                  <p className="mb-3 text-center text-sm font-semibold text-zinc-800">
                    O déjanos tus datos y te contactamos
                  </p>
                ) : null}
                <ListingInquiryForm slug={listing.slug} offerType={offerType} />
              </div>
            </aside>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
