import { getResolvedSiteConfig } from "@/lib/resolved-site-config";

export async function SiteBrandingStyles() {
  const config = await getResolvedSiteConfig();
  if (!config.primaryColor) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { --site-primary: ${config.primaryColor}; }`,
      }}
    />
  );
}
