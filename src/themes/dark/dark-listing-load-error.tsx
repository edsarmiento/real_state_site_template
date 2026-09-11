import { getSessionContext } from "@/lib/session-context";
import { fillTemplate } from "@/lib/site-i18n";
import { DarkFooter } from "@/themes/dark/dark-footer";
import { DarkHeader } from "@/themes/dark/dark-header";
import { DarkShell } from "@/themes/dark/dark-shell";
import { getDarkUi } from "@/themes/dark/dark-ui";
import type { ListingLoadErrorThemeProps } from "@/themes/theme-types";

export async function DarkListingLoadError({
  status,
  content,
  config,
  locale,
}: ListingLoadErrorThemeProps) {
  const session = await getSessionContext();
  const ui = getDarkUi({ content, config, locale });
  const { dict } = ui;
  const message = fillTemplate(dict.results.listingError, { status });

  return (
    <DarkShell content={content} locale={locale} dict={dict}>
      <DarkHeader ui={ui} isAdmin={session?.isStaffUser === true} />
      <main className="dark-legal">
        <div className="dark-shell dark-legal__inner">
          <h1 className="dark-section__title">{message}</h1>
        </div>
      </main>
      <DarkFooter ui={ui} />
    </DarkShell>
  );
}
