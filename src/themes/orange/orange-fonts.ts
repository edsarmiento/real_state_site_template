import {
  Cormorant_Garamond,
  Inter,
  Playfair_Display,
} from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-orange-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-orange-body",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["italic", "normal"],
  display: "swap",
  preload: false,
  variable: "--font-orange-signature",
});

export const ORANGE_FONT_CLASS = [
  playfairDisplay.variable,
  inter.variable,
  cormorantGaramond.variable,
].join(" ");
