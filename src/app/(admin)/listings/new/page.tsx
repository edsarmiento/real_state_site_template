import Link from "next/link";
import { requireStaffAccess } from "@/lib/route-guards";
import { ListingForm } from "@/components/listing-form";
import { fetchPropertyUnits } from "@/lib/lookups";
import { getSessionContext } from "@/lib/session-context";
import {
  Card,
  PageContainer,
  buttonClass,
} from "@/components/ui";

const unitStatusHint: Record<string, string> = {
  available: "disponible",
  occupied: "ocupado",
  inactive: "inactivo",
};

export default async function NewListingPage() {
  const unitsPromise = fetchPropertyUnits();
  await requireStaffAccess();
  const session = await getSessionContext();
  const propertyUnits = await unitsPromise;

  const units = propertyUnits.flatMap(({ property, units: propertyUnitsList }) =>
    propertyUnitsList
      .filter((unit) => unit.status !== "inactive")
      .map((unit) => ({
        id: unit.id,
        status: unit.status,
        label: `${property.name} · ${unit.name} (${property.city}) · ${unitStatusHint[unit.status] ?? unit.status}`,
      })),
  );

  return (
    <PageContainer size="sm">
      <Link
        href="/listings"
        className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Anuncios
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Nuevo anuncio
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Renta: solo espacios disponibles. Venta: también ocupados (en renta y
        en venta). Al publicar aparecen en el catálogo público.
      </p>

      {units.length === 0 ? (
        <div className="mt-8 space-y-3 text-sm text-zinc-600">
          <p>No hay espacios para anunciar. Primero registra un inmueble.</p>
          <Link
            href="/listings/setup"
            className={buttonClass({ className: "inline-flex" })}
          >
            Configurar propiedad y espacio
          </Link>
        </div>
      ) : (
        <Card className="mt-6 p-6">
          <ListingForm
            units={units}
            emailConfirmed={session?.emailConfirmed !== false}
          />
        </Card>
      )}
    </PageContainer>
  );
}
