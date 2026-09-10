import { getLuxuryUi } from "@/themes/luxury/luxury-ui";
import { LuxuryFooter } from "@/themes/luxury/luxury-footer";
import { LuxuryHeader } from "@/themes/luxury/luxury-header";
import { LuxuryShell } from "@/themes/luxury/luxury-shell";
import type { LegalPageThemeRouteProps } from "@/themes/theme-types";

export async function LuxuryLegalPage({ kind, lang }: LegalPageThemeRouteProps) {
  const { dict } = await getLuxuryUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <LuxuryShell lang={lang}>
      <LuxuryHeader lang={lang} />
      <main className="luxury-legal">
        <p className="luxury-kicker">{dict.legal.kicker}</p>
        <h1 className="luxury-section__title">{title}</h1>
        <p className="luxury-section__lead">{dict.legal.disclaimer}</p>
        <p>{dict.legal.body}</p>
      </main>
      <LuxuryFooter lang={lang} />
    </LuxuryShell>
  );
}
