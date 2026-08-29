import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { UnitForm } from "@/components/unit-form";
import { ErrorBanner, PageContainer } from "@/components/ui";
import { requireStaffAccess } from "@/lib/route-guards";
import type { Property } from "@/lib/property-types";
import type { Unit } from "@/lib/unit-types";

type PageProps = { params: Promise<{ id: string; unitId: string }> };

export default async function EditUnitPage({ params }: PageProps) {
  await requireStaffAccess();
  const { id, unitId } = await params;
  if (!/^\d+$/.test(id) || !/^\d+$/.test(unitId)) notFound();

  const [propertyResult, unitResult] = await Promise.all([
    apiFetch<Property>(`/api/v1/properties/${id}`),
    apiFetch<Unit>(`/api/v1/properties/${id}/units/${unitId}`),
  ]);

  if (!unitResult.ok) {
    if (unitResult.status === 404) notFound();
    return (
      <PageContainer size="sm">
        <ErrorBanner>
          Error al cargar la unidad ({unitResult.status}).
        </ErrorBanner>
        <Link
          href={`/properties/${id}?tab=units`}
          className="mt-4 inline-block text-sm underline"
        >
          Volver
        </Link>
      </PageContainer>
    );
  }

  if (!propertyResult.ok) {
    if (propertyResult.status === 404) notFound();
    return (
      <PageContainer size="sm">
        <ErrorBanner>
          Error al cargar la propiedad ({propertyResult.status}).
        </ErrorBanner>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="lg">
      <Link
        href={`/properties/${propertyResult.data.id}?tab=units`}
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Volver a unidades
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Editar unidad</h1>
      <UnitForm
        mode="edit"
        propertyId={propertyResult.data.id}
        measurementSystem={propertyResult.data.measurement_system}
        unit={unitResult.data}
      />
    </PageContainer>
  );
}
