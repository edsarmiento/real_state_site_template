import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicApiFetch } from "@/lib/public-api-fetch";
import {
  formatRentCents,
  listingPriceSuffix,
  parseOfferType,
  type PublicListingDetail,
} from "@/lib/listing-types";
import { getSessionContext } from "@/lib/session-context";
import { listingPublicUrl } from "@/lib/site-config-env";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import { getDictionary, resolveRequestLocale } from "@/lib/site-i18n";
import { firstSearchParam } from "@/lib/search-params";
import { resolveSiteThemeFromConfig } from "@/themes/resolve-site-theme";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function listingShareImage(
  listing: PublicListingDetail,
  siteOrigin: string,
): string | null {
  const raw =
    listing.photos?.find((p) => p.url)?.url ?? listing.photo_url ?? null;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return new URL(raw.startsWith("/") ? raw : `/${raw}`, siteOrigin).href;
}

function listingShareDescription(
  listing: PublicListingDetail,
  locale: "es" | "en",
): string {
  const dict = getDictionary(locale);
  const offerType = parseOfferType(listing.offer_type);
  const price = formatRentCents(listing.rent_cents, listing.currency);
  const suffix =
    offerType === "rent" ? dict.listing.perMonth : listingPriceSuffix(offerType);
  const priceLabel = suffix ? `${price}${suffix}` : price;
  const offerLabel =
    offerType === "sale" ? dict.listing.sale : dict.listing.rent;
  return [
    `${offerLabel} · ${priceLabel}`,
    listing.location_label || null,
    listing.description?.trim() || null,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 200);
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = firstSearchParam((await searchParams).lang);
  const config = await getResolvedSiteConfig();
  const locale = resolveRequestLocale(lang, config.locale);
  const dict = getDictionary(locale);
  const path = `/inmueble/${encodeURIComponent(slug)}`;
  const result = await publicApiFetch<PublicListingDetail>(
    `/api/public/listings/${encodeURIComponent(slug)}`,
  );

  if (!result.ok) {
    return { title: dict.listing.metaFallback };
  }

  const listing = result.data;
  const title = listing.title;
  const image = listingShareImage(listing, config.siteOrigin);
  const description = listingShareDescription(listing, locale);
  const ogLocale = locale === "en" ? "en_US" : "es_MX";

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: ogLocale,
      url: listingPublicUrl(slug, config.siteOrigin),
      siteName: config.siteName,
      title,
      description,
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const lang = firstSearchParam((await searchParams).lang);
  const theme = await resolveSiteThemeFromConfig();
  const result = await publicApiFetch<PublicListingDetail>(
    `/api/public/listings/${encodeURIComponent(slug)}`,
  );

  if (result.status === 404) notFound();
  if (!result.ok) {
    if (theme.ListingLoadError) {
      const ListingLoadError = theme.ListingLoadError;
      return <ListingLoadError status={result.status} lang={lang} />;
    }
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-16 text-sm text-zinc-600">
        No se pudo cargar el anuncio ({result.status}).
      </div>
    );
  }

  const session = await getSessionContext();
  const ListingDetail = theme.ListingDetail;

  return (
    <ListingDetail
      listing={result.data}
      isAdmin={session?.isStaffUser === true}
      lang={lang}
    />
  );
}
