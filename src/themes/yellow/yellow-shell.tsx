import type { ReactNode } from "react";
import "./yellow-theme.css";
import type { PublicSiteContent } from "@/lib/public-site-content";
import type { SiteLocale } from "@/lib/site-i18n";
import { YELLOW_FONT_CLASS } from "@/themes/yellow/yellow-fonts";
import { YellowMotionRoot } from "@/themes/yellow/yellow-motion-root";

type Props = {
  children: ReactNode;
  content: PublicSiteContent;
  locale: SiteLocale;
};

export function YellowShell({ children, content, locale }: Props) {
  return (
    <div
      data-site-theme="yellow"
      data-yellow-motion={content.motion.preset}
      lang={locale}
      className={`${YELLOW_FONT_CLASS} yellow-root`}
    >
      <YellowMotionRoot preset={content.motion.preset}>
        {children}
      </YellowMotionRoot>
    </div>
  );
}
