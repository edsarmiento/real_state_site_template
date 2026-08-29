import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import { getSessionContext } from "@/lib/session-context";
import {
  buttonClass,
  Card,
  PageContainer,
  WarningBanner,
} from "@/components/ui";
import {
  formatRentCents,
  listingPriceSuffix,
  parseOfferType,
  type StaffListing,
} from "@/lib/listing-types";
import { ListingOfferBadge } from "@/components/listing-offer-badge";

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  paused: "Pausado",
};

export default async function ListingsPage() {
  await requireStaffAccess();
  await getSessionContext();

  const result = await apiFetch<StaffListing[]>("/api/v1/listings");
  const list =
    result.ok && Array.isArray(result.data) ? result.data : [];

  return (
    <PageContainer size="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Anuncios
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Publica rentas y ventas en el catálogo público.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/listings/inquiries"
            className={buttonClass({ variant: "secondary", className: "shrink-0" })}
          >
            Leads
          </Link>
          <Link
            href="/listings/new"
            className={buttonClass({ className: "shrink-0" })}
          >
            Nuevo anuncio
          </Link>
        </div>
      </div>

      {!result.ok ? (
        <div className="mt-8">
          <WarningBanner>
            No se pudo cargar el listado ({result.status}).
          </WarningBanner>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-10 text-center text-zinc-600 dark:text-zinc-400">
          Aún no hay anuncios.{" "}
          <Link
            href="/listings/new"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Crea el primero
          </Link>
          .
        </p>
      ) : (
        <Card className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-700">
              <tr>
                <th className="px-4 py-3 font-medium">Anuncio</th>
                <th className="px-4 py-3 font-medium">Oferta</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {list.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {l.title}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {l.city}
                      {l.property_name ? ` · ${l.property_name}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <ListingOfferBadge offerType={parseOfferType(l.offer_type)} />
                  </td>
                  <td className="px-4 py-3 text-zinc-800 dark:text-zinc-200">
                    {formatRentCents(l.rent_cents, l.currency)}
                    {listingPriceSuffix(parseOfferType(l.offer_type)) ? (
                      <span className="text-zinc-500"> / mes</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {statusLabel[l.status] ?? l.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/listings/${l.id}`}
                      className="font-medium text-zinc-800 underline dark:text-zinc-200"
                    >
                      Editar
                    </Link>
                    {l.status === "published" ? (
                      <>
                        {" · "}
                        <Link
                          href={`/inmueble/${l.slug}`}
                          className="text-zinc-600 underline dark:text-zinc-400"
                          target="_blank"
                        >
                          Ver público
                        </Link>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </PageContainer>
  );
}
