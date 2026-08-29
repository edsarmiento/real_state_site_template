import Link from "next/link";
import { getSessionContext } from "@/lib/session-context";
import { siteLogoUrl, siteName } from "@/lib/site-config";

export async function SiteHeader() {
  const session = await getSessionContext();
  const logo = siteLogoUrl();
  const name = siteName();
  const isAdmin = session?.isStaffUser === true;

  return (
    <header className="relative z-10 border-b border-zinc-200/90 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt=""
              className="h-10 w-auto max-w-[160px] object-contain"
            />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-zinc-950">
              {name}
            </span>
          )}
        </Link>

        {isAdmin ? (
          <Link
            href="/listings"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Administrar
          </Link>
        ) : (
          <Link
            href="/login"
            className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Acceder
          </Link>
        )}
      </div>
    </header>
  );
}
