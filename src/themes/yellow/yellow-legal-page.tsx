import type { LegalPageThemeProps } from "@/themes/theme-types";
import { YellowFooter } from "@/themes/yellow/yellow-footer";
import { YellowHeader } from "@/themes/yellow/yellow-header";
import { YellowShell } from "@/themes/yellow/yellow-shell";
import { getYellowUi } from "@/themes/yellow/yellow-ui";

export function YellowLegalPage({
  kind,
  content,
  config,
  locale,
}: LegalPageThemeProps) {
  const ui = getYellowUi({ content, config, locale });
  const { dict } = ui;
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <YellowShell content={content} locale={locale}>
      <YellowHeader ui={ui} />
      <main className="yellow-legal">
        <div className="yellow-shell yellow-legal__inner">
          <p className="yellow-eyebrow">{dict.legal.kicker}</p>
          <h1 className="yellow-section__title">{title}</h1>
          <p className="yellow-lead">{dict.legal.disclaimer}</p>
          <p className="yellow-legal__body">{dict.legal.body}</p>
        </div>
      </main>
      <YellowFooter ui={ui} />
    </YellowShell>
  );
}
