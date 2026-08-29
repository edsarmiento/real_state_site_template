import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";
import { requireStaffAccess } from "@/lib/route-guards";
import { getSessionContext } from "@/lib/session-context";
import type { CurrentUser } from "@/lib/user-types";
import {
  Card,
  PageContainer,
  ErrorBanner,
  WarningBanner,
} from "@/components/ui";
import { AccountEmailForm } from "@/components/account-email-form";
import { WorkspaceLogoForm } from "@/components/workspace-logo-form";
import { WorkspaceSettingsForm } from "@/components/workspace-settings-form";

function parseMe(json: unknown): CurrentUser | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const inner =
    o.user && typeof o.user === "object" && o.user !== null
      ? (o.user as Record<string, unknown>)
      : o;
  if (
    typeof inner.id === "number" &&
    typeof inner.email === "string" &&
    typeof inner.created_at === "string"
  ) {
    return {
      id: inner.id,
      email: inner.email,
      created_at: inner.created_at,
    };
  }
  return null;
}

const WRITE_ROLES = new Set(["owner", "admin", "manager", "accountant"]);

type WorkspaceAccount = {
  id: number;
  name: string;
  currency: string;
  timezone: string;
  logo_url: string | null;
};

export default async function AccountPage() {
  await requireStaffAccess();
  const session = await getSessionContext();
  const meResult = await apiFetch<unknown>("/api/v1/users/me");

  if (!meResult.ok) {
    return (
      <PageContainer size="sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Mi cuenta</h1>
        <div className="mt-4">
          <WarningBanner>
            No se pudo cargar tu perfil ({meResult.status}).
          </WarningBanner>
        </div>
      </PageContainer>
    );
  }

  const user = parseMe(meResult.data);
  if (!user) {
    return (
      <PageContainer size="sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Mi cuenta</h1>
        <div className="mt-4">
          <ErrorBanner>La respuesta del servidor no tiene el formato esperado.</ErrorBanner>
        </div>
      </PageContainer>
    );
  }

  const membership = session?.membership;
  const canEditWorkspace =
    membership != null && WRITE_ROLES.has(membership.role);

  let workspace: WorkspaceAccount | null = null;
  const accountResult = await apiFetch<WorkspaceAccount>("/api/v1/account");
  if (accountResult.ok) workspace = accountResult.data;

  const registered = new Date(user.created_at).toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <PageContainer size="sm">
      <Link
        href="/listings"
        className="text-sm font-medium text-zinc-600 underline"
      >
        ← Anuncios
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Mi cuenta</h1>
      <p className="mt-1 text-sm text-zinc-600">
        Perfil y datos de tu inmobiliaria.
      </p>

      <Card className="mt-8 p-6">
        <h2 className="text-sm font-semibold text-zinc-800">Acceso</h2>
        <dl className="mt-4">
          <div className="grid grid-cols-1 gap-1 border-b border-zinc-100 py-3 first:pt-0 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-zinc-500">Correo</dt>
            <dd className="text-sm text-zinc-900 sm:col-span-2">{user.email}</dd>
          </div>
          <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-zinc-500">Registro</dt>
            <dd className="text-sm text-zinc-900 sm:col-span-2">{registered}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t border-zinc-100 pt-4">
          <AccountEmailForm initialEmail={user.email} />
        </div>
      </Card>

      {workspace ? (
        <>
          <Card className="mt-6 p-6">
            <h2 className="text-sm font-semibold text-zinc-800">Inmobiliaria</h2>
            <div className="mt-4">
              <WorkspaceSettingsForm
                name={workspace.name}
                timezone={workspace.timezone}
                currency={workspace.currency}
                canEdit={canEditWorkspace}
              />
            </div>
          </Card>
          <Card className="mt-6 p-6">
            <WorkspaceLogoForm
              accountName={workspace.name}
              logoUrl={workspace.logo_url}
              canEdit={canEditWorkspace}
            />
          </Card>
        </>
      ) : null}
    </PageContainer>
  );
}
