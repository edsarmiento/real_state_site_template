import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublicSiteContent } from "@/lib/public-site-content";

type Kind = "privacy" | "terms" | "cookies";

const TITLES: Record<Kind, string> = {
  privacy: "Aviso de privacidad",
  terms: "Términos de uso",
  cookies: "Política de cookies",
};

export async function DefaultLegalPage({ kind }: { kind: Kind }) {
  const { legal } = await getPublicSiteContent();

  return (
    <div className="min-h-screen bg-[#f3f6fb]">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Documento pendiente
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {TITLES[kind]}
        </h1>
        <p className="mt-4 text-zinc-600">{legal.legalDisclaimer}</p>
        <p className="mt-4 text-zinc-600">
          Esta ruta es scaffolding. Debe sustituirse por contenido aprobado por
          la inmobiliaria antes del release.
        </p>
        <p className="mt-8">
          <Link href="/" className="font-semibold text-blue-700 hover:underline">
            Volver al catálogo
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
