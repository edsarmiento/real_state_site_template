import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import {
  Card,
  PageContainer,
  WarningBanner,
} from "@/components/ui";
import type { ListingInquiry } from "@/lib/listing-types";

export default async function ListingInquiriesPage() {
  await requireStaffAccess();
  const result = await apiFetch<ListingInquiry[]>("/api/v1/listing_inquiries");
  const list =
    result.ok && Array.isArray(result.data) ? result.data : [];

  return (
    <PageContainer size="lg">
      <Link
        href="/listings"
        className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Anuncios
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Leads de anuncios
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Contactos recibidos desde el catálogo público.
      </p>

      {!result.ok ? (
        <div className="mt-8">
          <WarningBanner>
            No se pudieron cargar los leads ({result.status}).
          </WarningBanner>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-10 text-center text-zinc-600 dark:text-zinc-400">
          Aún no hay leads.
        </p>
      ) : (
        <Card className="mt-8 divide-y divide-zinc-100 dark:divide-zinc-800">
          {list.map((inq) => (
            <div key={inq.id} className="px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {inq.name}
                  {inq.phone ? ` · ${inq.phone}` : ""}
                </p>
                <time className="text-xs text-zinc-500">
                  {new Date(inq.created_at).toLocaleString("es-MX")}
                </time>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Anuncio:{" "}
                {inq.listing_offer_type ? (
                  <span className="mr-1 font-medium text-zinc-800 dark:text-zinc-200">
                    {inq.listing_offer_type === "sale" ? "Venta" : "Renta"} ·
                  </span>
                ) : null}
                {inq.listing_slug ? (
                  <Link
                    href={`/inmueble/${inq.listing_slug}`}
                    className="underline"
                    target="_blank"
                  >
                    {inq.listing_title}
                  </Link>
                ) : (
                  inq.listing_title
                )}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200">
                {inq.message}
              </p>
            </div>
          ))}
        </Card>
      )}
    </PageContainer>
  );
}
