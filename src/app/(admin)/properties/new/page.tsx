import Link from "next/link";
import { requireStaffAccess } from "@/lib/route-guards";
import { PropertySetupForm } from "@/components/property-setup-form";
import { Card, PageContainer } from "@/components/ui";

export default async function NewPropertyPage() {
  await requireStaffAccess();

  return (
    <PageContainer size="sm">
      <Link
        href="/properties"
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Propiedades
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
        Nueva propiedad
      </h1>
      <p className="mt-1 text-sm text-zinc-600">
        Registra el inmueble; en el siguiente paso agregas el espacio para
        anunciar.
      </p>
      <Card className="mt-6 p-6">
        <PropertySetupForm />
      </Card>
    </PageContainer>
  );
}
