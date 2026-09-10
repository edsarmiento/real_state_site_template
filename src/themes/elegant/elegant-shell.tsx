import type { ReactNode } from "react";
import "./elegant-theme.css";
import { ELEGANT_FONT_CLASS } from "@/themes/elegant/elegant-fonts";
import { elegantContactChannels } from "@/themes/elegant/elegant-contact-channels";
import { ElegantMotionRoot } from "@/themes/elegant/elegant-motion-root";
import { loadElegantUi } from "@/themes/elegant/elegant-ui";
import { ElegantWhatsAppFloat } from "@/themes/elegant/elegant-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function ElegantShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await loadElegantUi(lang);
  const href = elegantContactChannels(content).whatsappHref;

  return (
    <div
      data-site-theme="elegant"
      data-elegant-motion={content.motion.preset}
      lang={locale}
      className={`${ELEGANT_FONT_CLASS} elegant-root`}
    >
      <ElegantMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <ElegantWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </ElegantMotionRoot>
    </div>
  );
}
