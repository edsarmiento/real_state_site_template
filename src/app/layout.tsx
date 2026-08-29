import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { NotificationRoot } from "@/components/notification-root";
import { siteName, siteOrigin, siteTagline } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: siteName(),
    template: `%s · ${siteName()}`,
  },
  description: siteTagline(),
  applicationName: siteName(),
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteOrigin(),
    siteName: siteName(),
    title: siteName(),
    description: siteTagline(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <NotificationRoot>{children}</NotificationRoot>
      </body>
    </html>
  );
}
