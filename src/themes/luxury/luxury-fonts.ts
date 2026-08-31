import {
  Cormorant_Garamond,
  DM_Serif_Display,
  Inter,
  Manrope,
  Playfair_Display,
} from "next/font/google";
import type { BodyFontName, HeadingFontName } from "@/lib/site-fonts";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-heading-playfair-display",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-heading-cormorant-garamond",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-heading-dm-serif-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-body-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  variable: "--font-body-manrope",
});

export const LUXURY_HEADING_FONT_CLASS: Record<HeadingFontName, string> = {
  "playfair-display": playfairDisplay.variable,
  "cormorant-garamond": cormorantGaramond.variable,
  "dm-serif-display": dmSerifDisplay.variable,
};

export const LUXURY_BODY_FONT_CLASS: Record<BodyFontName, string | null> = {
  inter: inter.variable,
  manrope: manrope.variable,
  "system-sans": null,
};
