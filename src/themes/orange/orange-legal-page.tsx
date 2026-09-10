import type { LegalPageThemeProps } from "@/themes/theme-types";
import { getOrangeUi } from "@/themes/orange/orange-ui";
import { OrangeFooter } from "@/themes/orange/orange-footer";
import { OrangeHeader } from "@/themes/orange/orange-header";
import { OrangeShell } from "@/themes/orange/orange-shell";

export function OrangeLegalPage({
  kind,
  lang,
  content,
  config,
  locale,
}: LegalPageThemeProps) {
  const { dict } = getOrangeUi({ content, config, locale });
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <OrangeShell lang={lang}>
      <OrangeHeader lang={lang} />
      <main className="orange-legal">
        <p className="orange-kicker">{dict.legal.kicker}</p>
        <h1 className="orange-section__title">{title}</h1>
        <p className="orange-section__lead">{dict.legal.disclaimer}</p>
        <p>{dict.legal.body}</p>
      </main>
      <OrangeFooter lang={lang} />
    </OrangeShell>
  );
}
