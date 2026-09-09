import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import {
  buttonClass,
  Card,
  DetailRow,
  ErrorBanner,
  PageContainer,
  WarningBanner,
} from "@/components/ui";
import {
  measurementLabel,
  propertyStatusLabel,
  propertyTypeLabel,
} from "@/lib/property-labels";
import { unitStatusLabel } from "@/lib/unit-labels";
import type { Property } from "@/lib/property-types";
import type { Unit } from "@/lib/unit-types";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

const tabBase = "border-b-2 px-1 pb-3 text-sm font-medium transition -mb-px";
const tabActive = "border-zinc-900 text-zinc-900";
const tabIdle = "border-transparent text-zinc-500 hover:text-zinc-800";

export default async function PropertyDetailPage({
  params,
  searchParams,
}: PageProps) {
  await requireStaffAccess();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const sp = await searchParams;
  const tab = sp.tab === "units" ? "units" : "data";

  const [propertyResult, unitsResult] = await Promise.all([
    apiFetch<Property>(`/api/v1/properties/${id}`),
    apiFetch<Unit[]>(`/api/v1/properties/${id}/units`),
  ]);

  if (!propertyResult.ok) {
    if (propertyResult.status === 404) notFound();
    return (
      <PageContainer size="sm">
        <ErrorBanner>
          Error al cargar la propiedad ({propertyResult.status}).
        </ErrorBanner>
        <Link href="/properties" className="mt-4 inline-block text-sm underline">
          Volver
        </Link>
      </PageContainer>
    );
  }

  const p = propertyResult.data;
  const units =
    unitsResult.ok && Array.isArray(unitsResult.data) ? unitsResult.data : [];

  return (
    <PageContainer>
      <Link href="/properties" className="text-sm font-medium text-zinc-600 underline">
        ← Propiedades
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">{p.name}</h1>
          <p className="mt-1 text-sm text-zinc-600">{p.city}</p>
        </div>
        <Link
          href={`/properties/${p.id}/edit`}
          className={buttonClass({ variant: "secondary", size: "sm" })}
        >
          Editar
        </Link>
      </div>

      <nav
        aria-label="Secciones de la propiedad"
        className="mt-8 flex gap-6 border-b border-zinc-200"
      >
        <Link
          href={`/properties/${p.id}`}
          className={`${tabBase} ${tab === "data" ? tabActive : tabIdle}`}
        >
          Datos
        </Link>
        <Link
          href={`/properties/${p.id}?tab=units`}
          className={`${tabBase} ${tab === "units" ? tabActive : tabIdle}`}
        >
          Espacios
        </Link>
      </nav>

      {tab === "data" ? (
        <Card className="mt-6 p-4">
          <dl>
            <DetailRow
              label="Descripción"
              value={
                p.description ? (
                  <span className="whitespace-pre-wrap">{p.description}</span>
                ) : null
              }
            />
            <DetailRow label="Tipo" value={propertyTypeLabel[p.property_type]} />
            <DetailRow label="Estado" value={propertyStatusLabel[p.status]} />
            <DetailRow label="Dirección" value={p.street_address} />
            <DetailRow label="Colonia" value={p.address_line_2} />
            <DetailRow label="Entidad federativa" value={p.state_or_region} />
            <DetailRow label="Código postal" value={p.postal_code} />
            <DetailRow
              label="Sistema de medidas"
              value={measurementLabel[p.measurement_system]}
            />
            <DetailRow label="Latitud" value={p.latitude} />
            <DetailRow label="Longitud" value={p.longitude} />
            <DetailRow label="Superficie construida" value={p.built_area} />
            <DetailRow label="Terreno" value={p.land_area} />
            <DetailRow label="Recámaras" value={p.bedrooms} />
            <DetailRow label="Baños" value={p.bathrooms} />
            <DetailRow label="Estacionamientos" value={p.parking_spaces} />
            <DetailRow label="Plantas" value={p.floors} />
            <DetailRow label="Año" value={p.year_built} />
          </dl>
        </Card>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-600">
              Espacios disponibles para anunciar.
            </p>
            <Link
              href={`/properties/${p.id}/units/new`}
              className={buttonClass({ size: "sm", className: "shrink-0" })}
            >
              Nuevo espacio
            </Link>
          </div>

          {unitsResult && !unitsResult.ok ? (
            <div className="mt-6">
              <WarningBanner>
                No se pudieron cargar los espacios ({unitsResult.status}).
              </WarningBanner>
            </div>
          ) : units.length === 0 ? (
            <p className="mt-10 text-center text-sm text-zinc-600">
              Esta propiedad aún no tiene espacios.
            </p>
          ) : (
            <Card className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-200 text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Espacio</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">Rec.</th>
                    <th className="px-4 py-3 font-medium">Baños</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {units.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 font-medium text-zinc-900">{u.name}</td>
                      <td className="px-4 py-3 text-zinc-700">
                        {unitStatusLabel[u.status]}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{u.bedrooms ?? "—"}</td>
                      <td className="px-4 py-3 text-zinc-700">{u.bathrooms ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/properties/${p.id}/units/${u.id}/edit`}
                          className="font-medium text-zinc-800 underline"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
}
