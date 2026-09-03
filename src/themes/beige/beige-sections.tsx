import Link from "next/link";
import type { PublicListingCard } from "@/lib/listing-types";
import type { PublicSiteContent } from "@/lib/public-site-content";
import {
  pickLocalized,
  type PublicLocation,
} from "@/lib/public-site-content";
import {
  fillTemplate,
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
    <section id="ubicaciones" className="bg-[#F4EFE6] py-20">
      <BeigeReveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
            {dict.locations.eyebrow}
          </p>
          <h2 className="beige-section__title mt-3 text-3xl md:text-4xl">
            {dict.locations.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[#8A7759]">
            {dict.locations.description}
          </p>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {items.map(({ location, href, imageSrc }) => (
              <li key={location.id}>
                <Link
                  href={href}
                  className="beige-card-hover group block overflow-hidden rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5]"
                >
                  <div className="aspect-[16/9] bg-[#E5D9C5]">
                    <BeigeCoverImage
                      src={imageSrc}
                      alt={
                        pickLocalized(location.imageAlt, locale) ||
                        fillTemplate(dict.locations.fallbackAlt, {
                          name: location.name,
                        })
                      }
                      className="beige-img-zoom h-full w-full object-cover"
                      placeholderClassName="flex h-full items-center justify-center text-[#A39073]"
                      placeholder={location.name}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl">{location.name}</h3>
                    {pickLocalized(location.shortDescription, locale) ? (
                      <p className="mt-2 text-sm text-[#8A7759]">
                        {pickLocalized(location.shortDescription, locale)}
                      </p>
                    ) : null}
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#8F9F81]">
                      {dict.locations.cta}
                      <BeigeIconArrowRight className="h-4 w-4" />
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
    <section id="comercial" className="py-20">
      <BeigeReveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
            {dict.commercial.kicker}
          </p>
          <h2 className="beige-section__title mt-3 text-3xl md:text-4xl">
            {dict.commercial.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[#8A7759]">
            {dict.commercial.description}
          </p>
          {commercial.length > 0 ? (
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {commercial.map((listing) => (
                <li key={listing.slug}>
                  <BeigeListingCard
                    listing={listing}
                    locale={locale}
                    defaultLocale={defaultLocale}
                    dict={dict}
                  />
                </li>
              ))}
            </ul>
          ) : whatsapp ? (
            <a
              href={whatsapp}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#A4B494] px-5 py-3 text-sm font-semibold text-[#2D2A26]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BeigeIconWhatsApp className="h-4 w-4" />
              {dict.commercial.cta}
            </a>
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
    <section id="nosotros" className="bg-[#F4EFE6] py-20">
      <BeigeReveal>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
              {dict.about.kicker}
            </p>
            <h2 className="beige-section__title mt-3 text-3xl md:text-4xl">
              {dict.about.title}
            </h2>
            <p className="mt-4 leading-relaxed text-[#8A7759]">
              {dict.about.description}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-[#2D2A26]">
              <li>{dict.about.benefit1}</li>
              <li>{dict.about.benefit2}</li>
              <li>{dict.about.benefit3}</li>
            </ul>
            {about.cta ? (
              <Link
                href={localizeSiteHref(about.cta.href, locale, defaultLocale)}
                className="mt-6 inline-flex rounded-full bg-[#A4B494] px-5 py-3 text-sm font-semibold text-[#2D2A26]"
              >
                {dict.about.cta}
              </Link>
            ) : null}
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#E5D9C5]">
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
                className="rounded-2xl border border-[#E5D9C5] bg-[#FBF9F5] p-6"
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
    <section id="proceso" className="bg-[#2D2A26] py-20 text-[#FBF9F5]">
      <BeigeReveal>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
            {dict.process.kicker}
          </p>
          <h2 className="beige-section__title mt-3 text-3xl md:text-4xl">
            {dict.process.title}
          </h2>
          <p className="mt-3 max-w-2xl text-[#E5D9C5]">{dict.process.subtitle}</p>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.n}>
                <p className="text-sm text-[#A4B494]">{step.n}</p>
                <h3 className="mt-2 text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#E5D9C5]">
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
    <section id="faq" className="py-20">
      <BeigeReveal>
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
            {dict.faq.eyebrow}
          </p>
          <h2 className="beige-section__title mt-3 text-3xl">{dict.faq.title}</h2>
          <dl className="mt-10 space-y-6">
            {items.map((item) => (
              <div key={item.q} className="border-b border-[#E5D9C5] pb-6">
                <dt className="text-lg">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[#8A7759]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
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
    <section id="contacto" className="bg-[#F4EFE6] py-20">
      <BeigeReveal>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
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
