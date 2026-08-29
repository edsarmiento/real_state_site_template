import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingInquiryForm } from "@/components/listing-inquiry-form";
import { ListingOfferBadge } from "@/components/listing-offer-badge";
import { ListingWhatsAppButton } from "@/components/listing-whatsapp-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { publicApiFetch } from "@/lib/public-api-fetch";
import {
  formatRentCents,
  listingPriceSuffix,
  listingPublicSpecs,
  OFFER_TYPE_LABEL,
  parseOfferType,
  type PublicListingDetail,
} from "@/lib/listing-types";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { PropertyType } from "@/lib/property-types";
import { siteName } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await publicApiFetch<PublicListingDetail>(
    `/api/public/listings/${encodeURIComponent(slug)}`,
  );
  if (!result.ok) return { title: "Inmueble" };

  const listing = result.data;
  return {
    title: listing.title,
    description: listing.description?.slice(0, 160) ?? listing.location_label,
    alternates: {
      canonical: `/inmueble/${slug}`,
    },
    openGraph: {
      title: listing.title,
      siteName: siteName(),
      url: `/inmueble/${slug}`,
      images: listing.photo_url ? [{ url: listing.photo_url }] : undefined,
    },
  };
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await publicApiFetch<PublicListingDetail>(
    `/api/public/listings/${encodeURIComponent(slug)}`,
  );

  if (!result.ok) notFound();

  const listing = result.data;
  const photos = listing.photos ?? [];
  const offerType = parseOfferType(listing.offer_type);
  const priceSuffix = listingPriceSuffix(offerType);
  const specs = listingPublicSpecs(listing);
  const typeLabel =
    propertyTypeLabel[listing.property_type as PropertyType] ??
    listing.property_type;

  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-zinc-200">
          {photos.length > 0 ? (
            <div className="grid gap-1 sm:grid-cols-2">
              {photos.slice(0, 4).map((p) =>
                p.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.id}
                    src={p.url}
                    alt=""
                    className="aspect-[4/3] w-full object-cover sm:col-span-1 first:sm:col-span-2 first:sm:row-span-2"
                  />
                ) : null,
              )}
            </div>
          ) : listing.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.photo_url}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
          ) : null}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-3">
              <ListingOfferBadge offerType={offerType} />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {typeLabel}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-zinc-950 sm:text-4xl">
              {listing.title}
            </h1>
            <p className="mt-2 text-zinc-600">{listing.location_label}</p>
            <p className="mt-4 text-3xl font-semibold text-blue-700">
              {formatRentCents(listing.rent_cents, listing.currency)}
              {priceSuffix ? (
                <span className="text-base font-medium text-zinc-500">
                  {priceSuffix}
                </span>
              ) : null}
            </p>

            {specs.length > 0 ? (
              <dl className="mt-6 flex flex-wrap gap-3">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-100"
                  >
                    <dt className="text-xs font-semibold uppercase text-zinc-500">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-medium text-zinc-900">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {listing.description ? (
              <p className="mt-8 whitespace-pre-wrap text-zinc-700">
                {listing.description}
              </p>
            ) : null}

            {listing.address_label ? (
              <p className="mt-6 text-sm text-zinc-600">{listing.address_label}</p>
            ) : null}
          </div>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-zinc-200 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-950">
            Contacto · {OFFER_TYPE_LABEL[offerType]}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Publicado por {listing.agency_name || siteName()}.
          </p>

          {listing.contact_phone ? (
            <div className="mt-6">
              <ListingWhatsAppButton
                phone={listing.contact_phone}
                title={listing.title}
                slug={listing.slug}
                offerType={offerType}
              />
            </div>
          ) : null}

          <div className={listing.contact_phone ? "mt-8" : "mt-6"}>
            <p className="mb-4 text-sm font-semibold text-zinc-800">
              O déjanos tus datos y te contactamos
            </p>
            <ListingInquiryForm slug={listing.slug} offerType={offerType} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
