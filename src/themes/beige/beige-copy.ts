import type { PublicSiteContent } from "@/lib/public-site-content";
import type { SiteLocale } from "@/lib/site-i18n";

const SHARED_DEFAULT_HERO_TITLE = "Encuentra tu próximo inmueble";
const SHARED_DEFAULT_PROCESS_TITLE = "Un proceso simple, de principio a fin";
const SHARED_DEFAULT_PROCESS_SUBTITLE =
  "Te ayudamos a acotar la búsqueda y a contactar a la inmobiliaria sin fricción.";
const SHARED_DEFAULT_CONTACT_HEADING = "Hablemos de tu próximo inmueble";
const SHARED_DEFAULT_CONTACT_DESCRIPTION =
  "Elige el canal que te resulte más cómodo. Atendemos consultas de renta y venta.";
const SHARED_DEFAULT_ABOUT_KICKER = "La inmobiliaria";
const SHARED_DEFAULT_ABOUT_TITLE = "Acompañamiento cercano en cada decisión";
const SHARED_DEFAULT_ABOUT_DESCRIPTION =
  "Publicamos inmuebles en renta y venta con información clara para que puedas comparar, preguntar y agendar una visita con la inmobiliaria.";
const SHARED_DEFAULT_ABOUT_BENEFITS = [
  "Catálogo publicado y actualizado por la inmobiliaria",
  "Precio, ubicación y características visibles desde el anuncio",
  "Contacto directo por WhatsApp o formulario del inmueble",
] as const;
const SHARED_DEFAULT_ABOUT_CTA = "Ver propiedades";

export type BeigeCopy = {
  contactCta: string;
  officeLabel: string;
  whatsappPrefix: string;
  openWhatsApp: string;
  callNow: string;
  contactKicker: string;
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogDescription: string;
  locationsEyebrow: string;
  locationsTitle: string;
  locationsDescription: string;
  locationsCta: string;
  processTitle: string;
  processSubtitle: string;
  aboutKicker: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutBenefits: [string, string, string];
  aboutCta: string;
  contactTitle: string;
  contactSubtitle: string;
  contactSubmit: string;
  generalInquiryPrefix: string;
  contactNeedsListing: string;
};

const ES: BeigeCopy = {
  contactCta: "Contáctanos",
  officeLabel: "Oficina",
  whatsappPrefix: "WhatsApp",
  openWhatsApp: "Abrir WhatsApp directo",
  callNow: "Llamar ahora",
  contactKicker: "Inicia hoy mismo",
  heroEyebrow: "Propiedades para cada etapa",
  heroTitle: "Encuentra el espacio que estás buscando",
  heroTitleAccent: "el espacio",
  heroSubtitle:
    "Explora propiedades disponibles para comprar o rentar y encuentra una opción que se adapte a tus necesidades.",
  catalogEyebrow: "Propiedades disponibles",
  catalogTitle: "Encuentra tu próxima propiedad",
  catalogDescription:
    "Consulta opciones disponibles y filtra por operación, ubicación, tipo de inmueble y número de recámaras.",
  locationsEyebrow: "Destinos",
  locationsTitle: "Explora propiedades por ubicación",
  locationsDescription:
    "Descubre las ciudades donde tenemos propiedades disponibles y encuentra opciones que se adapten a tu estilo de vida.",
  locationsCta: "Ver propiedades",
  processTitle: "Te acompañamos en cada paso",
  processSubtitle:
    "Desde la búsqueda hasta el cierre, recibe orientación durante todo el proceso inmobiliario.",
  aboutKicker: "Nuestra mirada",
  aboutTitle: "Encontrar el espacio correcto pide criterio",
  aboutDescription:
    "Combinamos un catálogo claro con atención cercana. Comparas opciones reales de compra o renta, con los datos a la vista y un equipo listo para resolver dudas y coordinar visitas.",
  aboutBenefits: [
    "Propiedades presentadas con claridad, no con promesas vacías",
    "Precio, ubicación y características visibles desde el primer vistazo",
    "Te acompañamos de la consulta a la visita, por WhatsApp o formulario",
  ],
  aboutCta: "Explorar propiedades",
  contactTitle: "¡Contáctanos hoy mismo!",
  contactSubtitle:
    "Estamos aquí para ayudarte a encontrar la propiedad ideal con atención personalizada y profesional.",
  contactSubmit: "Enviar solicitud",
  generalInquiryPrefix: "Consulta general del sitio",
  contactNeedsListing:
    "No hay anuncios publicados para enviar el formulario. Escríbenos por WhatsApp o llama a la oficina.",
};

const EN: BeigeCopy = {
  contactCta: "Contact us",
  officeLabel: "Office",
  whatsappPrefix: "WhatsApp",
  openWhatsApp: "Open WhatsApp directly",
  callNow: "Call now",
  contactKicker: "Start today",
  heroEyebrow: "Homes for every stage",
  heroTitle: "Find the space you are looking for",
  heroTitleAccent: "the space",
  heroSubtitle:
    "Browse homes for sale or rent and find an option that fits what you need.",
  catalogEyebrow: "Available properties",
  catalogTitle: "Find your next property",
  catalogDescription:
    "Browse published listings and filter by sale or rent, city, property type, and bedrooms.",
  locationsEyebrow: "Destinations",
  locationsTitle: "Explore properties by location",
  locationsDescription:
    "See the cities where listings are available and find options that fit how you live.",
  locationsCta: "View properties",
  processTitle: "We walk with you at every step",
  processSubtitle:
    "From search through closing, get guidance throughout the real-estate process.",
  aboutKicker: "Our approach",
  aboutTitle: "Finding the right space takes judgment",
  aboutDescription:
    "We combine a clear catalog with close attention. Compare real options to buy or rent, with the facts in view and a team ready to answer questions and arrange visits.",
  aboutBenefits: [
    "Listings presented with clarity, not empty promises",
    "Price, location, and features visible from the first look",
    "We stay with you from the first question to the visit, on WhatsApp or the form",
  ],
  aboutCta: "Explore properties",
  contactTitle: "Get in touch today",
  contactSubtitle:
    "We are here to help you find the right property with personal, professional attention.",
  contactSubmit: "Send request",
  generalInquiryPrefix: "General site inquiry",
  contactNeedsListing:
    "There are no published listings to send this form. Message us on WhatsApp or call the office.",
};

function customOrDefault(
  value: string | null | undefined,
  sharedDefault: string,
  beigeDefault: string,
): string {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || trimmed === sharedDefault) return beigeDefault;
  return trimmed;
}

export function getBeigeCopy(locale: SiteLocale): BeigeCopy {
  return locale === "en" ? EN : ES;
}

export function resolveBeigeHeroCopy(
  content: PublicSiteContent,
  locale: SiteLocale,
): Pick<BeigeCopy, "heroEyebrow" | "heroTitle" | "heroTitleAccent" | "heroSubtitle"> {
  const copy = getBeigeCopy(locale);
  const eyebrow = content.hero.eyebrow.trim();
  const brandName = content.brand.name.trim();
  return {
    heroEyebrow:
      !eyebrow || eyebrow === brandName ? copy.heroEyebrow : eyebrow,
    heroTitle: customOrDefault(
      content.hero.title,
      SHARED_DEFAULT_HERO_TITLE,
      copy.heroTitle,
    ),
    heroTitleAccent: copy.heroTitleAccent,
    heroSubtitle: content.hero.subtitle.trim() || copy.heroSubtitle,
  };
}

export function resolveBeigeProcessCopy(
  content: PublicSiteContent,
  locale: SiteLocale,
): { title: string; subtitle: string } {
  const copy = getBeigeCopy(locale);
  return {
    title: customOrDefault(
      content.process.title,
      SHARED_DEFAULT_PROCESS_TITLE,
      copy.processTitle,
    ),
    subtitle: customOrDefault(
      content.process.subtitle,
      SHARED_DEFAULT_PROCESS_SUBTITLE,
      copy.processSubtitle,
    ),
  };
}

export function resolveBeigeAboutCopy(
  content: PublicSiteContent,
  locale: SiteLocale,
): {
  kicker: string;
  title: string;
  description: string;
  benefits: string[];
  cta: string;
} {
  const copy = getBeigeCopy(locale);
  const about = content.about;
  const usesDefaultBenefits =
    about.benefits.length === SHARED_DEFAULT_ABOUT_BENEFITS.length &&
    about.benefits.every(
      (item, index) => item === SHARED_DEFAULT_ABOUT_BENEFITS[index],
    );
  return {
    kicker: customOrDefault(
      about.kicker,
      SHARED_DEFAULT_ABOUT_KICKER,
      copy.aboutKicker,
    ),
    title: customOrDefault(
      about.title,
      SHARED_DEFAULT_ABOUT_TITLE,
      copy.aboutTitle,
    ),
    description: customOrDefault(
      about.description,
      SHARED_DEFAULT_ABOUT_DESCRIPTION,
      copy.aboutDescription,
    ),
    benefits: usesDefaultBenefits ? [...copy.aboutBenefits] : about.benefits,
    cta: customOrDefault(about.cta?.label, SHARED_DEFAULT_ABOUT_CTA, copy.aboutCta),
  };
}

export function resolveBeigeContactCopy(
  content: PublicSiteContent,
  locale: SiteLocale,
): { title: string; subtitle: string } {
  const copy = getBeigeCopy(locale);
  return {
    title: customOrDefault(
      content.contact.heading,
      SHARED_DEFAULT_CONTACT_HEADING,
      copy.contactTitle,
    ),
    subtitle: customOrDefault(
      content.contact.description,
      SHARED_DEFAULT_CONTACT_DESCRIPTION,
      copy.contactSubtitle,
    ),
  };
}
