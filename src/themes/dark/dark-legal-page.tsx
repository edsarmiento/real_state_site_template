import type { LegalPageThemeProps } from "@/themes/theme-types";
import { getDarkUi } from "@/themes/dark/dark-ui";
import { DarkFooter } from "@/themes/dark/dark-footer";
import { DarkHeader } from "@/themes/dark/dark-header";
import { DarkShell } from "@/themes/dark/dark-shell";

export async function DarkLegalPage({ kind, lang }: LegalPageThemeProps) {
  const { dict } = await getDarkUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <DarkShell lang={lang}>
      <DarkHeader lang={lang} />
      <main className="dark-legal">
        <div className="dark-shell dark-legal__inner">
          <p className="dark-eyebrow">{dict.legal.kicker}</p>
          <h1 className="dark-section__title">{title}</h1>
          <p className="dark-lead">{dict.legal.disclaimer}</p>
          <p className="dark-legal__body">{dict.legal.body}</p>
        </div>
      </main>
      <DarkFooter lang={lang} />
    </DarkShell>
  );
}
