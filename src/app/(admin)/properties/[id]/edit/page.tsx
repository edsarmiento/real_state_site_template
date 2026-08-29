import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { PropertyForm } from "@/components/property-form";
import { ErrorBanner, PageContainer } from "@/components/ui";
import { requireStaffAccess } from "@/lib/route-guards";
import type { Property } from "@/lib/property-types";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: PageProps) {
  await requireStaffAccess();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const result = await apiFetch<Property>(`/api/v1/properties/${id}`);

  if (!result.ok) {
    if (result.status === 404) notFound();
    return (
      <PageContainer size="sm">
        <ErrorBanner>
          Error al cargar la propiedad ({result.status}).
        </ErrorBanner>
        <Link href="/properties" className="mt-4 inline-block text-sm underline">
          Volver
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="lg">
      <Link
        href={`/properties/${result.data.id}`}
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Volver a la ficha
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Editar propiedad</h1>
      <PropertyForm mode="edit" property={result.data} />
    </PageContainer>
  );
}
