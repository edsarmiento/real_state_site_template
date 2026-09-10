import type { ReactNode } from "react";
import "./yellow-theme.css";
import { YELLOW_FONT_CLASS } from "@/themes/yellow/yellow-fonts";
import { YellowMotionRoot } from "@/themes/yellow/yellow-motion-root";
import { getYellowUi } from "@/themes/yellow/yellow-ui";

type Props = {
  children: ReactNode;
  lang?: string;
};

export async function YellowShell({ children, lang }: Props) {
  const { content, locale } = await getYellowUi(lang);

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
