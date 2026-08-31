import { AuthPageShell } from "@/components/auth-page-shell";
import type { SiteBranding } from "@/lib/site-config-types";

export function LoginLoading(
  props: SiteBranding & { styledLayout?: boolean },
) {
  return (
    <AuthPageShell
      title="Iniciar sesión"
      description="Cargando…"
      {...props}
    >
      <div className="flex justify-center py-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
      </div>
    </AuthPageShell>
  );
}
