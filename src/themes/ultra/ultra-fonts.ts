import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-ultra-playfair",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-ultra-jakarta",
});

export const ULTRA_FONT_CLASS = [
  playfairDisplay.variable,
  plusJakartaSans.variable,
].join(" ");
