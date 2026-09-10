import type { ReactNode } from "react";
import "./dark-theme.css";
import { DARK_FONT_CLASS } from "@/themes/dark/dark-fonts";
import { darkContactChannels } from "@/themes/dark/dark-contact-channels";
import { DarkMotionRoot } from "@/themes/dark/dark-motion-root";
import { getDarkUi } from "@/themes/dark/dark-ui";
import { DarkWhatsAppFloat } from "@/themes/dark/dark-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function DarkShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await getDarkUi(lang);
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
