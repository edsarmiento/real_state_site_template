import type { ReactNode } from "react";
import { resolveThemeProps } from "@/themes/resolve-theme-props";
import type { ThemeResolvedProps } from "@/themes/theme-types";

type WithLang = { lang?: string };

/**
 * Registry-only wrapper: resolve SiteConfig/content/locale once, then paint.
 * App routes stay fetch/delegate-only; paint components receive resolved props.
 * Renders the inner component via JSX (not as a plain function call).
 */
export function withResolvedThemeProps<P extends WithLang>(
  Component: (props: P & ThemeResolvedProps) => ReactNode | Promise<ReactNode>,
): (props: P) => Promise<ReactNode> {
  return async function ResolvedThemeSurface(props: P) {
    const resolved = await resolveThemeProps(props.lang);
    return <Component {...props} {...resolved} />;
  };
}
