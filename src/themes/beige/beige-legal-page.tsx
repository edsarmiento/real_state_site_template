import type { LegalPageThemeProps } from "@/themes/theme-types";
import { getBeigeUi } from "@/themes/beige/beige-ui";
import { BeigeFooter } from "@/themes/beige/beige-footer";
import { BeigeHeader } from "@/themes/beige/beige-header";
import { BeigeShell } from "@/themes/beige/beige-shell";

export async function BeigeLegalPage({ kind, lang }: LegalPageThemeProps) {
  const { dict } = await getBeigeUi(lang);
  const title =
    kind === "privacy"
      ? dict.legal.privacyTitle
      : kind === "terms"
        ? dict.legal.termsTitle
        : dict.legal.cookiesTitle;

  return (
    <BeigeShell lang={lang}>
      <BeigeHeader lang={lang} variant="detail" />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#A39073]">
          {dict.legal.kicker}
        </p>
        <h1 className="beige-serif mt-3 text-4xl">{title}</h1>
        <p className="mt-6 text-[#8A7759]">{dict.legal.disclaimer}</p>
        <p className="mt-4 leading-relaxed">{dict.legal.body}</p>
      </main>
      <BeigeFooter lang={lang} />
    </BeigeShell>
  );
}
