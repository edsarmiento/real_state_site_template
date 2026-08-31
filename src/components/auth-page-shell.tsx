"use client";

import type { ReactNode } from "react";
import type { SiteBranding } from "@/lib/site-config-types";

type Props = SiteBranding & {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  styledLayout?: boolean;
};

export function AuthPageShell({
  title,
  description,
  children,
  className,
  siteName,
  siteTagline,
  siteLogoUrl,
  styledLayout = true,
}: Props) {
  const logo = siteLogoUrl;
  const name = siteName;

  return (
    <div
      className={`flex w-full flex-1 items-center justify-center px-4 py-10 ${
        styledLayout ? "bg-zinc-100" : "bg-zinc-50"
      } ${className ?? "min-h-screen"}`}
    >
      <div
        className={`w-full max-w-[420px] overflow-hidden rounded-2xl border bg-white ${
          styledLayout
            ? "border-zinc-200 shadow-lg ring-1 ring-zinc-900/5"
            : "border-zinc-200 shadow-sm"
        }`}
      >
        {styledLayout ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-600 px-8 py-10 text-center text-white">
            <div className="relative flex flex-col items-center">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt=""
                  className="h-12 w-auto max-w-[200px] object-contain brightness-0 invert"
                />
              ) : (
                <span className="text-xl font-semibold tracking-tight">{name}</span>
              )}
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-200">
                {siteTagline}
              </p>
            </div>
          </div>
        ) : (
          <div className="border-b border-zinc-200 px-8 py-8 text-center">
            <div className="flex flex-col items-center">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt=""
                  className="h-12 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <span className="text-xl font-semibold tracking-tight text-zinc-950">
                  {name}
                </span>
              )}
              {siteTagline ? (
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
                  {siteTagline}
                </p>
              ) : null}
            </div>
          </div>
        )}

        <div className="px-8 py-8 sm:px-10 sm:py-9">
          <h1 className="text-center text-xl font-semibold tracking-tight text-zinc-900">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-center text-sm text-zinc-600">{description}</p>
          ) : null}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
