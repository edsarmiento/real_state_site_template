import type { ReactNode } from "react";
import { BEIGE_FONT_CLASS } from "@/themes/beige/beige-fonts";
import { BeigeMotionRoot } from "@/themes/beige/beige-motion-root";
import { getBeigeUi } from "@/themes/beige/beige-ui";
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
  const { content, dict, locale } = await getBeigeUi(lang);
  const href = content.whatsapp.href ?? content.contact.whatsappHref;

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
