import type { LegalPageThemeProps } from "@/themes/theme-types";
import { getElegantUi } from "@/themes/elegant/elegant-ui";
import { ElegantFooter } from "@/themes/elegant/elegant-footer";
import { ElegantHeader } from "@/themes/elegant/elegant-header";
import { ElegantShell } from "@/themes/elegant/elegant-shell";

export async function ElegantLegalPage({ kind, lang }: LegalPageThemeProps) {
  const { dict } = await getElegantUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <ElegantShell lang={lang}>
      <ElegantHeader lang={lang} />
      <main className="elegant-legal">
        <div className="elegant-shell">
          <p className="elegant-kicker">{dict.legal.kicker}</p>
          <h1 className="elegant-section__title">{title}</h1>
          <p className="elegant-muted">{dict.legal.disclaimer}</p>
          <p>{dict.legal.body}</p>
        </div>
      </main>
      <ElegantFooter lang={lang} />
    </ElegantShell>
  );
}
