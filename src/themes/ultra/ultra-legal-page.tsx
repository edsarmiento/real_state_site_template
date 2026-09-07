import type { LegalPageThemeProps } from "@/themes/theme-types";
import { UltraFooter } from "@/themes/ultra/ultra-footer";
import { UltraHeader } from "@/themes/ultra/ultra-header";
import { UltraShell } from "@/themes/ultra/ultra-shell";
import { getUltraUi } from "@/themes/ultra/ultra-ui";

export async function UltraLegalPage({ kind, lang }: LegalPageThemeProps) {
  const { dict } = await getUltraUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <UltraShell lang={lang} particles="detail">
      <UltraHeader lang={lang} />
      <main className="ultra-legal">
        <div className="ultra-shell ultra-legal__inner">
          <p className="ultra-eyebrow">{dict.legal.kicker}</p>
          <h1 className="ultra-section-title">{title}</h1>
          <p className="ultra-lead">{dict.legal.disclaimer}</p>
          <p className="ultra-legal__body">{dict.legal.body}</p>
        </div>
      </main>
      <UltraFooter lang={lang} />
    </UltraShell>
  );
}
