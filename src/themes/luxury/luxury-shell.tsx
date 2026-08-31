import type { CSSProperties, ReactNode } from "react";
import { luxuryThemeCssVars, type LuxuryThemeCssVars } from "@/lib/public-site-content";
import {
  LUXURY_BODY_FONT_CLASS,
  LUXURY_HEADING_FONT_CLASS,
} from "@/themes/luxury/luxury-fonts";
import { LuxuryMotionRoot } from "@/themes/luxury/luxury-motion-root";
import { getLuxuryUi } from "@/themes/luxury/luxury-ui";
import { LuxuryWhatsAppFloat } from "@/themes/luxury/luxury-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function LuxuryShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await getLuxuryUi(lang);
  const headingClass =
    LUXURY_HEADING_FONT_CLASS[content.typography.headingFont];
  const bodyClass = LUXURY_BODY_FONT_CLASS[content.typography.bodyFont];
  const style: CSSProperties & LuxuryThemeCssVars = luxuryThemeCssVars(content);
  const href = content.whatsapp.href ?? content.contact.whatsappHref;

  return (
    <div
      data-site-theme="luxury"
      data-luxury-motion={content.motion.preset}
      lang={locale}
      className={[headingClass, bodyClass, "luxury-root min-h-screen"]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <LuxuryMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <LuxuryWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </LuxuryMotionRoot>
    </div>
  );
}