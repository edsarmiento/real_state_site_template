import Link from "next/link";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";

export async function SiteFooter() {
  const config = await getResolvedSiteConfig();
  const name = config.siteName;

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-sm text-zinc-600">
          {name} — catálogo de inmuebles. Los anuncios son publicados y
          atendidos directamente por la inmobiliaria.
        </p>
        {config.showPoweredBy ? (
          <p className="mt-4 text-xs text-zinc-500">
            Tecnología{" "}
            <Link
              href="https://evenia.mx"
              className="font-medium text-zinc-600 underline-offset-2 hover:underline"
            >
              Evenia
            </Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
