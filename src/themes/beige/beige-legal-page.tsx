import type { LegalPageThemeRouteProps } from "@/themes/theme-types";
import { getBeigeUi } from "@/themes/beige/beige-ui";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeShell } from "@/themes/beige/beige-shell";

export async function BeigeLegalPage({ kind, lang }: LegalPageThemeRouteProps) {
  const { dict } = await getBeigeUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} />
      <main className="beige-legal">
        <div className="beige-shell beige-legal__inner">
          <p className="beige-eyebrow">{dict.legal.kicker}</p>
          <h1 className="beige-section__title">{title}</h1>
          <p className="beige-lead">{dict.legal.disclaimer}</p>
          <p className="beige-legal__body">{dict.legal.body}</p>
        </div>
      </main>
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
