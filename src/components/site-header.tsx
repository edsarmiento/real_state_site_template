import Link from "next/link";
import { Suspense } from "react";
import { SiteLocaleSwitcher } from "@/components/site-locale-switcher";
import { getSessionContext } from "@/lib/session-context";
import { getSiteUi } from "@/lib/site-ui";

type Props = {
  lang?: string;
};

export async function SiteHeader({ lang }: Props) {
  const [session, ui] = await Promise.all([
    getSessionContext(),
    getSiteUi(lang),
  ]);
  const logo = ui.config.siteLogoUrl;
  const name = ui.config.siteName;
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

        <div className="flex shrink-0 items-center gap-3">
          <Suspense fallback={null}>
            <SiteLocaleSwitcher
              locale={ui.locale}
              defaultLocale={ui.defaultLocale}
              supportedLocales={ui.localeConfig.supportedLocales}
              dict={ui.dict}
            />
          </Suspense>
          {isAdmin ? (
            <Link
              href="/listings"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {ui.dict.admin.manage}
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              {ui.dict.admin.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
