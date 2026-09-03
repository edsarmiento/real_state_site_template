import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  localizeSiteHref,
  localizedHref,
  type SiteDictionary,
  type SiteLocale,
} from "@/lib/site-i18n";
import { beigeContactChannels } from "@/themes/beige/beige-contact-channels";
import {
  getBeigeCopy,
  resolveBeigeAboutCopy,
  resolveBeigeContactCopy,
  resolveBeigeProcessCopy,
  type BeigeCopy,
} from "@/themes/beige/beige-copy";
import { BeigeContactForm } from "@/themes/beige/beige-contact-form";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import {
  BeigeIconArrowRight,
  BeigeIconPhone,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeReveal } from "@/themes/beige/beige-reveal";

type Shared = {
  content: PublicSiteContent;
  dict: SiteDictionary;
  locale: SiteLocale;
  defaultLocale: SiteLocale;
};

export function BeigeLocations({
  locations,
  listings,
  locale,
  defaultLocale,
  copy,
}: {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  copy: BeigeCopy;
}) {
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href =
        localizedHref("/", locale, { city }, defaultLocale) + "#propiedades";
      const listingPhoto =
        listings.find(
          (listing) =>
            listing.city.trim().toLowerCase() === city.toLowerCase() &&
            listing.photo_url,
        )?.photo_url ?? null;
      return {
        location,
        href,
        imageSrc: location.imageUrl?.trim() || listingPhoto,
      };
    })
    .filter(
      (
        item,
      ): item is {
        location: PublicLocation;
        href: string;
        imageSrc: string | null;
      } => Boolean(item),
    );

  if (items.length === 0) return null;

  return (
    <section id="ubicaciones" className="border-y border-[#E5D9C5] bg-white py-24">
      <BeigeReveal>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A39073]">
              {copy.locationsEyebrow}
            </p>
            <h2 className="beige-section__title mt-2 text-3xl text-[#2D2A26] sm:text-5xl">
              {copy.locationsTitle}
            </h2>
            <p className="mt-4 font-light text-[#8A7759]">
              {copy.locationsDescription}
            </p>
          </div>
          <ul
            className={`grid grid-cols-1 gap-6 ${
              items.length === 1
                ? "mx-auto max-w-md"
                : items.length === 2
                  ? "mx-auto max-w-3xl md:grid-cols-2"
                  : "md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {items.map(({ location, href, imageSrc }) => (
              <li key={location.id}>
                <Link
                  href={href}
                  className="beige-location-card beige-card-hover group relative block min-h-[18rem] overflow-hidden rounded-3xl bg-[#2D2A26] shadow-md"
                >
                  {imageSrc ? (
                    <BeigeCoverImage
                      src={imageSrc}
                      alt=""
                      className="beige-img-zoom absolute inset-0 h-full w-full object-cover"
                      placeholderClassName="absolute inset-0 bg-[#E5D9C5]"
                      placeholder=""
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#E5D9C5]" />
                  )}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#2D2A26]/90 via-[#2D2A26]/35 to-transparent"
                    aria-hidden
                  />
                  <div className="relative z-10 flex min-h-[18rem] flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-medium">{location.name}</h3>
                    {pickLocalized(location.shortDescription, locale) ? (
                      <p className="mt-1 line-clamp-2 text-xs font-light text-[#E5D9C5]">
                        {pickLocalized(location.shortDescription, locale)}
                      </p>
                    ) : null}
                    <span className="beige-location-cta mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/95 px-4 py-2 text-xs font-semibold text-[#2D2A26]">
                      {copy.locationsCta}
                      <BeigeIconArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeAbout({
  content,
  locale,
  defaultLocale,
}: Shared) {
  const { about } = content;
  const copy = resolveBeigeAboutCopy(content, locale);
  const ctaHref =
    about.cta?.href === "#catalogo" || !about.cta?.href
      ? localizedHref("/#propiedades", locale, null, defaultLocale)
      : localizeSiteHref(about.cta.href, locale, defaultLocale);
  return (
    <section id="nosotros" className="border-y border-[#E5D9C5] bg-white py-24">
      <BeigeReveal>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
              {copy.kicker}
            </p>
            <h2 className="beige-section__title mt-2 text-3xl sm:text-5xl">
              {copy.title}
            </h2>
            <p className="mt-4 font-light leading-relaxed text-[#8A7759]">
              {copy.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-[#2D2A26]">
              {copy.benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2">
                  {benefit}
                </li>
              ))}
            </ul>
            {about.cta ? (
              <Link
                href={ctaHref}
                className="beige-btn mt-8 inline-flex rounded-full bg-[#A4B494] px-8 py-3.5 text-sm font-medium text-[#2D2A26] shadow-md"
              >
                {copy.cta}
              </Link>
            ) : null}
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white bg-[#E5D9C5] shadow-2xl">
            {about.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.imageUrl}
                alt={copy.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center text-[#A39073]">
                {content.brand.name}
              </div>
            )}
          </div>
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeTestimonials({
  content,
  dict,
  locale,
}: Pick<Shared, "content" | "dict" | "locale">) {
  const resolved = content.testimonials.flatMap((item) => {
    const quote = pickLocalized(item.quote, locale);
    if (!quote) return [];
    return [
      {
        id: item.id,
        quote,
        name: item.name,
        role: pickLocalized(item.role, locale),
        preview: item.preview === true,
      },
    ];
  });
  if (resolved.length === 0) return null;
  const isPreview = resolved.some((item) => item.preview);

  return (
    <section className="py-16">
      <BeigeReveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
            {dict.testimonials.eyebrow}
          </p>
          <h2 className="beige-section__title mt-3 text-3xl">{dict.testimonials.title}</h2>
          {isPreview ? (
            <p className="mt-2 text-sm text-[#A39073]" role="note">
              {dict.testimonials.previewNote}
            </p>
          ) : null}
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {resolved.map((item) => (
              <li
                key={item.id}
                className="beige-card-hover rounded-3xl border border-[#E5D9C5] bg-[#FBF9F5] p-8 shadow-sm"
              >
                <blockquote>
                  <p className="text-sm leading-relaxed text-[#2D2A26]">
                    {item.quote}
                  </p>
                  <footer className="mt-4 text-xs uppercase tracking-wider text-[#A39073]">
                    {item.name}
                    {item.role ? ` · ${item.role}` : ""}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeProcess({
  dict,
  content,
  locale,
}: Pick<Shared, "dict" | "content" | "locale">) {
  const processCopy = resolveBeigeProcessCopy(content, locale);
  const steps = [
    { n: "01", title: dict.process.step1Title, copy: dict.process.step1Description },
    { n: "02", title: dict.process.step2Title, copy: dict.process.step2Description },
    { n: "03", title: dict.process.step3Title, copy: dict.process.step3Description },
  ];
  return (
    <section id="proceso" className="bg-[#FBF9F5] py-24">
      <BeigeReveal>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
              {dict.process.kicker}
            </p>
            <h2 className="beige-section__title mt-2 text-3xl sm:text-5xl">
              {processCopy.title}
            </h2>
            <p className="mt-4 font-light text-[#8A7759]">
              {processCopy.subtitle}
            </p>
          </div>
          <ol className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.n}
                className="beige-card-hover group relative rounded-3xl border border-[#E5D9C5] bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A4B494]/20 font-bold text-[#2D2A26] transition-colors duration-300 group-hover:bg-[#A4B494] group-hover:text-white">
                  {step.n}
                </div>
                <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
                <p className="text-xs font-light leading-relaxed text-[#8A7759]">
                  {step.copy}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeContact({
  content,
  dict,
  locale,
  defaultLocale,
  listingSlug,
}: Shared & { listingSlug: string | null }) {
  const copy = getBeigeCopy(locale);
  const headings = resolveBeigeContactCopy(content, locale);
  const channels = beigeContactChannels(content);
  const whatsappHref = channels.whatsappHref;
  const phoneHref = channels.phoneHref;
  const showWhatsApp = Boolean(whatsappHref);
  const showCall = Boolean(phoneHref && channels.phone);

  return (
    <section id="contacto" className="bg-[#2D2A26] py-24 text-[#FBF9F5]">
      <BeigeReveal>
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C4D3A2]">
              {copy.contactKicker}
            </p>
            <h2 className="beige-section__title mt-3 text-3xl sm:text-5xl">
              {headings.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-light text-[#E5D9C5]">
              {headings.subtitle}
            </p>
            {showWhatsApp || showCall ? (
              <div
                data-beige-contact-actions
                className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
              >
                {showWhatsApp && whatsappHref ? (
                  <a
                    href={whatsappHref}
                    className="beige-contact-cta beige-contact-cta--primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-beige-cta="form-whatsapp"
                    aria-label={`${copy.openWhatsApp}. ${dict.a11y.opensInNewTab}`}
                  >
                    <BeigeIconWhatsApp className="h-5 w-5 shrink-0" />
                    {copy.openWhatsApp}
                  </a>
                ) : null}
                {showCall && phoneHref ? (
                  <a
                    href={phoneHref}
                    className="beige-contact-cta beige-contact-cta--outline"
                    data-beige-cta="form-call"
                  >
                    <BeigeIconPhone className="h-5 w-5 shrink-0" />
                    {copy.callNow}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="mt-12 rounded-[2rem] bg-white p-6 text-[#2D2A26] shadow-2xl sm:p-10">
            <BeigeContactForm
              listingSlug={listingSlug}
              legal={content.legal}
              dict={dict}
              locale={locale}
              defaultLocale={defaultLocale}
            />
          </div>
        </div>
      </BeigeReveal>
    </section>
  );
}
