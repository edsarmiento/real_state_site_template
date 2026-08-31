export type RgbColor = {
  r: number;
  g: number;
  b: number;
};

export type HexRgb = `#${string}`;

export type ContrastPair = {
  background: HexRgb;
  foreground: HexRgb;
  ratio: number;
};

const HEX_RGB = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const WCAG_TEXT_MIN_RATIO = 4.5;
export const WCAG_GRAPHIC_MIN_RATIO = 3;

export const LUXURY_SAFE_NAVY = "#172033";
export const LUXURY_SAFE_NAVY_DEEP = "#0f1728";
export const LUXURY_SAFE_ON_NAVY = "#ffffff";
export const LUXURY_SAFE_NAVY_HOVER = "#121a2b";
export const LUXURY_SAFE_CHAMPAGNE = "#c7b38a";
export const LUXURY_SAFE_CHAMPAGNE_SOFT = "#e6dcc7";
export const LUXURY_SAFE_IVORY = "#f8f7f3";
export const LUXURY_SAFE_STONE = "#eceae5";
export const LUXURY_SAFE_TEXT = "#171a21";
export const LUXURY_SAFE_TEXT_MUTED = "#667085";
export const LUXURY_SAFE_WHATSAPP = "#146c43";

/** @deprecated Use LUXURY_SAFE_NAVY. Kept so existing imports keep compiling. */
export const LUXURY_SAFE_ACCENT = LUXURY_SAFE_NAVY;
export const LUXURY_SAFE_ON_ACCENT = LUXURY_SAFE_ON_NAVY;
export const LUXURY_SAFE_ACCENT_HOVER = LUXURY_SAFE_NAVY_HOVER;
export const LUXURY_SAFE_GOLD_SOFT = LUXURY_SAFE_CHAMPAGNE_SOFT;
export const LUXURY_SAFE_INK = LUXURY_SAFE_TEXT;
export const LUXURY_SAFE_SURFACE = LUXURY_SAFE_IVORY;
export const LUXURY_SAFE_BACKGROUND = LUXURY_SAFE_IVORY;
export const LUXURY_SAFE_CREAM = LUXURY_SAFE_IVORY;

const LIGHT_FOREGROUND = LUXURY_SAFE_ON_NAVY;
const DARK_FOREGROUND = LUXURY_SAFE_TEXT;

export function normalizeHexColor(
  raw: string | undefined | null,
): HexRgb | null {
  if (raw == null) return null;
  const value = raw.trim();
  if (value === "") return null;
  const match = HEX_RGB.exec(value);
  if (!match) return null;
  const hex = match[1];
  if (hex.length === 3) {
    const [r, g, b] = hex.split("");
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase() as HexRgb;
  }
  return `#${hex.toLowerCase()}` as HexRgb;
}

export function hexToRgb(hex: HexRgb): RgbColor {
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function channelLuminance(value: number): number {
  const scaled = value / 255;
  return scaled <= 0.04045
    ? scaled / 12.92
    : ((scaled + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(rgb: RgbColor): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

export function contrastRatio(first: RgbColor, second: RgbColor): number {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export function contrastRatioHex(first: HexRgb, second: HexRgb): number {
  return contrastRatio(hexToRgb(first), hexToRgb(second));
}

export function pickForeground(
  background: HexRgb,
  minRatio: number = WCAG_TEXT_MIN_RATIO,
): ContrastPair | null {
  const lightRatio = contrastRatioHex(background, LIGHT_FOREGROUND);
  const darkRatio = contrastRatioHex(background, DARK_FOREGROUND);
  const lightOk = lightRatio >= minRatio;
  const darkOk = darkRatio >= minRatio;
  if (!lightOk && !darkOk) return null;
  if (lightOk && (!darkOk || lightRatio >= darkRatio)) {
    return {
      background,
      foreground: LIGHT_FOREGROUND,
      ratio: lightRatio,
    };
  }
  return {
    background,
    foreground: DARK_FOREGROUND,
    ratio: darkRatio,
  };
}

export type LuxuryAccentTokens = {
  accent: HexRgb;
  accentForeground: HexRgb;
  accentHover: HexRgb;
  goldSoft: HexRgb;
  focus: HexRgb;
  focusForeground: HexRgb;
  primary: HexRgb;
  primaryForeground: HexRgb;
  primaryHover: HexRgb;
  champagne: HexRgb;
  champagneSoft: HexRgb;
};

function navyPrimary(): Pick<
  LuxuryAccentTokens,
  "primary" | "primaryForeground" | "primaryHover" | "focus" | "focusForeground"
> {
  return {
    primary: LUXURY_SAFE_NAVY,
    primaryForeground: LUXURY_SAFE_ON_NAVY,
    primaryHover: LUXURY_SAFE_NAVY_HOVER,
    focus: LUXURY_SAFE_NAVY,
    focusForeground: LUXURY_SAFE_ON_NAVY,
  };
}

function resolveChampagne(raw: string | undefined | null): HexRgb {
  const candidate = normalizeHexColor(raw);
  if (!candidate) {
    if (raw?.trim()) {
      console.warn("[site-contrast] Invalid color; using fallback.");
    }
    return LUXURY_SAFE_CHAMPAGNE;
  }
  if (contrastRatioHex(candidate, LUXURY_SAFE_NAVY) < WCAG_GRAPHIC_MIN_RATIO) {
    console.warn(
      "[site-contrast] Accent fails graphic contrast on navy; using fallback.",
    );
    return LUXURY_SAFE_CHAMPAGNE;
  }
  return candidate;
}

export function resolveLuxuryAccentTokens(
  raw: string | undefined | null,
): LuxuryAccentTokens {
  const champagne = resolveChampagne(raw);
  const navy = navyPrimary();
  return {
    ...navy,
    accent: champagne,
    accentForeground: LUXURY_SAFE_NAVY,
    accentHover: LUXURY_SAFE_NAVY_HOVER,
    goldSoft: LUXURY_SAFE_CHAMPAGNE_SOFT,
    champagne,
    champagneSoft: LUXURY_SAFE_CHAMPAGNE_SOFT,
  };
}

export function contrastSafeSurface(
  raw: string | undefined | null,
): HexRgb | null {
  const candidate = normalizeHexColor(raw);
  if (!candidate) {
    if (raw?.trim()) {
      console.warn("[site-contrast] Invalid surface color; using fallback.");
    }
    return null;
  }
  if (contrastRatioHex(candidate, LUXURY_SAFE_INK) < WCAG_TEXT_MIN_RATIO) {
    console.warn("[site-contrast] Surface fails text contrast; using fallback.");
    return null;
  }
  return candidate;
}
