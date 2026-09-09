import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import { UnitForm } from "@/components/unit-form";
import { Card, ErrorBanner, PageContainer } from "@/components/ui";
import type { Property } from "@/lib/property-types";

type PageProps = { params: Promise<{ id: string }> };

export default async function NewUnitPage({ params }: PageProps) {
  await requireStaffAccess();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const result = await apiFetch<Property>(`/api/v1/properties/${id}`);

  if (!result.ok) {
    if (result.status === 404) notFound();
    return (
      <PageContainer size="sm">
        <ErrorBanner>Error al cargar la propiedad ({result.status}).</ErrorBanner>
        <Link href="/properties" className="mt-4 inline-block text-sm underline">
          Volver a propiedades
        </Link>
      </PageContainer>
    );
  }

  const property = result.data;

  return (
    <PageContainer size="sm">
      <Link
        href="/properties"
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Propiedades
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        Nuevo espacio · {property.name}
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        El espacio disponible se podrá seleccionar al crear un anuncio.
      </p>
      <Card className="mt-6 p-6">
        <UnitForm
          mode="create"
          propertyId={property.id}
          measurementSystem={property.measurement_system}
          defaultName="Principal"
        />
      </Card>
    </PageContainer>
  );
}
