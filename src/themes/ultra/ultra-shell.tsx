import { publicContactChannels } from "@/lib/public-contact-channels";
import type { ReactNode } from "react";
import "./ultra-theme.css";
import { ULTRA_FONT_CLASS } from "@/themes/ultra/ultra-fonts";
import { UltraMotionRoot } from "@/themes/ultra/ultra-motion-root";
import { UltraParticles } from "@/themes/ultra/ultra-particles";
import { loadUltraUi } from "@/themes/ultra/ultra-ui";
import { UltraWhatsAppFloat } from "@/themes/ultra/ultra-whatsapp-float";

type Props = {
  children: ReactNode;
  floatRaised?: boolean;
  lang?: string;
  particles?: "ambient" | "detail";
};

export async function UltraShell({
  children,
  floatRaised = false,
  lang,
  particles = "ambient",
}: Props) {
  const { content, dict, locale } = await loadUltraUi(lang);
  const href = publicContactChannels(content).whatsappHref;
  const motionOn = content.motion.preset !== "none";

  return (
    <div
      data-site-theme="ultra"
      data-ultra-motion={content.motion.preset}
      lang={locale}
      className={`${ULTRA_FONT_CLASS} ultra-root`}
    >
      {motionOn ? <UltraParticles density={particles} /> : null}
      <UltraMotionRoot preset={content.motion.preset}>
        {children}
        {href ? (
          <UltraWhatsAppFloat
            href={href}
            label={dict.whatsapp.float}
            opensInNewTab={dict.a11y.opensInNewTab}
            raised={floatRaised}
          />
        ) : null}
      </UltraMotionRoot>
    </div>
  );
}
