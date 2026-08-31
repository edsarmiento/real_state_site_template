import type { Metadata } from "next";

/** Shared robots for internal legal scaffolding pages. */
export const LEGAL_PLACEHOLDER_ROBOTS = {
  index: false,
  follow: false,
} as const;

export function legalPlaceholderMetadata(title: string): Metadata {
  return {
    title,
    robots: LEGAL_PLACEHOLDER_ROBOTS,
  };
}
