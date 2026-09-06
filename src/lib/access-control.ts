export const ADMIN_HOME_PATH = "/listings";

const PORTAL_ROLES = new Set(["tenant_portal", "property_owner_portal"]);

export function isTenantPortalRole(role: string | undefined): boolean {
  return role === "tenant_portal";
}

export function isPropertyOwnerPortalRole(role: string | undefined): boolean {
  return role === "property_owner_portal";
}

export function isExternalPortalRole(role: string | undefined): boolean {
  return role != null && PORTAL_ROLES.has(role);
}

export function homePathForRole(): string {
  return ADMIN_HOME_PATH;
}

const PUBLIC_LEGAL_PATHS = new Set([
  "/terminos",
  "/cookies",
  "/aviso-de-privacidad",
]);

/** Public catalog pages (no auth). */
export function isPublicCatalogPath(pathname: string): boolean {
  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") return true;
  if (pathname === "/" || pathname.startsWith("/inmueble/")) return true;
  if (pathname === "/inmueble") return true;
  return PUBLIC_LEGAL_PATHS.has(pathname);
}
