import { cache } from "react";
import {
  contrastSafeSurface,
  normalizeHexColor,
  resolveLuxuryAccentTokens,
} from "@/lib/color-contrast";
import {
  bodyFontFamily,
  headingFontFamily,
  resolveSiteTypography,
  type TypographyConfig,
} from "@/lib/site-fonts";
import type { SiteLocaleConfig } from "@/lib/site-i18n";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import type { ResolvedSiteConfig } from "@/lib/site-config-types";
import type { PublicListingCard } from "@/lib/listing-types";
import { buildWhatsAppHref, parseWhatsAppNumber } from "@/lib/whatsapp";

export type SiteLink = {
  label: string;
  href: string;
};

export type BrandContent = {
  name: string;
  tagline: string;
  logoUrl: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  surfaceColor: string | null;
};

export type HeroImagePosition =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right";

export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  imagePosition: HeroImagePosition;
  primaryCta: SiteLink | null;
  secondaryCta: SiteLink | null;
  stats: { value: string; label: string }[];
};

export type AboutContent = {
  kicker: string;
  title: string;
  description: string;
  imageUrl: string | null;
  benefits: string[];
  badge: { value: string; label: string } | null;
  cta: SiteLink | null;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ProcessContent = {
  kicker: string;
  title: string;
  subtitle: string;
  steps: ProcessStep[];
};

export type ContactFormMode = "hidden" | "preview" | "enabled";
export type MotionPreset = "subtle" | "none";

export type ContactContent = {
  heading: string;
  description: string;
  imageUrl: string | null;
  whatsappNumber: string | null;
  whatsappMessage: string;
  whatsappHref: string | null;
  phone: string | null;
  phoneHref: string | null;
  email: string | null;
  emailHref: string | null;
  location: string | null;
  scheduleCallUrl: string | null;
  formMode: Exclude<ContactFormMode, "enabled">;
  formEnabled: false;
  formNote: string;
  emptyChannels: string;
  attentionNote: string | null;
};

export type LegalContent = {
  responsibleParty: string;
  privacyNoticeUrl: string;
  termsUrl: string;
  cookiesUrl: string | null;
  privacyConsentLabel: string;
  privacyConsentRequired: true;
  legalDisclaimer: string;
  privacyConfigured: boolean;
  termsConfigured: boolean;
  cookiesConfigured: boolean;
};

export type FooterContent = {
  description: string;
  copyright: string;
  showPoweredBy: boolean;
};

export type LocalizedText = {
  es?: string;
  en?: string;
};

export type PublicLocationFilter = {
  city?: string;
  zone?: string;
};

export type PublicLocation = {
  id: string;
  name: string;
  shortDescription?: LocalizedText;
  imageUrl?: string;
  imageAlt?: LocalizedText;
  filter: PublicLocationFilter;
};

export type PublicSocialLinks = {
  instagramUrl?: string;
  facebookUrl?: string;
};

export type PublicWhatsApp = {
  number: string | null;
  message: string;
  href: string | null;
};

export type PublicTestimonial = {
  id: string;
  quote: LocalizedText;
  name: string;
  role?: LocalizedText;
  preview?: boolean;
};

export type FinalCtaContent = {
  title: string;
  description: string;
};

export type SearchContent = {
  eyebrow: string;
  heading: string | null;
  description: string;
  submitLabel: string;
  submitLabelShort: string;
};

export type ContactFormCopy = {
  eyebrow: string;
  title: string;
  description: string;
  previewNote: string;
  immediatePrompt: string;
};

export type PublicSiteContent = {
  brand: BrandContent;
  typography: TypographyConfig;
  hero: HeroContent;
  about: AboutContent;
  process: ProcessContent;
  contact: ContactContent;
  search: SearchContent;
  contactForm: ContactFormCopy;
  footer: FooterContent;
  finalCta: FinalCtaContent;
  legal: LegalContent;
  motion: { preset: MotionPreset };
  locations: PublicLocation[];
  testimonials: PublicTestimonial[];
  social: PublicSocialLinks;
  whatsapp: PublicWhatsApp;
  locale: SiteLocaleConfig;
};

export const LEGAL_PRIVACY_PATH = "/aviso-de-privacidad";
export const LEGAL_TERMS_PATH = "/terminos";
export const LEGAL_COOKIES_PATH = "/cookies";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_HASH = new Set(["#catalogo", "#about", "#process", "#contact"]);

const DEFAULT_HERO_TITLE = "Encuentra tu próximo inmueble";
const DEFAULT_ABOUT_KICKER = "La inmobiliaria";
const DEFAULT_ABOUT_TITLE = "Acompañamiento cercano en cada decisión";
const DEFAULT_ABOUT_DESCRIPTION =
  "Publicamos inmuebles en renta y venta con información clara para que puedas comparar, preguntar y agendar una visita con la inmobiliaria.";
const DEFAULT_ABOUT_BENEFITS = [
  "Catálogo publicado y actualizado por la inmobiliaria",
  "Precio, ubicación y características visibles desde el anuncio",
  "Contacto directo por WhatsApp o formulario del inmueble",
];
const DEFAULT_PROCESS_KICKER = "Cómo trabajamos";
const DEFAULT_PROCESS_TITLE = "Un proceso simple, de principio a fin";
const DEFAULT_PROCESS_SUBTITLE =
  "Te ayudamos a acotar la búsqueda y a contactar a la inmobiliaria sin fricción.";
const DEFAULT_PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Cuéntanos qué buscas",
    description:
      "Filtra por renta o venta, ubicación, tipo de inmueble y recámaras.",
  },
  {
    number: "02",
    title: "Revisa el catálogo",
    description:
      "Compara fotos, precio y características de cada anuncio publicado.",
  },
  {
    number: "03",
    title: "Conversemos",
    description:
      "Escribe por WhatsApp o deja tus datos en la ficha del inmueble.",
  },
];
const DEFAULT_CONTACT_HEADING = "Hablemos de tu próximo inmueble";
const DEFAULT_CONTACT_DESCRIPTION =
  "Elige el canal que te resulte más cómodo. Atendemos consultas de renta y venta.";
const DEFAULT_WHATSAPP_MESSAGE =
  "Hola, me interesa conocer más sobre sus inmuebles.";
const DEFAULT_FOOTER_DESCRIPTION =
  "Catálogo de inmuebles. Los anuncios son publicados y atendidos directamente por la inmobiliaria.";
const DEFAULT_FINAL_CTA_TITLE = "¿Listo para ver tu próximo inmueble?";
const DEFAULT_CTA_PRIMARY: SiteLink = {
  label: "Ver propiedades",
  href: "#catalogo",
};
const DEFAULT_CTA_SECONDARY: SiteLink = {
  label: "Conócenos",
  href: "#about",
};
const DEFAULT_LEGAL_DISCLAIMER =
  "Esta página es un marcador de posición (scaffolding). Debe sustituirse por contenido aprobado por la inmobiliaria antes del release. No es un documento legal vigente y no afirma cumplimiento.";
const DEFAULT_PRIVACY_CONSENT =
  "He leído el aviso de privacidad y acepto el tratamiento de mis datos para ser contactado.";
const DEFAULT_FORM_NOTE = "Formulario disponible próximamente.";
const DEFAULT_EMPTY_CHANNELS =
  "Consulta los datos disponibles en cada propiedad o utiliza el formulario cuando esté habilitado.";
const DEFAULT_SEARCH_EYEBROW = "Encuentra tu próximo espacio";
const DEFAULT_SEARCH_DESCRIPTION =
  "Explora propiedades seleccionadas por ubicación, operación y características.";
const DEFAULT_CONTACT_FORM_TITLE = "Cuéntanos qué propiedad estás buscando";
const DEFAULT_CONTACT_FORM_DESCRIPTION =
  "Comparte tus preferencias y prepararemos una atención más precisa.";

export function parseCssHexColor(
  raw: string | undefined | null,
): string | null {
  const hex = normalizeHexColor(raw);
  if (!hex && raw?.trim()) {
    console.warn("[site-content] Invalid color; using fallback.");
  }
  return hex;
}

export function parsePublicHttpUrl(
  raw: string | undefined | null,
): string | null {
  if (raw == null) return null;
  const value = raw.trim();
  if (value === "") return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      console.warn("[site-content] Invalid URL protocol; ignoring.");
      return null;
    }
    return parsed.href;
  } catch {
    console.warn("[site-content] Invalid URL; ignoring.");
    return null;
  }
}

function parseCtaHref(raw: string | undefined | null): string | null {
  if (raw == null) return null;
  const value = raw.trim();
  if (value === "") return null;
  if (value === "/") return "/";
  if (SAFE_HASH.has(value)) return value;
  if (value.startsWith("/#") && SAFE_HASH.has(value.slice(1))) return value;
  return parsePublicHttpUrl(value);
}

function parseOptionalLink(
  labelRaw: string | undefined | null,
  hrefRaw: string | undefined | null,
  fallback: SiteLink | null,
): SiteLink | null {
  const href = parseCtaHref(hrefRaw);
  const label = labelRaw?.trim() ?? "";
  if (href && label) return { label, href };
  if (hrefRaw?.trim() || labelRaw?.trim()) {
    console.warn("[site-content] Incomplete CTA; using fallback.");
  }
  return fallback;
}

export { buildWhatsAppHref, parseWhatsAppNumber };

function parsePhone(raw: string | undefined | null): string | null {
  if (raw == null) return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const compact = trimmed.replace(/[^\d+]/g, "");
  if (compact.replace(/\D/g, "").length < 8) {
    console.warn("[site-content] Invalid phone; ignoring.");
    return null;
  }
  return compact;
}

function parseEmail(raw: string | undefined | null): string | null {
  if (raw == null) return null;
  const value = raw.trim();
  if (value === "") return null;
  if (!EMAIL.test(value)) {
    console.warn("[site-content] Invalid email; ignoring.");
    return null;
  }
  return value;
}

function envText(
  raw: string | undefined | null,
  fallback: string,
): string {
  const value = raw?.trim() ?? "";
  return value || fallback;
}

const MAX_LOCATIONS = 8;
const MAX_TESTIMONIALS = 6;
const MAX_ID_LEN = 64;
const MAX_NAME_LEN = 80;
const MAX_COPY_LEN = 280;
const MAX_QUOTE_LEN = 360;
const MAX_ROLE_LEN = 80;
const MAX_ALT_LEN = 160;
const MAX_FILTER_LEN = 80;

const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const FACEBOOK_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
]);

function parseHttpsUrl(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "") return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") {
      console.warn("[site-content] Location image must use https; ignoring.");
      return null;
    }
    return parsed.href;
  } catch {
    console.warn("[site-content] Invalid location image URL; ignoring.");
    return null;
  }
}

function boundedString(raw: unknown, max: number): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "" || value.length > max) return null;
  return value;
}

function parseLocalizedField(
  raw: unknown,
  max: number,
): LocalizedText | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "string") {
    const es = boundedString(raw, max);
    return es ? { es } : undefined;
  }
  if (typeof raw !== "object") return undefined;
  const record = raw as Record<string, unknown>;
  const es = boundedString(record.es, max);
  if (!es) return undefined;
  const en = boundedString(record.en, max) ?? undefined;
  return en ? { es, en } : { es };
}

export function pickLocalized(
  text: LocalizedText | undefined,
  locale: "es" | "en",
): string | undefined {
  if (!text) return undefined;
  if (locale === "en") {
    const en = text.en?.trim();
    if (en) return en;
  }
  const es = text.es?.trim();
  return es || undefined;
}

function parseTestimonialLocalized(
  base: unknown,
  esRaw: unknown,
  enRaw: unknown,
  max: number,
): LocalizedText | undefined {
  const fromObject =
    base && typeof base === "object" && !Array.isArray(base)
      ? (base as Record<string, unknown>)
      : null;
  const fromString = typeof base === "string" ? boundedString(base, max) : null;
  const esFromBase = fromString ?? boundedString(fromObject?.es, max) ?? undefined;
  const enFromBase = boundedString(fromObject?.en, max) ?? undefined;
  const es = boundedString(esRaw, max) ?? esFromBase;
  const en = boundedString(enRaw, max) ?? enFromBase;
  if (!es && !en) return undefined;
  return {
    ...(es ? { es } : {}),
    ...(en ? { en } : {}),
  };
}

function parseLocationFilter(raw: unknown): PublicLocationFilter | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const city = boundedString(record.city, MAX_FILTER_LEN) ?? undefined;
  const zone = boundedString(record.zone, MAX_FILTER_LEN) ?? undefined;
  if (zone && !city) {
    console.warn(
      "[site-content] Location zone filter is not supported by the catalog; omitting item.",
    );
    return null;
  }
  if (!city) {
    console.warn(
      "[site-content] Location is missing a supported city filter; omitting item.",
    );
    return null;
  }
  return zone ? { city, zone } : { city };
}

function parseLocationItem(
  raw: unknown,
  seenIds: Set<string>,
): PublicLocation | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = boundedString(record.id, MAX_ID_LEN);
  const name = boundedString(record.name, MAX_NAME_LEN);
  if (!id || !name) {
    console.warn("[site-content] Location is missing id or name; omitting item.");
    return null;
  }
  if (seenIds.has(id)) {
    console.warn("[site-content] Duplicate location id; omitting item.");
    return null;
  }
  const filter = parseLocationFilter(record.filter);
  if (!filter) return null;

  const imageUrl = parseHttpsUrl(record.imageUrl) ?? undefined;
  const imageAlt = parseLocalizedField(
    record.imageAlt ?? record.imageAltText,
    MAX_ALT_LEN,
  );
  if (imageUrl && !imageAlt) {
    console.warn(
      "[site-content] Location image is missing alt text; omitting image.",
    );
  }
  const shortDescription = parseLocalizedField(
    record.shortDescription,
    MAX_COPY_LEN,
  );

  seenIds.add(id);
  return {
    id,
    name,
    ...(shortDescription ? { shortDescription } : {}),
    ...(imageUrl && imageAlt ? { imageUrl, imageAlt } : {}),
    filter: { city: filter.city },
  };
}

export function parseSiteLocationsJson(
  raw: string | undefined | null,
): PublicLocation[] {
  if (raw == null) return [];
  const value = raw.trim();
  if (value === "") return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    console.warn("[site-content] SITE_LOCATIONS_JSON is not valid JSON; ignoring.");
    return [];
  }
  if (!Array.isArray(parsed)) {
    console.warn("[site-content] SITE_LOCATIONS_JSON must be an array; ignoring.");
    return [];
  }
  const seen = new Set<string>();
  const locations: PublicLocation[] = [];
  for (const item of parsed) {
    if (locations.length >= MAX_LOCATIONS) {
      console.warn(
        "[site-content] SITE_LOCATIONS_JSON exceeds the maximum; extra items omitted.",
      );
      break;
    }
    const location = parseLocationItem(item, seen);
    if (location) locations.push(location);
  }
  return locations;
}

function parseTestimonialItem(
  raw: unknown,
  seenIds: Set<string>,
): PublicTestimonial | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = boundedString(record.id, MAX_ID_LEN);
  const name = boundedString(record.name, MAX_NAME_LEN);
  const quote = parseTestimonialLocalized(
    record.quote,
    record.quoteEs,
    record.quoteEn,
    MAX_QUOTE_LEN,
  );
  if (!id || !name || !quote) {
    console.warn(
      "[site-content] Testimonial is missing id, name, or quote; omitting item.",
    );
    return null;
  }
  if (seenIds.has(id)) {
    console.warn("[site-content] Duplicate testimonial id; omitting item.");
    return null;
  }
  seenIds.add(id);
  const role = parseTestimonialLocalized(
    record.role,
    record.roleEs,
    record.roleEn,
    MAX_ROLE_LEN,
  );
  return {
    id,
    quote,
    name,
    ...(role ? { role } : {}),
    ...(record.preview === true ? { preview: true } : {}),
  };
}

export function parseSiteTestimonialsJson(
  raw: string | undefined | null,
): PublicTestimonial[] {
  if (raw == null) return [];
  const value = raw.trim();
  if (value === "") return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    console.warn(
      "[site-content] SITE_TESTIMONIALS_JSON is not valid JSON; ignoring.",
    );
    return [];
  }
  if (!Array.isArray(parsed)) {
    console.warn(
      "[site-content] SITE_TESTIMONIALS_JSON must be an array; ignoring.",
    );
    return [];
  }
  const seen = new Set<string>();
  const testimonials: PublicTestimonial[] = [];
  for (const item of parsed) {
    if (testimonials.length >= MAX_TESTIMONIALS) {
      console.warn(
        "[site-content] SITE_TESTIMONIALS_JSON exceeds the maximum; extra items omitted.",
      );
      break;
    }
    const testimonial = parseTestimonialItem(item, seen);
    if (testimonial) testimonials.push(testimonial);
  }
  return testimonials;
}

export function locationsFromListings(
  listings: PublicListingCard[],
): PublicLocation[] {
  const seen = new Set<string>();
  const locations: PublicLocation[] = [];
  for (const listing of listings) {
    const city = listing.city?.trim();
    if (!city) continue;
    const id = city.toLowerCase().replace(/\s+/g, "-").slice(0, MAX_ID_LEN);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    locations.push({
      id: id.slice(0, MAX_ID_LEN),
      name: city.slice(0, MAX_NAME_LEN),
      filter: { city: city.slice(0, MAX_FILTER_LEN) },
    });
    if (locations.length >= MAX_LOCATIONS) break;
  }
  return locations;
}

function parseAllowedHttpsUrl(
  raw: string | undefined | null,
  hosts: Set<string>,
): string | undefined {
  if (raw == null) return undefined;
  const value = raw.trim();
  if (value === "") return undefined;
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    if (parsed.protocol !== "https:" || !hosts.has(host)) {
      console.warn("[site-content] Social URL host is not allowed; ignoring.");
      return undefined;
    }
    return parsed.href;
  } catch {
    console.warn("[site-content] Invalid social URL; ignoring.");
    return undefined;
  }
}

function parsePublicSocialLinks(): PublicSocialLinks {
  const instagramUrl = parseAllowedHttpsUrl(
    process.env.SITE_INSTAGRAM_URL,
    INSTAGRAM_HOSTS,
  );
  const facebookUrl = parseAllowedHttpsUrl(
    process.env.SITE_FACEBOOK_URL,
    FACEBOOK_HOSTS,
  );
  return {
    ...(instagramUrl ? { instagramUrl } : {}),
    ...(facebookUrl ? { facebookUrl } : {}),
  };
}

function resolveFormMode(
  raw: string | undefined,
): Exclude<ContactFormMode, "enabled"> {
  const value = raw?.trim().toLowerCase() ?? "";
  if (value === "" || value === "hidden") return "hidden";
  if (value === "preview") return "preview";
  if (value === "enabled") {
    console.warn(
      "[site-content] SITE_CONTACT_FORM_MODE is not available until the contact endpoint exists; using hidden.",
    );
    return "hidden";
  }
  console.warn("[site-content] Unknown SITE_CONTACT_FORM_MODE; using hidden.");
  return "hidden";
}

const HERO_POSITIONS = new Set<HeroImagePosition>([
  "center",
  "top",
  "bottom",
  "left",
  "right",
]);

function resolveHeroImagePosition(
  raw: string | undefined,
): HeroImagePosition {
  const value = raw?.trim().toLowerCase() ?? "";
  if (value === "") return "center";
  if (HERO_POSITIONS.has(value as HeroImagePosition)) {
    return value as HeroImagePosition;
  }
  console.warn(
    "[site-content] Unknown SITE_HERO_IMAGE_POSITION; using center.",
  );
  return "center";
}

function resolveMotionPreset(raw: string | undefined): MotionPreset {
  const value = raw?.trim().toLowerCase() ?? "";
  if (value === "" || value === "subtle") return "subtle";
  if (value === "none") return "none";
  console.warn("[site-content] Unknown SITE_MOTION_PRESET; using subtle.");
  return "subtle";
}

export function buildPublicSiteContent(config: ResolvedSiteConfig): PublicSiteContent {
  const name = config.siteName;
  const tagline = config.siteTagline;
  const typography = resolveSiteTypography();
  const whatsappNumber = parseWhatsAppNumber(process.env.SITE_WHATSAPP_NUMBER);
  const whatsappMessage = envText(
    process.env.SITE_WHATSAPP_MESSAGE,
    DEFAULT_WHATSAPP_MESSAGE,
  );
  const phone = parsePhone(process.env.SITE_CONTACT_PHONE);
  const email = parseEmail(process.env.SITE_CONTACT_EMAIL);
  const privacyExternal = parsePublicHttpUrl(process.env.SITE_PRIVACY_URL);
  const termsExternal = parsePublicHttpUrl(process.env.SITE_TERMS_URL);
  const cookiesExternal = parsePublicHttpUrl(process.env.SITE_COOKIES_URL);
  const showCookies =
    Boolean(cookiesExternal) ||
    process.env.SITE_SHOW_COOKIES_POLICY === "true";

  return {
    brand: {
      name,
      tagline,
      logoUrl: config.siteLogoUrl,
      secondaryColor: parseCssHexColor(process.env.SITE_SECONDARY_COLOR),
      accentColor: parseCssHexColor(process.env.SITE_ACCENT_COLOR),
      surfaceColor: parseCssHexColor(process.env.SITE_SURFACE_COLOR),
    },
    typography,
    hero: {
      eyebrow: envText(process.env.SITE_HERO_EYEBROW, name),
      title: envText(process.env.SITE_HERO_TITLE, DEFAULT_HERO_TITLE),
      subtitle: envText(process.env.SITE_HERO_SUBTITLE, tagline),
      imageUrl: parsePublicHttpUrl(process.env.NEXT_PUBLIC_SITE_HERO_IMAGE_URL),
      imagePosition: resolveHeroImagePosition(
        process.env.SITE_HERO_IMAGE_POSITION,
      ),
      primaryCta: parseOptionalLink(
        process.env.SITE_HERO_PRIMARY_CTA_LABEL,
        process.env.SITE_HERO_PRIMARY_CTA_HREF,
        DEFAULT_CTA_PRIMARY,
      ),
      secondaryCta: parseOptionalLink(
        process.env.SITE_HERO_SECONDARY_CTA_LABEL,
        process.env.SITE_HERO_SECONDARY_CTA_HREF,
        DEFAULT_CTA_SECONDARY,
      ),
      stats: [],
    },
    about: {
      kicker: envText(process.env.SITE_ABOUT_KICKER, DEFAULT_ABOUT_KICKER),
      title: envText(process.env.SITE_ABOUT_TITLE, DEFAULT_ABOUT_TITLE),
      description: envText(
        process.env.SITE_ABOUT_DESCRIPTION,
        DEFAULT_ABOUT_DESCRIPTION,
      ),
      imageUrl: parsePublicHttpUrl(
        process.env.NEXT_PUBLIC_SITE_ABOUT_IMAGE_URL ??
          process.env.SITE_ABOUT_IMAGE_URL,
      ),
      benefits: DEFAULT_ABOUT_BENEFITS,
      badge: { value: name, label: "Inmobiliaria" },
      cta: { label: "Ver propiedades", href: "#catalogo" },
    },
    process: {
      kicker: envText(process.env.SITE_PROCESS_KICKER, DEFAULT_PROCESS_KICKER),
      title: envText(process.env.SITE_PROCESS_TITLE, DEFAULT_PROCESS_TITLE),
      subtitle: envText(
        process.env.SITE_PROCESS_SUBTITLE,
        DEFAULT_PROCESS_SUBTITLE,
      ),
      steps: DEFAULT_PROCESS_STEPS,
    },
    contact: {
      heading: envText(
        process.env.SITE_CONTACT_HEADING,
        DEFAULT_CONTACT_HEADING,
      ),
      description: envText(
        process.env.SITE_CONTACT_DESCRIPTION,
        DEFAULT_CONTACT_DESCRIPTION,
      ),
      imageUrl: parsePublicHttpUrl(
        process.env.NEXT_PUBLIC_SITE_CONTACT_IMAGE_URL,
      ),
      whatsappNumber,
      whatsappMessage,
      whatsappHref: whatsappNumber
        ? buildWhatsAppHref(whatsappNumber, whatsappMessage)
        : null,
      phone,
      phoneHref: phone ? `tel:${phone}` : null,
      email,
      emailHref: email ? `mailto:${email}` : null,
      location: process.env.SITE_CONTACT_LOCATION?.trim() || null,
      scheduleCallUrl: parsePublicHttpUrl(process.env.SITE_SCHEDULE_CALL_URL),
      formMode: resolveFormMode(process.env.SITE_CONTACT_FORM_MODE),
      formEnabled: false,
      formNote: DEFAULT_FORM_NOTE,
      emptyChannels: DEFAULT_EMPTY_CHANNELS,
      attentionNote: process.env.SITE_CONTACT_ATTENTION_NOTE?.trim() || null,
    },
    search: {
      eyebrow: envText(process.env.SITE_SEARCH_EYEBROW, DEFAULT_SEARCH_EYEBROW),
      heading: null,
      description: envText(
        process.env.SITE_SEARCH_DESCRIPTION,
        DEFAULT_SEARCH_DESCRIPTION,
      ),
      submitLabel: "Buscar propiedades",
      submitLabelShort: "Buscar",
    },
    contactForm: {
      eyebrow: "Consulta personalizada",
      title: DEFAULT_CONTACT_FORM_TITLE,
      description: DEFAULT_CONTACT_FORM_DESCRIPTION,
      previewNote: DEFAULT_FORM_NOTE,
      immediatePrompt: "O escríbenos ahora",
    },
    footer: {
      description: envText(
        process.env.SITE_FOOTER_DESCRIPTION,
        DEFAULT_FOOTER_DESCRIPTION,
      ),
      copyright: `© ${new Date().getFullYear()} ${name}`,
      showPoweredBy: config.showPoweredBy,
    },
    finalCta: {
      title: envText(process.env.SITE_FINAL_CTA_TITLE, DEFAULT_FINAL_CTA_TITLE),
      description: `Consultas de renta y venta con ${name}. Elige el canal que prefieras.`,
    },
    legal: {
      responsibleParty: name,
      privacyNoticeUrl: privacyExternal ?? LEGAL_PRIVACY_PATH,
      termsUrl: termsExternal ?? LEGAL_TERMS_PATH,
      cookiesUrl: cookiesExternal ?? (showCookies ? LEGAL_COOKIES_PATH : null),
      privacyConsentLabel: DEFAULT_PRIVACY_CONSENT,
      privacyConsentRequired: true,
      legalDisclaimer: DEFAULT_LEGAL_DISCLAIMER,
      privacyConfigured: Boolean(privacyExternal),
      termsConfigured: Boolean(termsExternal),
      cookiesConfigured: Boolean(cookiesExternal),
    },
    motion: { preset: resolveMotionPreset(process.env.SITE_MOTION_PRESET) },
    locations: parseSiteLocationsJson(process.env.SITE_LOCATIONS_JSON),
    testimonials: parseSiteTestimonialsJson(process.env.SITE_TESTIMONIALS_JSON),
    social: parsePublicSocialLinks(),
    whatsapp: {
      number: whatsappNumber,
      message: whatsappMessage,
      href: whatsappNumber
        ? buildWhatsAppHref(whatsappNumber, whatsappMessage)
        : null,
    },
    locale: config.locale,
  };
}

/**
 * Public marketing/content contract for themed surfaces.
 * Brand, locale and footer flags come from SiteConfig (Ops).
 * Extended luxury sections still use env until exposed in Ops.
 */
export const getPublicSiteContent = cache(
  async (): Promise<PublicSiteContent> => {
    const config = await getResolvedSiteConfig();
    return buildPublicSiteContent(config);
  },
);

export type LuxuryThemeCssVars = {
  "--luxury-font-heading": string;
  "--luxury-font-body": string;
  "--luxury-accent": string;
  "--luxury-accent-foreground": string;
  "--luxury-accent-hover": string;
  "--luxury-gold-soft": string;
  "--luxury-champagne": string;
  "--luxury-champagne-soft": string;
  "--luxury-primary": string;
  "--luxury-primary-foreground": string;
  "--luxury-primary-hover": string;
  "--luxury-focus": string;
  "--luxury-focus-foreground": string;
  "--luxury-surface"?: string;
  "--luxury-surface-elevated"?: string;
  "--luxury-surface-muted"?: string;
  "--luxury-secondary"?: string;
};

export function luxuryThemeCssVars(
  content: PublicSiteContent,
): LuxuryThemeCssVars {
  const palette = resolveLuxuryAccentTokens(content.brand.accentColor);
  const surface = contrastSafeSurface(content.brand.surfaceColor);
  const surfaceAlt = contrastSafeSurface(content.brand.secondaryColor);

  return {
    "--luxury-font-heading": headingFontFamily(content.typography.headingFont),
    "--luxury-font-body": bodyFontFamily(content.typography.bodyFont),
    "--luxury-accent": palette.champagne,
    "--luxury-accent-foreground": palette.accentForeground,
    "--luxury-accent-hover": palette.primaryHover,
    "--luxury-gold-soft": palette.champagneSoft,
    "--luxury-champagne": palette.champagne,
    "--luxury-champagne-soft": palette.champagneSoft,
    "--luxury-primary": palette.primary,
    "--luxury-primary-foreground": palette.primaryForeground,
    "--luxury-primary-hover": palette.primaryHover,
    "--luxury-focus": palette.focus,
    "--luxury-focus-foreground": palette.focusForeground,
    ...(surface
      ? {
          "--luxury-surface": surface,
          "--luxury-surface-elevated": surface,
        }
      : {}),
    ...(surfaceAlt
      ? {
          "--luxury-surface-muted": surfaceAlt,
          "--luxury-secondary": surfaceAlt,
        }
      : {}),
  };
}
