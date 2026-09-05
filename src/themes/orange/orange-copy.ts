import type { SiteLocale } from "@/lib/site-i18n";

export type OrangeCopy = {
  consultCta: string;
  consultCtaShort: string;
  navServices: string;
  navTestimonials: string;
  heroBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;
  exploreCta: string;
  catalogEyebrow: string;
  catalogTitle: string;
  catalogDescription: string;
  availableOne: string;
  availableMany: string;
  propertiesAvailable: string;
  metricSale: string;
  metricRent: string;
  metricDirect: string;
  principlesEyebrow: string;
  principlesTitle: string;
  principle1Title: string;
  principle1Body: string;
  principle2Title: string;
  principle2Body: string;
  principle3Title: string;
  principle3Body: string;
  formInterest: string;
  formInterestOther: string;
  formSubmit: string;
  formIntro: string;
  formOpenedWhatsApp: string;
  formOpenedEmail: string;
  formEmailSubject: string;
  navExperience: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesDescription: string;
  service1Title: string;
  service1Body: string;
  service2Title: string;
  service2Body: string;
  service3Title: string;
  service3Body: string;
  share: string;
  shareCopied: string;
  contactEyebrow: string;
  contactTitle: string;
  contactDescription: string;
  openWhatsApp: string;
  callNow: string;
  formUnavailable: string;
  paginationAria: string;
  paginationPrev: string;
  paginationNext: string;
  paginationPreviousAria: string;
  paginationNextAria: string;
  paginationPageAria: string;
  paginationPageOf: string;
};

const ES: OrangeCopy = {
  consultCta: "Agendar asesoría",
  consultCtaShort: "Asesoría",
  navServices: "Servicios",
  navTestimonials: "Testimonios",
  heroBadge: "Catálogo publicado",
  heroTitle: "Elevando el estándar de los bienes raíces.",
  heroTitleAccent: "bienes raíces",
  heroLead:
    "Explora el catálogo de inmuebles en renta y venta, con fotos, precios y características publicadas directamente por la inmobiliaria.",
  exploreCta: "Explorar propiedades",
  catalogEyebrow: "Catálogo",
  catalogTitle: "Encuentra tu próximo espacio",
  catalogDescription:
    "Filtra por operación, ubicación y tipo para ver los inmuebles publicados.",
  availableOne: "1 propiedad disponible",
  availableMany: "{count} propiedades disponibles",
  propertiesAvailable: "Propiedades publicadas",
  metricSale: "Venta",
  metricRent: "Renta",
  metricDirect: "Atención directa",
  principlesEyebrow: "Cómo trabajamos",
  principlesTitle: "Una experiencia inmobiliaria más clara",
  principle1Title: "Propiedades presentadas con claridad",
  principle1Body:
    "Cada anuncio muestra fotos, precio y características en el mismo formato para que compares sin adivinar.",
  principle2Title: "Contacto directo con la inmobiliaria",
  principle2Body:
    "Tus mensajes llegan a quien publica el inmueble, sin intermediarios adicionales.",
  principle3Title: "Información organizada para decidir",
  principle3Body:
    "Filtros por operación, ubicación y tipo para llegar a las opciones que te sirven.",
  formInterest: "Interés principal",
  formInterestOther: "Otra consulta",
  formSubmit: "Enviar",
  formIntro:
    "Completa tus datos y abriremos el mensaje en el canal de la inmobiliaria. No guardamos la información en este sitio.",
  formOpenedWhatsApp:
    "Abrimos WhatsApp con tu mensaje. Envíalo desde ahí para completar la consulta.",
  formOpenedEmail:
    "Abrimos tu cliente de correo con el mensaje. Envíalo desde ahí para completar la consulta.",
  formEmailSubject: "Consulta desde el sitio",
  navExperience: "Experiencia",
  servicesEyebrow: "Acompañamiento",
  servicesTitle: "Cómo te ayudamos",
  servicesDescription:
    "Publicamos inmuebles y canalizamos tus consultas con la inmobiliaria.",
  service1Title: "Publicación de inmuebles",
  service1Body:
    "Anuncios con fotos, precio y características visibles para comparar opciones.",
  service2Title: "Atención a interesados",
  service2Body:
    "Puedes escribir por WhatsApp o dejar tus datos en el formulario del anuncio.",
  service3Title: "Renta y venta en un catálogo",
  service3Body:
    "Un solo sitio para revisar inmuebles publicados por la inmobiliaria.",
  share: "Compartir",
  shareCopied: "Enlace copiado",
  contactEyebrow: "Contacto",
  contactTitle: "Hablemos de tu próximo inmueble",
  contactDescription:
    "Elige el canal que te resulte más cómodo. Atendemos consultas de renta y venta.",
  openWhatsApp: "Contactar por WhatsApp",
  callNow: "Llamar ahora",
  formUnavailable:
    "El formulario general no está disponible. Usa WhatsApp, teléfono o el aviso de cada inmueble.",
  paginationAria: "Paginación de propiedades",
  paginationPrev: "Anterior",
  paginationNext: "Siguiente",
  paginationPreviousAria: "Ir a la página anterior de propiedades",
  paginationNextAria: "Ir a la página siguiente de propiedades",
  paginationPageAria: "Ir a la página {page} de propiedades",
  paginationPageOf: "Página {page} de {total}",
};

const EN: OrangeCopy = {
  consultCta: "Book a consultation",
  consultCtaShort: "Consult",
  navServices: "Services",
  navTestimonials: "Testimonials",
  heroBadge: "Published listings",
  heroTitle: "Elevating the standard of real estate.",
  heroTitleAccent: "real estate",
  heroLead:
    "Browse the catalog of rental and sale listings, with photos, prices and specs published directly by the agency.",
  exploreCta: "Explore properties",
  catalogEyebrow: "Catalog",
  catalogTitle: "Find your next space",
  catalogDescription:
    "Filter by operation, location and type to see published listings.",
  availableOne: "1 property available",
  availableMany: "{count} properties available",
  propertiesAvailable: "Published properties",
  metricSale: "Sale",
  metricRent: "Rent",
  metricDirect: "Direct contact",
  principlesEyebrow: "How we work",
  principlesTitle: "A clearer real estate experience",
  principle1Title: "Properties presented clearly",
  principle1Body:
    "Every listing shows photos, price and specs in the same format so you can compare without guessing.",
  principle2Title: "Direct contact with the agency",
  principle2Body:
    "Your messages reach whoever published the listing, with no extra intermediaries.",
  principle3Title: "Information organized to decide",
  principle3Body:
    "Filters by operation, location and type to reach the options that fit you.",
  formInterest: "Main interest",
  formInterestOther: "Another question",
  formSubmit: "Send",
  formIntro:
    "Fill in your details and we will open the message in the agency channel. We do not store the information on this site.",
  formOpenedWhatsApp:
    "We opened WhatsApp with your message. Send it from there to complete the inquiry.",
  formOpenedEmail:
    "We opened your email client with the message. Send it from there to complete the inquiry.",
  formEmailSubject: "Inquiry from the website",
  navExperience: "Experience",
  servicesEyebrow: "How we help",
  servicesTitle: "How we can help you",
  servicesDescription:
    "We publish listings and route your questions to the agency.",
  service1Title: "Listing publication",
  service1Body:
    "Listings with photos, price and visible specs so you can compare options.",
  service2Title: "Inquiries",
  service2Body:
    "Message on WhatsApp or leave your details on the listing form.",
  service3Title: "Rent and sale in one catalog",
  service3Body:
    "One site to review properties published by the agency.",
  share: "Share",
  shareCopied: "Link copied",
  contactEyebrow: "Contact",
  contactTitle: "Let’s talk about your next property",
  contactDescription:
    "Choose the channel that works for you. We handle rent and sale inquiries.",
  openWhatsApp: "Contact on WhatsApp",
  callNow: "Call now",
  formUnavailable:
    "The general form is not available. Use WhatsApp, phone, or the form on each listing.",
  paginationAria: "Property pagination",
  paginationPrev: "Previous",
  paginationNext: "Next",
  paginationPreviousAria: "Go to the previous property page",
  paginationNextAria: "Go to the next property page",
  paginationPageAria: "Go to property page {page}",
  paginationPageOf: "Page {page} of {total}",
};

export function getOrangeCopy(locale: SiteLocale): OrangeCopy {
  return locale === "en" ? EN : ES;
}
