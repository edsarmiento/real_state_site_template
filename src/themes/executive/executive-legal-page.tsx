import type { LegalPageThemeProps } from "@/themes/theme-types";
import { ExecutiveFooter } from "@/themes/executive/executive-footer";
import { ExecutiveHeader } from "@/themes/executive/executive-header";
import { ExecutiveShell } from "@/themes/executive/executive-shell";
import { getExecutiveUi } from "@/themes/executive/executive-ui";

export async function ExecutiveLegalPage({ kind, lang }: LegalPageThemeProps) {
  const { dict } = await getExecutiveUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <ExecutiveShell lang={lang}>
      <ExecutiveHeader lang={lang} />
      <main className="executive-legal">
        <div className="executive-shell executive-legal__inner">
          <p className="executive-kicker">{dict.legal.kicker}</p>
          <h1 className="executive-section__title">{title}</h1>
          <p className="executive-lead">{dict.legal.disclaimer}</p>
          <p className="executive-legal__body">{dict.legal.body}</p>
        </div>
      </main>
      <ExecutiveFooter lang={lang} />
    </ExecutiveShell>
  );
}
