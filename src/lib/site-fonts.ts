export type HeadingFontName =
  | "playfair-display"
  | "cormorant-garamond"
  | "dm-serif-display";

export type BodyFontName = "inter" | "manrope" | "system-sans";

export type FontCategory = "heading" | "body";

export type FontDefinition = {
  id: HeadingFontName | BodyFontName;
  category: FontCategory;
  cssVariable: string | null;
  fallbackStack: string;
  label: string;
  source: "next-font-google" | "system";
};

export type TypographyConfig = {
  headingFont: HeadingFontName;
  bodyFont: BodyFontName;
};

export const DEFAULT_HEADING_FONT: HeadingFontName = "cormorant-garamond";
export const DEFAULT_BODY_FONT: BodyFontName = "manrope";

export const HEADING_FONT_REGISTRY = {
  "playfair-display": {
    id: "playfair-display",
    category: "heading",
    cssVariable: "--font-heading-playfair-display",
    fallbackStack: '"Times New Roman", Times, serif',
    label: "Playfair Display",
    source: "next-font-google",
  },
  "cormorant-garamond": {
    id: "cormorant-garamond",
    category: "heading",
    cssVariable: "--font-heading-cormorant-garamond",
    fallbackStack: "Georgia, serif",
    label: "Cormorant Garamond",
    source: "next-font-google",
  },
  "dm-serif-display": {
    id: "dm-serif-display",
    category: "heading",
    cssVariable: "--font-heading-dm-serif-display",
    fallbackStack: "Georgia, serif",
    label: "DM Serif Display",
    source: "next-font-google",
  },
} satisfies Record<HeadingFontName, FontDefinition>;

export const BODY_FONT_REGISTRY = {
  inter: {
    id: "inter",
    category: "body",
    cssVariable: "--font-body-inter",
    fallbackStack: "system-ui, sans-serif",
    label: "Inter",
    source: "next-font-google",
  },
  manrope: {
    id: "manrope",
    category: "body",
    cssVariable: "--font-body-manrope",
    fallbackStack: "system-ui, sans-serif",
    label: "Manrope",
    source: "next-font-google",
  },
  "system-sans": {
    id: "system-sans",
    category: "body",
    cssVariable: null,
    fallbackStack:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    label: "System sans",
    source: "system",
  },
} satisfies Record<BodyFontName, FontDefinition>;

function isHeadingFontName(value: string): value is HeadingFontName {
  return Object.prototype.hasOwnProperty.call(HEADING_FONT_REGISTRY, value);
}

function isBodyFontName(value: string): value is BodyFontName {
  return Object.prototype.hasOwnProperty.call(BODY_FONT_REGISTRY, value);
}

export function resolveHeadingFontName(
  raw: string | undefined | null,
): HeadingFontName {
  if (raw == null) return DEFAULT_HEADING_FONT;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") return DEFAULT_HEADING_FONT;
  if (isHeadingFontName(normalized)) return normalized;
  console.warn("[site-fonts] Unknown SITE_HEADING_FONT; using fallback.");
  return DEFAULT_HEADING_FONT;
}

export function resolveBodyFontName(
  raw: string | undefined | null,
): BodyFontName {
  if (raw == null) return DEFAULT_BODY_FONT;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "") return DEFAULT_BODY_FONT;
  if (isBodyFontName(normalized)) return normalized;
  console.warn("[site-fonts] Unknown SITE_BODY_FONT; using fallback.");
  return DEFAULT_BODY_FONT;
}

export function resolveSiteTypography(): TypographyConfig {
  return {
    headingFont: resolveHeadingFontName(process.env.SITE_HEADING_FONT),
    bodyFont: resolveBodyFontName(process.env.SITE_BODY_FONT),
  };
}

export function headingFontFamily(name: HeadingFontName): string {
  const font = HEADING_FONT_REGISTRY[name];
  return font.cssVariable
    ? `var(${font.cssVariable}), ${font.fallbackStack}`
    : font.fallbackStack;
}

export function bodyFontFamily(name: BodyFontName): string {
  const font = BODY_FONT_REGISTRY[name];
  return font.cssVariable
    ? `var(${font.cssVariable}), ${font.fallbackStack}`
    : font.fallbackStack;
}
