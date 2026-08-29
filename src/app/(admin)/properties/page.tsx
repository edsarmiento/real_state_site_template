import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import { fetchPropertyUnits } from "@/lib/lookups";
import {
  buttonClass,
  Card,
  PageContainer,
  WarningBanner,
} from "@/components/ui";
import { propertyTypeLabel } from "@/lib/property-labels";
import type { Property } from "@/lib/property-types";

export default async function PropertiesPage() {
  await requireStaffAccess();

  const [propertiesResult, propertyUnits] = await Promise.all([
    apiFetch<Property[]>("/api/v1/properties"),
    fetchPropertyUnits(),
  ]);

  const list =
    propertiesResult.ok && Array.isArray(propertiesResult.data)
      ? propertiesResult.data
      : [];

  const unitCountByProperty = new Map<number, number>();
  for (const { property, units } of propertyUnits) {
    unitCountByProperty.set(
      property.id,
      units.filter((u) => u.status !== "inactive").length,
    );
  }

  return (
    <PageContainer size="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Propiedades</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Inmuebles y unidades disponibles para anunciar.
          </p>
        </div>
        <Link href="/properties/new" className={buttonClass({ className: "shrink-0" })}>
          Nueva propiedad
        </Link>
      </div>

      {!propertiesResult.ok ? (
        <div className="mt-8">
          <WarningBanner>
            No se pudo cargar el listado ({propertiesResult.status}).
          </WarningBanner>
        </div>
      ) : list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-zinc-600">
          Aún no hay propiedades.{" "}
          <Link
            href="/listings/setup"
            className="font-medium text-zinc-900 underline"
          >
            Configura tu primer inmueble
          </Link>{" "}
          o{" "}
          <Link href="/properties/new" className="font-medium text-zinc-900 underline">
            crea una propiedad
          </Link>
          .
        </p>
      ) : (
        <Card className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Propiedad</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Ciudad</th>
                <th className="px-4 py-3 font-medium">Unidades</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {list.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {propertyTypeLabel[p.property_type]}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{p.city}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {unitCountByProperty.get(p.id) ?? 0}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/properties/${p.id}/units/new`}
                      className="font-medium text-zinc-800 underline"
                    >
                      Agregar unidad
                    </Link>
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
