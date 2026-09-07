import type { ReactNode } from "react";
import { ULTRA_FONT_CLASS } from "@/themes/ultra/ultra-fonts";
import { ultraContactChannels } from "@/themes/ultra/ultra-contact-channels";
import { getUltraUi } from "@/themes/ultra/ultra-ui";
import { UltraWhatsAppFloat } from "@/themes/ultra/ultra-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
};

export async function UltraShell({
  children,
  floatRaised = false,
  lang,
}: Props) {
  const { content, dict, locale } = await getUltraUi(lang);
  const href = ultraContactChannels(content).whatsappHref;

  return (
    <div
      data-site-theme="ultra"
      data-ultra-motion={content.motion.preset}
      lang={locale}
      className={`${ULTRA_FONT_CLASS} ultra-root`}
    >
      {children}
      {href ? (
        <UltraWhatsAppFloat
          href={href}
          label={dict.whatsapp.float}
          opensInNewTab={dict.a11y.opensInNewTab}
          raised={floatRaised}
        />
      ) : null}
    </div>
  );
}
