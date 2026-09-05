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

function catalogPathname(pathname: string): string {
  const withoutQuery = pathname.split("?")[0] ?? pathname;
  const withoutHash = withoutQuery.split("#")[0] ?? withoutQuery;
  if (withoutHash.length > 1 && withoutHash.endsWith("/")) {
    return withoutHash.slice(0, -1);
  }
  return withoutHash;
}

/** Public catalog and legal pages (no auth). */
export function isPublicCatalogPath(pathname: string): boolean {
  const path = catalogPathname(pathname);
  if (path === "/robots.txt" || path === "/sitemap.xml") return true;
  if (path === "/" || path.startsWith("/inmueble/")) return true;
  if (path === "/inmueble") return true;
  return PUBLIC_LEGAL_PATHS.has(path);
}
