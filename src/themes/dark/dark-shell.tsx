import type { ReactNode } from "react";
import "./dark-theme.css";
import type { PublicSiteContent } from "@/lib/public-site-content";
import type { SiteLocale } from "@/lib/site-i18n";
import { DARK_FONT_CLASS } from "@/themes/dark/dark-fonts";
import { darkContactChannels } from "@/themes/dark/dark-contact-channels";
import { DarkMotionRoot } from "@/themes/dark/dark-motion-root";
import type { DarkUi } from "@/themes/dark/dark-ui";
import { DarkWhatsAppFloat } from "@/themes/dark/dark-whatsapp-float";

type Props = {
  children: ReactNode;
  content: PublicSiteContent;
  locale: SiteLocale;
  dict: DarkUi["dict"];
  floatRaised?: boolean;
};

export function DarkShell({
  children,
  content,
  locale,
  dict,
  floatRaised = false,
}: Props) {
  const href = darkContactChannels(content).whatsappHref;

  return (
    <div
      data-site-theme="dark"
      data-dark-motion={content.motion.preset}
      lang={locale}
      className={`${DARK_FONT_CLASS} dark-root`}
    >
      <DarkMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <DarkWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </DarkMotionRoot>
    </div>
  );
}
