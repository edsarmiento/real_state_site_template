import type { ReactNode } from "react";
import "./executive-theme.css";
import { EXECUTIVE_FONT_CLASS } from "@/themes/executive/executive-fonts";
import { getExecutiveUi } from "@/themes/executive/executive-ui";

type Props = {
  children: ReactNode;
  lang?: string;
};

export async function ExecutiveShell({ children, lang }: Props) {
  const { locale } = await getExecutiveUi(lang);

  return (
    <div
      data-site-theme="executive"
      lang={locale}
      className={`${EXECUTIVE_FONT_CLASS} executive-root`}
    >
      {children}
    </div>
  );
}
