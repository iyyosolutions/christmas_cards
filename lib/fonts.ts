import { Caveat, Cormorant_Garamond, Great_Vibes, Oswald, Outfit } from "next/font/google";

export const handFont = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const displayFont = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const cormorantFont = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const scriptFont = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});
