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
const SHARED_DEFAULT_ABOUT_BENEFITS: readonly string[] = [
  "Catálogo publicado y actualizado por la inmobiliaria",
  "Precio, ubicación y características visibles desde el anuncio",
  "Contacto directo por WhatsApp o formulario del inmueble",
];
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
  phoneLabel: string;
  emailLabel: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPageOf: string;
  paginationAria: string;
  goToPage: string;
  availableOne: string;
  availableMany: string;
  emptyFilters: string;
  clearFilters: string;
};

const ES: BeigeCopy = {
  contactCta: "Contáctanos",
  officeLabel: "Oficina",
  whatsappPrefix: "WhatsApp",
  openWhatsApp: "Contactar por WhatsApp",
  callNow: "Llamar ahora",
  contactKicker: "Hablemos",
  heroEyebrow: "Propiedades para comprar o rentar",
  heroTitle: "Encuentra el espacio para tu próxima etapa",
  heroTitleAccent: "el espacio",
  heroSubtitle:
    "Explora propiedades disponibles y filtra por ubicación, tipo de inmueble y características para encontrar opciones que se adapten a tus necesidades.",
  catalogEyebrow: "Propiedades disponibles",
  catalogTitle: "Encuentra tu próxima propiedad",
  catalogDescription:
    "Compara opciones de compra y renta con la información más importante en un solo lugar.",
  locationsEyebrow: "Ubicaciones",
  locationsTitle: "Explora propiedades por ubicación",
  locationsDescription:
    "Selecciona una ciudad para consultar las propiedades disponibles en esa ubicación.",
  locationsCta: "Ver propiedades",
  processTitle: "Te acompañamos en cada paso",
  processSubtitle:
    "Un proceso claro para conocer opciones, resolver dudas y coordinar una visita.",
  aboutKicker: "Atención inmobiliaria",
  aboutTitle: "Encuentra una propiedad que se adapte a ti",
  aboutDescription:
    "Consulta opciones para comprar o rentar, compara la información esencial y recibe atención para resolver dudas y coordinar visitas.",
  aboutBenefits: [
    "Información clara sobre precio, ubicación y características",
    "Opciones de compra y renta organizadas para comparar mejor",
    "Atención por WhatsApp o formulario para resolver tus dudas",
  ],
  aboutCta: "Explorar propiedades",
  contactTitle: "¿Encontraste una propiedad que te interesa?",
  contactSubtitle:
    "Escríbenos para recibir más información, resolver dudas o coordinar una visita.",
  contactSubmit: "Enviar solicitud",
  generalInquiryPrefix: "Consulta general del sitio",
  contactNeedsListing:
    "No hay anuncios publicados para enviar el formulario. Escríbenos por WhatsApp o llama a la oficina.",
  phoneLabel: "Teléfono",
  emailLabel: "Correo electrónico",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPageOf: "Página {current} de {total}",
  paginationAria: "Paginación de propiedades",
  goToPage: "Ir a la página {page}",
  availableOne: "1 propiedad disponible",
  availableMany: "{count} propiedades disponibles",
  emptyFilters: "No encontramos propiedades con estos filtros",
  clearFilters: "Limpiar filtros",
};

const EN: BeigeCopy = {
  contactCta: "Contact us",
  officeLabel: "Office",
  whatsappPrefix: "WhatsApp",
  openWhatsApp: "Contact us on WhatsApp",
  callNow: "Call now",
  contactKicker: "Let\u2019s talk",
  heroEyebrow: "Properties to buy or rent",
  heroTitle: "Find the space for your next chapter",
  heroTitleAccent: "the space",
  heroSubtitle:
    "Explore available properties and filter by location, property type, and features to find options that fit your needs.",
  catalogEyebrow: "Available properties",
  catalogTitle: "Find your next property",
  catalogDescription:
    "Compare properties for sale and rent with the essential information in one place.",
  locationsEyebrow: "Locations",
  locationsTitle: "Explore properties by location",
  locationsDescription:
    "Select a city to view the properties currently available there.",
  locationsCta: "View properties",
  processTitle: "We guide you through each step",
  processSubtitle:
    "A clear process to explore options, ask questions, and schedule a visit.",
  aboutKicker: "Real estate support",
  aboutTitle: "Find a property that fits your needs",
  aboutDescription:
    "Browse properties for sale or rent, compare essential details, and contact the team to ask questions or schedule a visit.",
  aboutBenefits: [
    "Clear information about price, location, and features",
    "Sale and rental options organized for easier comparison",
    "Support through WhatsApp or the contact form",
  ],
  aboutCta: "Explore properties",
  contactTitle: "Interested in a property?",
  contactSubtitle:
    "Contact us for more information, to ask questions, or to schedule a visit.",
  contactSubmit: "Send request",
  generalInquiryPrefix: "General site inquiry",
  contactNeedsListing:
    "There are no published listings to send this form. Message us on WhatsApp or call the office.",
  phoneLabel: "Phone",
  emailLabel: "Email",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPageOf: "Page {current} of {total}",
  paginationAria: "Property pagination",
  goToPage: "Go to page {page}",
  availableOne: "1 property available",
  availableMany: "{count} properties available",
  emptyFilters: "No properties match these filters",
  clearFilters: "Clear filters",
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
