import type { ReactNode } from "react";
import { ORANGE_FONT_CLASS } from "@/themes/orange/orange-fonts";
import { OrangeMotionRoot } from "@/themes/orange/orange-motion-root";
import { getOrangeUi } from "@/themes/orange/orange-ui";
import { OrangeWhatsAppFloat } from "@/themes/orange/orange-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function OrangeShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await getOrangeUi(lang);
  const href = content.whatsapp.href ?? content.contact.whatsappHref;

  return (
    <div
      data-site-theme="orange"
      data-orange-motion={content.motion.preset}
      lang={locale}
      className={`${ORANGE_FONT_CLASS} orange-root min-h-screen`}
    >
      <OrangeMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <OrangeWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </OrangeMotionRoot>
    </div>
  );
}
