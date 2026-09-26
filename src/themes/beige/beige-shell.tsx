import type { ReactNode } from "react";
import "./beige-theme.css";
import { BEIGE_FONT_CLASS } from "@/themes/beige/beige-fonts";
import { publicContactChannels as beigeContactChannels } from "@/lib/public-contact-channels";
import { BeigeMotionRoot } from "@/themes/beige/beige-motion-root";
import { loadBeigeUi } from "@/themes/beige/beige-ui";
import { BeigeWhatsAppFloat } from "@/themes/beige/beige-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function BeigeShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await loadBeigeUi(lang);
  const href = beigeContactChannels(content).whatsappHref;

  return (
    <div
      data-site-theme="beige"
      data-beige-motion={content.motion.preset}
      lang={locale}
      className={`${BEIGE_FONT_CLASS} beige-root`}
    >
      <BeigeMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <BeigeWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </BeigeMotionRoot>
    </div>
  );
}
