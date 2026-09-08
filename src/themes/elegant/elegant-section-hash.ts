const SECTION_IDS: Record<string, string> = {
  catalogo: "propiedades",
  about: "sobre-nosotros",
  nosotros: "sobre-nosotros",
  process: "como-trabajamos",
  proceso: "como-trabajamos",
  contact: "contacto",
  destinos: "destinos",
};

/** Maps Beige/legacy hashes onto Elegant catalog section ids. */
export function remapElegantSectionHash(hash: string): string {
  const key = hash.replace(/^#/, "").trim();
  if (!key) return "";
  return Object.hasOwn(SECTION_IDS, key) ? SECTION_IDS[key] : key;
}

export function elegantLocationHash(hash: string): string {
  const mapped = remapElegantSectionHash(hash);
  return mapped ? `#${mapped}` : "";
}
