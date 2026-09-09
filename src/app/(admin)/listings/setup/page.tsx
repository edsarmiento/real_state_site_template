import Link from "next/link";
import { requireStaffAccess } from "@/lib/route-guards";
import { ListingSetupForm } from "@/components/listing-setup-form";
import { Card, PageContainer } from "@/components/ui";

export default async function ListingSetupPage() {
  await requireStaffAccess();

  return (
    <PageContainer size="sm">
      <Link
        href="/listings/new"
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Nuevo anuncio
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        Configura tu inmueble
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Crea la propiedad y su espacio en un solo paso. Después podrás publicar
        el anuncio con fotos y precio.
      </p>
      <Card className="mt-6 p-6">
        <ListingSetupForm />
      </Card>
    </PageContainer>
  );
}
