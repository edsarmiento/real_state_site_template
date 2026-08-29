import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import { ListingForm } from "@/components/listing-form";
import { ListingPhotosForm } from "@/components/listing-photos-form";
import {
  Card,
  PageContainer,
  WarningBanner,
} from "@/components/ui";
import type { StaffListing } from "@/lib/listing-types";
import { getSessionContext } from "@/lib/session-context";

type Props = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: Props) {
  await requireStaffAccess();
  const session = await getSessionContext();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const result = await apiFetch<StaffListing>(`/api/v1/listings/${id}`);
  if (result.status === 404) notFound();

  return (
    <PageContainer size="sm">
      <Link
        href="/listings"
        className="text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        ← Anuncios
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Editar anuncio
      </h1>

      {!result.ok ? (
        <div className="mt-6">
          <WarningBanner>
            No se pudo cargar el anuncio ({result.status}).
          </WarningBanner>
        </div>
      ) : (
        <>
          <Card className="mt-6 p-6">
            <ListingForm
              listing={result.data}
              units={[]}
              emailConfirmed={session?.emailConfirmed !== false}
            />
          </Card>
          <Card className="mt-6 p-6">
            <ListingPhotosForm
              listingId={result.data.id}
              photos={result.data.photos ?? []}
            />
          </Card>
          {result.data.status === "published" ? (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Público:{" "}
              <Link
                href={`/inmueble/${result.data.slug}`}
                className="font-medium underline"
                target="_blank"
              >
                /inmueble/{result.data.slug}
              </Link>
            </p>
          ) : null}
        </>
      )}
    </PageContainer>
  );
}
