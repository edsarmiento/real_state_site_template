export const SITE_LOCALES = ["es", "en"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export type SiteLocaleConfig = {
  defaultLocale: SiteLocale;
  supportedLocales: SiteLocale[];
  showLocaleSwitcher: boolean;
};

export type SiteDictionary = {
  localeName: string;
  localeSwitcher: {
    label: string;
    es: string;
    en: string;
    esName: string;
    enName: string;
  };
  a11y: {
    opensInNewTab: string;
    openMenu: string;
    closeMenu: string;
    primaryNav: string;
    footerNav: string;
    legalNav: string;
    socialNav: string;
    followUs: string;
  };
  nav: {
    properties: string;
    about: string;
    process: string;
    contact: string;
    inventory: string;
    residential: string;
    locations: string;
    commercial: string;
    faq: string;
    listProperty: string;
  };
  hero: {
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    badge: string;
    titleBefore: string;
    titleAccent: string;
    titleAfter: string;
  };
  search: {
    eyebrow: string;
    description: string;
    intentLegend: string;
    operation: string;
    buy: string;
    rent: string;
    all: string;
    location: string;
    locationPlaceholder: string;
    propertyType: string;
    bedrooms: string;
    any: string;
    allTypes: string;
    submit: string;
    submitShort: string;
    bedroomsPlus: string;
  };
  propertyTypes: {
    house: string;
    apartment: string;
    warehouse: string;
    land: string;
    office: string;
    retail: string;
    other: string;
  };
  results: {
    kicker: string;
    one: string;
    many: string;
    forSale: string;
    forRent: string;
    available: string;
    inPlace: string;
    emptyTitle: string;
    emptyCopy: string;
    emptySale: string;
    emptyRent: string;
    bedroomsFilter: string;
    clearFilters: string;
    viewAll: string;
    catalogError: string;
    listingError: string;
  };
  listing: {
    sale: string;
    rent: string;
    perMonth: string;
    viewProperty: string;
    viewPropertyAria: string;
    viewDetail: string;
    consultWhatsApp: string;
    back: string;
    description: string;
    location: string;
    viewMap: string;
    listedBy: string;
    share: string;
    shareTitle: string;
    shareCopy: string;
    shareCopied: string;
    shareFailed: string;
    shareClose: string;
    specs: {
      bedrooms: string;
      bathrooms: string;
      land: string;
      built: string;
    };
    specBedroomsShort: string;
    inquireSale: string;
    inquireRent: string;
    inquireSaleCopy: string;
    inquireRentCopy: string;
    orLeaveDetails: string;
    mobileCtaWithPhone: string;
    mobileCta: string;
    noPhoto: string;
    metaFallback: string;
    gallery: {
      empty: string;
      carouselRole: string;
      photosOf: string;
      photoAlt: string;
      prev: string;
      next: string;
      indicators: string;
      goTo: string;
      view: string;
    };
  };
  inquiry: {
    name: string;
    phone: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    phoneError: string;
    requestFailed: string;
    placeholderSale: string;
    placeholderRent: string;
    whatsappSale: string;
    whatsappRent: string;
    whatsappMessage: string;
  };
  about: {
    kicker: string;
    title: string;
    description: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    badge: string;
    cta: string;
  };
  process: {
    kicker: string;
    title: string;
    subtitle: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
  };
  contact: {
    kicker: string;
    heading: string;
    description: string;
    writeUs: string;
    callUs: string;
    email: string;
    schedule: string;
    scheduleValue: string;
    location: string;
    emptyChannels: string;
    viewProperties: string;
    formEyebrow: string;
    formTitle: string;
    formDescription: string;
    formUnavailable: string;
    previewBadge: string;
    previewAria: string;
    name: string;
    namePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailOptional: string;
    emailPlaceholder: string;
    operation: string;
    buy: string;
    rent: string;
    locationInterest: string;
    locationPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    privacyConsent: string;
    privacyLink: string;
    submit: string;
    previewNote: string;
    immediatePrompt: string;
    comingSoon: string;
    finalCtaAria: string;
    scheduleCall: string;
  };
  locations: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    fallbackAlt: string;
    representativeAlt: string;
  };
  testimonials: {
    eyebrow: string;
    title: string;
    previewNote: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
  };
  commercial: {
    kicker: string;
    title: string;
    description: string;
    cta: string;
  };
  whatsapp: {
    label: string;
    float: string;
    footer: string;
  };
  social: {
    instagram: string;
    facebook: string;
  };
  footer: {
    navigation: string;
    contact: string;
    follow: string;
    legal: string;
    description: string;
    copyright: string;
    poweredBy: string;
    privacy: string;
    terms: string;
    cookies: string;
  };
  legal: {
    kicker: string;
    privacyTitle: string;
    termsTitle: string;
    cookiesTitle: string;
    disclaimer: string;
    body: string;
  };
  finalCta: {
    title: string;
    description: string;
  };
  admin: {
    signIn: string;
    manage: string;
    catalogPrompt: string;
    catalogPromptAction: string;
  };
  seo: {
    catalogAll: string;
    catalogSale: string;
    catalogRent: string;
  };
};

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "es" || value === "en";
}

export function parseShowLocaleSwitcher(raw: unknown): boolean {
  if (raw === true || raw === "true" || raw === "1") return true;
  return false;
}

export function parseSiteLocaleConfig(
  defaultRaw: string | undefined,
  supportedRaw: string | undefined,
  showSwitcherRaw?: unknown,
): SiteLocaleConfig {
  const showLocaleSwitcher = parseShowLocaleSwitcher(showSwitcherRaw);
  const parsed = (supportedRaw ?? "es,en")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(isSiteLocale);
  const unique: SiteLocale[] = [];
  for (const locale of parsed) {
    if (!unique.includes(locale)) unique.push(locale);
  }
  const supportedLocales: SiteLocale[] =
    unique.length > 0 ? unique : ["es"];

  const normalizedDefault = defaultRaw?.trim().toLowerCase() ?? "";
  if (normalizedDefault === "") {
    return {
      defaultLocale: supportedLocales.includes("es") ? "es" : supportedLocales[0],
      supportedLocales,
      showLocaleSwitcher,
    };
  }
  if (
    isSiteLocale(normalizedDefault) &&
    supportedLocales.includes(normalizedDefault)
  ) {
    return { defaultLocale: normalizedDefault, supportedLocales, showLocaleSwitcher };
  }
  console.warn("[site-content] Unknown SITE_DEFAULT_LOCALE; using es.");
  return {
    defaultLocale: supportedLocales.includes("es") ? "es" : supportedLocales[0],
    supportedLocales,
    showLocaleSwitcher,
  };
}

export function resolveRequestLocale(
  raw: string | string[] | undefined | null,
  config: SiteLocaleConfig,
): SiteLocale {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const normalized = value?.trim().toLowerCase() ?? "";
  if (normalized === "") return config.defaultLocale;
  if (isSiteLocale(normalized) && config.supportedLocales.includes(normalized)) {
    return normalized;
  }
  return config.defaultLocale;
}

type QueryValue = string | undefined | null;

export type QueryInput =
  | URLSearchParams
  | { forEach: (cb: (value: string, key: string) => void) => void }
  | Record<string, QueryValue>
  | string
  | null
  | undefined;

function appendQuery(target: URLSearchParams, input: QueryInput): void {
  if (input == null || input === "") return;
  if (typeof input === "string") {
    new URLSearchParams(input).forEach((value, key) => {
      if (key !== "lang") target.set(key, value);
    });
    return;
  }
  if (typeof (input as URLSearchParams).forEach === "function") {
    (input as URLSearchParams).forEach((value, key) => {
      if (key !== "lang" && value !== "") target.set(key, value);
    });
    return;
  }
  for (const [key, value] of Object.entries(input as Record<string, QueryValue>)) {
    if (key === "lang" || value == null || value === "") continue;
    target.set(key, value);
  }
}

function applyLocaleParam(
  qs: URLSearchParams,
  locale: SiteLocale,
  defaultLocale: SiteLocale,
): void {
  if (locale === defaultLocale) qs.delete("lang");
  else qs.set("lang", locale);
}

export function localizedHref(
  path: string,
  locale: SiteLocale,
  searchParams?: QueryInput,
  defaultLocale: SiteLocale = "es",
): string {
  const hashIndex = path.indexOf("#");
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const queryIndex = withoutHash.indexOf("?");
  const pathname = (queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash) || "/";
  const fromPath = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const qs = new URLSearchParams(fromPath);
  appendQuery(qs, searchParams);
  applyLocaleParam(qs, locale, defaultLocale);
  const query = qs.toString();
  return `${pathname}${query ? `?${query}` : ""}${hash}`;
}

export function localizeSiteHref(
  href: string,
  locale: SiteLocale,
  defaultLocale: SiteLocale = "es",
  searchParams?: QueryInput,
): string {
  const value = href.trim();
  if (value === "") return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("#")) return value;
  return localizedHref(value, locale, searchParams, defaultLocale);
}

export function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] == null ? "" : String(vars[key]),
  );
}

export function getDictionary(locale: SiteLocale): SiteDictionary {
  return dictionaries[locale];
}

const dictionaries = {
  es: {
    localeName: "Español",
    localeSwitcher: {
      label: "Idioma",
      es: "ES",
      en: "EN",
      esName: "Español",
      enName: "Inglés",
    },
    a11y: {
      opensInNewTab: "Se abre en una pestaña nueva",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      primaryNav: "Principal",
      footerNav: "Pie de página",
      legalNav: "Legal",
      socialNav: "Redes sociales",
      followUs: "Síguenos",
    },
    nav: {
      properties: "Propiedades",
      about: "Sobre nosotros",
      process: "Cómo trabajamos",
      contact: "Contacto",
      inventory: "Inventario",
      residential: "Residencial",
      locations: "Ubicaciones",
      commercial: "Comercial",
      faq: "FAQ",
      listProperty: "Anunciar propiedad",
    },
    hero: {
      title: "Encuentra tu próximo inmueble",
      subtitle: "Catálogo de inmuebles en renta y venta.",
      primaryCta: "Ver propiedades",
      secondaryCta: "Conócenos",
      badge: "Bienes raíces de alta gama",
      titleBefore: "Encuentra tu",
      titleAccent: "próximo espacio",
      titleAfter: "exclusivo",
    },
    search: {
      eyebrow: "Encuentra tu próximo espacio",
      description:
        "Explora propiedades seleccionadas por ubicación, operación y características.",
      intentLegend: "Operación",
      operation: "Operación",
      buy: "Comprar",
      rent: "Rentar",
      all: "Todas",
      location: "Ubicación",
      locationPlaceholder: "Ciudad",
      propertyType: "Tipo de inmueble",
      bedrooms: "Recámaras",
      any: "Cualquiera",
      allTypes: "Todos",
      submit: "Buscar propiedades",
      submitShort: "Buscar",
      bedroomsPlus: "{count}+",
    },
    propertyTypes: {
      house: "Casa",
      apartment: "Apartamento",
      warehouse: "Bodega",
      land: "Terreno",
      office: "Oficina",
      retail: "Local comercial",
      other: "Otro",
    },
    results: {
      kicker: "Propiedades",
      one: "1 inmueble",
      many: "{count} inmuebles",
      forSale: "en venta",
      forRent: "en renta",
      available: "disponibles",
      inPlace: "en {city}",
      emptyTitle: "No encontramos inmuebles",
      emptyCopy: "No hay anuncios publicados",
      emptySale: "en venta",
      emptyRent: "en renta",
      bedroomsFilter: "{count}+ recámaras",
      clearFilters: "Limpiar filtros",
      viewAll: "Ver todos",
      catalogError:
        "No se pudo cargar el catálogo ({status}). Inténtalo de nuevo más tarde.",
      listingError: "No se pudo cargar el anuncio ({status}).",
    },
    listing: {
      sale: "Venta",
      rent: "Renta",
      perMonth: "/ mes",
      viewProperty: "Ver propiedad",
      viewPropertyAria: "Ver propiedad: {title}",
      viewDetail: "Ver detalle",
      consultWhatsApp: "Consultar por WhatsApp",
      back: "Volver a propiedades",
      description: "Descripción",
      location: "Ubicación",
      viewMap: "Ver en el mapa",
      listedBy: "Anunciado por",
      share: "Compartir",
      shareTitle: "Compartir propiedad",
      shareCopy: "Copiar enlace",
      shareCopied: "Enlace copiado",
      shareFailed: "No se pudo compartir. Copia el enlace manualmente.",
      shareClose: "Cerrar",
      specs: {
        bedrooms: "Recámaras",
        bathrooms: "Baños",
        land: "Terreno",
        built: "Construcción",
      },
      specBedroomsShort: "{count} rec.",
      inquireSale: "Me interesa comprar",
      inquireRent: "Me interesa rentar",
      inquireSaleCopy: "Pregunta precio, escrituración o visita.",
      inquireRentCopy: "Tu mensaje llega directo a la inmobiliaria.",
      orLeaveDetails: "O déjanos tus datos y te contactamos",
      mobileCtaWithPhone: "WhatsApp / contacto",
      mobileCta: "Pedir información",
      noPhoto: "Sin foto",
      metaFallback: "Inmueble",
      gallery: {
        empty: "Sin fotos",
        carouselRole: "carrusel",
        photosOf: "Fotos de {title}",
        photoAlt: "{title} — foto {index} de {count}",
        prev: "Foto anterior",
        next: "Foto siguiente",
        indicators: "Indicadores de foto",
        goTo: "Ir a foto {index}",
        view: "Ver foto {index}",
      },
    },
    inquiry: {
      name: "Nombre",
      phone: "Teléfono",
      message: "Mensaje",
      send: "Enviar mensaje",
      sending: "Enviando…",
      success:
        "Tu mensaje fue enviado. La inmobiliaria se pondrá en contacto contigo.",
      phoneError: "El teléfono debe tener exactamente 10 dígitos.",
      requestFailed: "No se pudo completar la solicitud.",
      placeholderSale: "Me interesa este inmueble en venta…",
      placeholderRent: "Me interesa rentar este inmueble…",
      whatsappSale: "WhatsApp: me interesa comprar",
      whatsappRent: "WhatsApp: me interesa rentar",
      whatsappMessage:
        "Hola, me interesaría saber más información respecto a la publicación «{title}».\n\n{url}",
    },
    about: {
      kicker: "La inmobiliaria",
      title: "Acompañamiento cercano en cada decisión",
      description:
        "Publicamos inmuebles en renta y venta con información clara para que puedas comparar, preguntar y agendar una visita con la inmobiliaria.",
      benefit1: "Catálogo publicado y actualizado por la inmobiliaria",
      benefit2: "Precio, ubicación y características visibles desde el anuncio",
      benefit3: "Contacto directo por WhatsApp o formulario del inmueble",
      badge: "Inmobiliaria",
      cta: "Ver propiedades",
    },
    process: {
      kicker: "Cómo trabajamos",
      title: "Un proceso simple, de principio a fin",
      subtitle:
        "Te ayudamos a acotar la búsqueda y a contactar a la inmobiliaria sin fricción.",
      step1Title: "Cuéntanos qué buscas",
      step1Description:
        "Filtra por renta o venta, ubicación, tipo de inmueble y recámaras.",
      step2Title: "Revisa el catálogo",
      step2Description:
        "Compara fotos, precio y características de cada anuncio publicado.",
      step3Title: "Conversemos",
      step3Description:
        "Escribe por WhatsApp o deja tus datos en la ficha del inmueble.",
    },
    contact: {
      kicker: "Contacto",
      heading: "Hablemos de tu próximo inmueble",
      description:
        "Elige el canal que te resulte más cómodo. Atendemos consultas de renta y venta.",
      writeUs: "Escríbenos",
      callUs: "Llámanos",
      email: "Correo",
      schedule: "Agenda una llamada",
      scheduleValue: "Reservar horario",
      location: "Ubicación",
      emptyChannels:
        "Consulta los datos disponibles en cada propiedad o utiliza el formulario cuando esté habilitado.",
      viewProperties: "Ver propiedades",
      formEyebrow: "Consulta personalizada",
      formTitle: "Cuéntanos qué propiedad estás buscando",
      formDescription:
        "Comparte tus preferencias y prepararemos una atención más precisa.",
      formUnavailable:
        "El formulario general estará disponible más adelante. Mientras tanto, consulta los canales de esta página o cada propiedad.",
      previewBadge: "Próximamente",
      previewAria: "Formulario de contacto en preparación",
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      phone: "Teléfono / WhatsApp",
      phonePlaceholder: "10 dígitos",
      emailLabel: "Correo",
      emailOptional: "opcional",
      emailPlaceholder: "correo@ejemplo.com",
      operation: "Operación",
      buy: "Compra",
      rent: "Renta",
      locationInterest: "Ubicación de interés",
      locationPlaceholder: "Ciudad",
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos qué buscas",
      privacyConsent:
        "He leído el aviso de privacidad y acepto el tratamiento de mis datos para ser contactado.",
      privacyLink: "Aviso de privacidad",
      submit: "Enviar consulta",
      previewNote: "Formulario disponible próximamente.",
      immediatePrompt: "O escríbenos ahora",
      comingSoon: "Formulario disponible próximamente.",
      finalCtaAria: "Siguiente paso",
      scheduleCall: "Agendar llamada",
    },
    locations: {
      eyebrow: "Destinos",
      title: "Explora por ubicación",
      description:
        "Empieza por la ciudad. Las zonas y colonias se podrán filtrar cuando el catálogo las confirme.",
      cta: "Explorar propiedades",
      fallbackAlt: "Composición editorial de {name}",
      representativeAlt: "Propiedad representativa en {name}",
    },
    testimonials: {
      eyebrow: "Opiniones",
      title: "Opiniones",
      previewNote:
        "Vista previa. Estos textos son provisionales y no son reseñas verificadas.",
    },
    faq: {
      eyebrow: "Resolvemos tus dudas",
      title: "Preguntas frecuentes",
      q1: "¿Qué servicios ofrecen?",
      a1: "Publicamos inmuebles en renta y venta. Puedes filtrar el catálogo, ver cada ficha y contactar a la inmobiliaria por WhatsApp o formulario.",
      q2: "¿Cómo agendo una visita?",
      a2: "Usa el botón de WhatsApp o deja tus datos en la ficha del inmueble. La inmobiliaria te contacta para coordinar.",
      q3: "¿En qué zonas hay propiedades?",
      a3: "El catálogo muestra las ciudades de los anuncios publicados. Filtra por ubicación en el buscador para ver lo disponible.",
    },
    commercial: {
      kicker: "Inversión comercial",
      title: "Espacios comerciales publicados",
      description:
        "Locales, oficinas y naves que la inmobiliaria tiene en el catálogo. Si no hay resultados, consulta por WhatsApp.",
      cta: "Consultar disponibilidad",
    },
    whatsapp: {
      label: "WhatsApp",
      float: "Escríbenos por WhatsApp",
      footer: "WhatsApp",
    },
    social: {
      instagram: "Instagram",
      facebook: "Facebook",
    },
    footer: {
      navigation: "Navegación",
      contact: "Contacto",
      follow: "Síguenos",
      legal: "Legal",
      description:
        "Catálogo de inmuebles. Los anuncios son publicados y atendidos directamente por la inmobiliaria.",
      copyright: "© {year} {name}",
      poweredBy: "Tecnología",
      privacy: "Aviso de privacidad",
      terms: "Términos de uso",
      cookies: "Política de cookies",
    },
    legal: {
      kicker: "Documento pendiente",
      privacyTitle: "Aviso de privacidad",
      termsTitle: "Términos de uso",
      cookiesTitle: "Política de cookies",
      disclaimer:
        "Esta página es un marcador de posición (scaffolding). Debe sustituirse por contenido aprobado por la inmobiliaria antes del release. No es un documento legal vigente y no afirma cumplimiento.",
      body: "El footer puede enlazar esta ruta. Sustituye el placeholder por el texto o la URL que apruebe la inmobiliaria antes de publicar el sitio.",
    },
    finalCta: {
      title: "¿Listo para ver tu próximo inmueble?",
      description: "Consultas de renta y venta con {name}. Elige el canal que prefieras.",
    },
    admin: {
      signIn: "Acceder",
      manage: "Administrar",
      catalogPrompt: "¿Administras anuncios?",
      catalogPromptAction: "Accede al panel.",
    },
    seo: {
      catalogAll: "Buscar inmuebles",
      catalogSale: "Inmuebles en venta",
      catalogRent: "Inmuebles en renta",
    },
  },
  en: {
    localeName: "English",
    localeSwitcher: {
      label: "Language",
      es: "ES",
      en: "EN",
      esName: "Spanish",
      enName: "English",
    },
    a11y: {
      opensInNewTab: "Opens in a new tab",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      primaryNav: "Primary",
      footerNav: "Footer",
      legalNav: "Legal",
      socialNav: "Social media",
      followUs: "Follow us",
    },
    nav: {
      properties: "Properties",
      about: "About us",
      process: "How it works",
      contact: "Contact",
      inventory: "Inventory",
      residential: "Residential",
      locations: "Locations",
      commercial: "Commercial",
      faq: "FAQ",
      listProperty: "List a property",
    },
    hero: {
      title: "Find your next home",
      subtitle: "A catalog of rental and sale listings.",
      primaryCta: "View properties",
      secondaryCta: "About us",
      badge: "High-end real estate",
      titleBefore: "Find your",
      titleAccent: "next space",
      titleAfter: "exclusive",
    },
    search: {
      eyebrow: "Find your next space",
      description: "Browse selected properties by city, offer type, and features.",
      intentLegend: "Offer type",
      operation: "Offer type",
      buy: "Buy",
      rent: "Rent",
      all: "All",
      location: "Location",
      locationPlaceholder: "City",
      propertyType: "Property type",
      bedrooms: "Bedrooms",
      any: "Any",
      allTypes: "All",
      submit: "Search properties",
      submitShort: "Search",
      bedroomsPlus: "{count}+",
    },
    propertyTypes: {
      house: "House",
      apartment: "Apartment",
      warehouse: "Warehouse",
      land: "Land",
      office: "Office",
      retail: "Retail",
      other: "Other",
    },
    results: {
      kicker: "Properties",
      one: "1 property",
      many: "{count} properties",
      forSale: "for sale",
      forRent: "for rent",
      available: "available",
      inPlace: "in {city}",
      emptyTitle: "No properties found",
      emptyCopy: "There are no published listings",
      emptySale: "for sale",
      emptyRent: "for rent",
      bedroomsFilter: "{count}+ bedrooms",
      clearFilters: "Clear filters",
      viewAll: "View all",
      catalogError: "The catalog could not be loaded ({status}). Please try again later.",
      listingError: "The listing could not be loaded ({status}).",
    },
    listing: {
      sale: "Sale",
      rent: "Rent",
      perMonth: "/ month",
      viewProperty: "View property",
      viewPropertyAria: "View property: {title}",
      viewDetail: "View details",
      consultWhatsApp: "Ask on WhatsApp",
      back: "Back to properties",
      description: "Description",
      location: "Location",
      viewMap: "Open in maps",
      listedBy: "Listed by",
      share: "Share",
      shareTitle: "Share property",
      shareCopy: "Copy link",
      shareCopied: "Link copied",
      shareFailed: "Couldn’t share. Copy the link manually.",
      shareClose: "Close",
      specs: {
        bedrooms: "Bedrooms",
        bathrooms: "Bathrooms",
        land: "Lot",
        built: "Built",
      },
      specBedroomsShort: "{count} bd",
      inquireSale: "I’m interested in buying",
      inquireRent: "I’m interested in renting",
      inquireSaleCopy: "Ask about price, closing, or a visit.",
      inquireRentCopy: "Your message goes directly to the agency.",
      orLeaveDetails: "Or leave your details and we’ll contact you",
      mobileCtaWithPhone: "WhatsApp / contact",
      mobileCta: "Request information",
      noPhoto: "No photo",
      metaFallback: "Property",
      gallery: {
        empty: "No photos",
        carouselRole: "carousel",
        photosOf: "Photos of {title}",
        photoAlt: "{title} — photo {index} of {count}",
        prev: "Previous photo",
        next: "Next photo",
        indicators: "Photo indicators",
        goTo: "Go to photo {index}",
        view: "View photo {index}",
      },
    },
    inquiry: {
      name: "Name",
      phone: "Phone",
      message: "Message",
      send: "Send message",
      sending: "Sending…",
      success: "Your message was sent. The agency will contact you.",
      phoneError: "The phone number must have exactly 10 digits.",
      requestFailed: "The request could not be completed.",
      placeholderSale: "I’m interested in this property for sale…",
      placeholderRent: "I’m interested in renting this property…",
      whatsappSale: "WhatsApp: I’m interested in buying",
      whatsappRent: "WhatsApp: I’m interested in renting",
      whatsappMessage:
        "Hello, I would like more information about the listing “{title}”.\n\n{url}",
    },
    about: {
      kicker: "The agency",
      title: "Close guidance for every decision",
      description:
        "We publish rental and sale listings with clear information so you can compare, ask questions, and schedule a visit with the agency.",
      benefit1: "Catalog published and kept current by the agency",
      benefit2: "Price, location, and features visible from the listing",
      benefit3: "Direct contact by WhatsApp or the listing form",
      badge: "Agency",
      cta: "View properties",
    },
    process: {
      kicker: "How it works",
      title: "A simple process, start to finish",
      subtitle:
        "We help you narrow the search and reach the agency without friction.",
      step1Title: "Tell us what you need",
      step1Description:
        "Filter by rent or sale, city, property type, and bedrooms.",
      step2Title: "Review the catalog",
      step2Description: "Compare photos, price, and features of each published listing.",
      step3Title: "Let’s talk",
      step3Description:
        "Write on WhatsApp or leave your details on the listing page.",
    },
    contact: {
      kicker: "Contact",
      heading: "Let’s talk about your next property",
      description:
        "Choose the channel that works best for you. We handle rental and sale inquiries.",
      writeUs: "Message us",
      callUs: "Call us",
      email: "Email",
      schedule: "Schedule a call",
      scheduleValue: "Book a time",
      location: "Location",
      emptyChannels:
        "Use the details on each listing, or the form when it becomes available.",
      viewProperties: "View properties",
      formEyebrow: "Personalized inquiry",
      formTitle: "Tell us what you are looking for",
      formDescription: "Share your preferences and we will prepare a more precise response.",
      formUnavailable:
        "The general form will be available later. In the meantime, use the channels on this page or each listing.",
      previewBadge: "Coming soon",
      previewAria: "Contact form in preparation",
      name: "Name",
      namePlaceholder: "Your name",
      phone: "Phone / WhatsApp",
      phonePlaceholder: "10 digits",
      emailLabel: "Email",
      emailOptional: "optional",
      emailPlaceholder: "email@example.com",
      operation: "Offer type",
      buy: "Buy",
      rent: "Rent",
      locationInterest: "Preferred location",
      locationPlaceholder: "City",
      message: "Message",
      messagePlaceholder: "Tell us what you are looking for",
      privacyConsent:
        "I have read the privacy notice and agree to the processing of my data in order to be contacted.",
      privacyLink: "Privacy notice",
      submit: "Send inquiry",
      previewNote: "Form coming soon.",
      immediatePrompt: "Or message us now",
      comingSoon: "Form coming soon.",
      finalCtaAria: "Next step",
      scheduleCall: "Schedule a call",
    },
    locations: {
      eyebrow: "Destinations",
      title: "Explore by location",
      description:
        "Start with the city. Neighborhood and zone filters can be added once the catalog confirms them.",
      cta: "Explore properties",
      fallbackAlt: "Editorial composition for {name}",
      representativeAlt: "Representative listing in {name}",
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "Comments",
      previewNote:
        "Preview. These quotes are provisional and are not verified reviews.",
    },
    faq: {
      eyebrow: "Answers",
      title: "Frequently asked questions",
      q1: "What services do you offer?",
      a1: "We publish rental and sale listings. You can filter the catalog, open a listing, and contact the agency by WhatsApp or the listing form.",
      q2: "How do I schedule a visit?",
      a2: "Use the WhatsApp button or leave your details on the listing page. The agency will follow up to coordinate.",
      q3: "Which areas do you cover?",
      a3: "The catalog shows cities from published listings. Use the location filter to see what is available.",
    },
    commercial: {
      kicker: "Commercial",
      title: "Published commercial spaces",
      description:
        "Retail, offices, and warehouses currently in the catalog. If nothing matches, inquire on WhatsApp.",
      cta: "Ask about availability",
    },
    whatsapp: {
      label: "WhatsApp",
      float: "Message us on WhatsApp",
      footer: "WhatsApp",
    },
    social: {
      instagram: "Instagram",
      facebook: "Facebook",
    },
    footer: {
      navigation: "Navigation",
      contact: "Contact",
      follow: "Follow us",
      legal: "Legal",
      description:
        "Property catalog. Listings are published and handled directly by the agency.",
      copyright: "© {year} {name}",
      poweredBy: "Technology by",
      privacy: "Privacy notice",
      terms: "Terms of use",
      cookies: "Cookie policy",
    },
    legal: {
      kicker: "Pending document",
      privacyTitle: "Privacy notice",
      termsTitle: "Terms of use",
      cookiesTitle: "Cookie policy",
      disclaimer:
        "This page is a placeholder (scaffolding). It must be replaced with copy approved by the agency before release. It is not a current legal document and does not claim compliance.",
      body: "The footer may link here. Replace this placeholder with copy or a URL approved by the agency before publishing the site.",
    },
    finalCta: {
      title: "Ready to see your next property?",
      description: "Rental and sale inquiries with {name}. Choose the channel you prefer.",
    },
    admin: {
      signIn: "Sign in",
      manage: "Manage",
      catalogPrompt: "Managing listings?",
      catalogPromptAction: "Open the admin panel.",
    },
    seo: {
      catalogAll: "Search properties",
      catalogSale: "Properties for sale",
      catalogRent: "Properties for rent",
    },
  },
} satisfies Record<SiteLocale, SiteDictionary>;
