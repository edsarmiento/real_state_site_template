import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { NotificationRoot } from "@/components/notification-root";
import { SiteBrandingStyles } from "@/components/site-branding-styles";
import { getResolvedSiteConfig } from "@/lib/resolved-site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getResolvedSiteConfig();

  return {
    metadataBase: new URL(config.siteOrigin),
    title: {
      default: config.siteName,
      template: `%s · ${config.siteName}`,
    },
    description: config.siteTagline,
    applicationName: config.siteName,
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: config.siteOrigin,
      siteName: config.siteName,
      title: config.siteName,
      description: config.siteTagline,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <SiteBrandingStyles />
      </head>
      <body className="min-h-full">
        <NotificationRoot>{children}</NotificationRoot>
      </body>
    </html>
  );
}
