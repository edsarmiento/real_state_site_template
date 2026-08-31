"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SiteBranding } from "@/lib/site-config-types";

type NavItem = {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
};

const NAV: NavItem[] = [
  {
    href: "/listings",
    label: "Anuncios",
    match: (p) =>
      p === "/listings" ||
      (p.startsWith("/listings/") &&
        !p.startsWith("/listings/inquiries") &&
        !p.startsWith("/listings/setup")),
  },
  {
    href: "/properties",
    label: "Propiedades",
    match: (p) => p === "/properties" || p.startsWith("/properties/"),
  },
  {
    href: "/listings/inquiries",
    label: "Leads",
    match: (p) => p.startsWith("/listings/inquiries"),
  },
  {
    href: "/account",
    label: "Mi cuenta",
    match: (p) => p === "/account" || p.startsWith("/account/"),
  },
];

function navClass(active: boolean): string {
  return active
    ? "rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white"
    : "rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900";
}

export function AdminShell({
  children,
  siteName,
  siteLogoUrl,
}: {
  children: React.ReactNode;
} & Pick<SiteBranding, "siteName" | "siteLogoUrl">) {
  const pathname = usePathname();
  const router = useRouter();
  const logo = siteLogoUrl;
  const name = siteName;

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/listings" className="flex min-w-0 items-center gap-3">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                className="h-9 w-auto max-w-[140px] object-contain"
              />
            ) : (
              <span className="text-base font-semibold text-zinc-950">
                {name}
              </span>
            )}
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(item.match(pathname))}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              target="_blank"
            >
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
