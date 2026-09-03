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
import { BeigeContactForm } from "@/themes/beige/beige-contact-form";
import { BeigeCoverImage } from "@/themes/beige/beige-cover-image";
import {
  BeigeIconArrowRight,
  BeigeIconMapPin,
  BeigeIconWhatsApp,
} from "@/themes/beige/beige-icons";
import { BeigeListingCard } from "@/themes/beige/beige-listing-card";
import { BeigeReveal } from "@/themes/beige/beige-reveal";

const COMMERCIAL_TYPES = new Set(["office", "retail", "warehouse"]);

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
  dict,
}: {
  locations: PublicLocation[];
  listings: PublicListingCard[];
  locale: SiteLocale;
  defaultLocale: SiteLocale;
  dict: SiteDictionary;
}) {
  const items = locations
    .map((location) => {
      const city = location.filter.city?.trim();
      if (!city) return null;
      const href = localizedHref("/", locale, { city }, defaultLocale);
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
              {dict.locations.eyebrow}
            </p>
            <h2 className="beige-section__title mt-2 text-3xl text-[#2D2A26] sm:text-5xl">
              {dict.locations.title}
            </h2>
            <p className="mt-4 font-light text-[#8A7759]">
              {dict.locations.description}
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {items.map(({ location, href, imageSrc }) => (
              <li key={location.id}>
                <Link
                  href={href}
                  className="beige-card-hover group block cursor-pointer rounded-3xl border border-[#E5D9C5] bg-[#FBF9F5] p-8 text-center"
                >
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#A4B494]/20 text-[#2D2A26] shadow-sm transition-colors duration-300 group-hover:bg-[#A4B494] group-hover:text-white">
                    {imageSrc ? (
                      <span className="h-full w-full overflow-hidden rounded-2xl">
                        <BeigeCoverImage
                          src={imageSrc}
                          alt=""
                          className="h-full w-full object-cover"
                          placeholderClassName="flex h-full items-center justify-center"
                          placeholder=""
                        />
                      </span>
                    ) : (
                      <BeigeIconMapPin className="h-6 w-6" />
                    )}
                  </div>
                  <h3 className="mb-2 text-xl font-medium">{location.name}</h3>
                  {pickLocalized(location.shortDescription, locale) ? (
                    <p className="mb-4 text-xs font-light text-[#A39073]">
                      {pickLocalized(location.shortDescription, locale)}
                    </p>
                  ) : null}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D2A26] transition-colors group-hover:text-[#A4B494]">
                    {dict.locations.cta}
                    <BeigeIconArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeCommercial({
  listings,
  content,
  dict,
  locale,
  defaultLocale,
}: Shared & { listings: PublicListingCard[] }) {
  const commercial = listings.filter((listing) =>
    COMMERCIAL_TYPES.has(listing.property_type),
  );
  const whatsapp = content.whatsapp.href ?? content.contact.whatsappHref;

  return (
    <section id="comercial" className="border-y border-[#E5D9C5]/60 bg-[#F4EFE6]/50 py-24">
      <BeigeReveal>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
                {dict.commercial.kicker}
              </p>
              <h2 className="beige-section__title text-3xl leading-tight text-[#2D2A26] sm:text-5xl">
                {dict.commercial.title}
              </h2>
              <p className="font-light leading-relaxed text-[#8A7759]">
                {dict.commercial.description}
              </p>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  className="beige-btn inline-block rounded-full bg-[#2D2A26] px-8 py-4 text-sm font-medium text-white shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.commercial.cta}
                </a>
              ) : null}
            </div>
            <div className="lg:col-span-6">
              {commercial.length > 0 ? (
                <ul className="grid gap-6">
                  {commercial.slice(0, 1).map((listing) => (
                    <li key={listing.slug}>
                      <div className="beige-card-hover relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                        <BeigeCoverImage
                          src={listing.photo_url}
                          alt={listing.title}
                          className="beige-img-zoom h-[420px] w-full object-cover"
                          placeholderClassName="h-[420px] bg-[#E5D9C5]"
                          placeholder={listing.title}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-[420px] rounded-3xl border-4 border-white bg-[#E5D9C5] shadow-2xl" />
              )}
            </div>
          </div>
          {commercial.length > 1 ? (
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {commercial.slice(1, 4).map((listing) => (
                <li key={listing.slug}>
                  <BeigeListingCard
                    listing={listing}
                    locale={locale}
                    defaultLocale={defaultLocale}
                    dict={dict}
                    whatsappHref={whatsapp}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </BeigeReveal>
    </section>
  );
}

export function BeigeAbout({
  content,
  dict,
  locale,
  defaultLocale,
}: Shared) {
  const { about } = content;
  return (
    <section id="nosotros" className="border-y border-[#E5D9C5] bg-white py-24">
      <BeigeReveal>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
              {dict.about.kicker}
            </p>
            <h2 className="beige-section__title mt-2 text-3xl sm:text-5xl">
              {dict.about.title}
            </h2>
            <p className="mt-4 font-light leading-relaxed text-[#8A7759]">
              {dict.about.description}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-[#2D2A26]">
              <li className="flex items-center gap-2">{dict.about.benefit1}</li>
              <li className="flex items-center gap-2">{dict.about.benefit2}</li>
              <li className="flex items-center gap-2">{dict.about.benefit3}</li>
            </ul>
            {about.cta ? (
              <Link
                href={localizeSiteHref(about.cta.href, locale, defaultLocale)}
                className="beige-btn mt-8 inline-flex rounded-full bg-[#A4B494] px-8 py-3.5 text-sm font-medium text-[#2D2A26] shadow-md"
              >
                {dict.about.cta}
              </Link>
            ) : null}
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white bg-[#E5D9C5] shadow-2xl">
            {about.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.imageUrl}
                alt={dict.about.title}
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

export function BeigeProcess({ dict }: Pick<Shared, "dict">) {
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
              {dict.process.title}
            </h2>
            <p className="mt-4 font-light text-[#8A7759]">{dict.process.subtitle}</p>
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

export function BeigeFaq({ dict }: Pick<Shared, "dict">) {
  const items = [
    { q: dict.faq.q1, a: dict.faq.a1 },
    { q: dict.faq.q2, a: dict.faq.a2 },
    { q: dict.faq.q3, a: dict.faq.a3 },
  ];
  return (
    <section id="faq" className="beige-faq py-24">
      <BeigeReveal>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A39073]">
            {dict.faq.eyebrow}
          </p>
          <h2 className="beige-section__title mt-2 text-3xl sm:text-5xl">
            {dict.faq.title}
          </h2>
          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <details
                key={item.q}
                className="group rounded-3xl border border-[#E5D9C5] bg-white px-6 py-2 shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 py-4 text-lg">
                  {item.q}
                  <BeigeIconArrowRight className="beige-faq__chevron h-4 w-4 shrink-0 rotate-90 text-[#A39073]" />
                </summary>
                <p className="pb-4 text-sm font-light leading-relaxed text-[#8A7759]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
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
}: Shared) {
  const { contact } = content;
  const whatsapp = content.whatsapp.href ?? contact.whatsappHref;
  return (
    <section id="contacto" className="bg-[#F4EFE6] py-24">
      <BeigeReveal>
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
              {dict.contact.kicker}
            </p>
            <h2 className="beige-section__title mt-3 text-3xl">
              {dict.contact.heading}
            </h2>
            <p className="mt-4 text-[#8A7759]">{dict.contact.description}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    className="inline-flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BeigeIconWhatsApp className="h-4 w-4" />
                    {dict.whatsapp.label}
                  </a>
                </li>
              ) : null}
              {contact.phoneHref && contact.phone ? (
                <li>
                  <a href={contact.phoneHref}>{contact.phone}</a>
                </li>
              ) : null}
              {contact.location ? (
                <li className="inline-flex items-center gap-2">
                  <BeigeIconMapPin className="h-4 w-4" />
                  {contact.location}
                </li>
              ) : null}
            </ul>
          </div>
          <BeigeContactForm
            contact={contact}
            legal={content.legal}
            dict={dict}
            locale={locale}
            defaultLocale={defaultLocale}
          />
        </div>
      </BeigeReveal>
    </section>
  );
}
