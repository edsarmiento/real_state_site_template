"use client";

import { createContext, useContext, type ReactNode } from "react";

const SiteLayoutVariantContext = createContext(true);

export function SiteLayoutVariantProvider({
  styled,
  children,
}: {
  styled: boolean;
  children: ReactNode;
}) {
  return (
    <SiteLayoutVariantContext.Provider value={styled}>
      {children}
    </SiteLayoutVariantContext.Provider>
  );
}

export function useSiteLayoutStyled(): boolean {
  return useContext(SiteLayoutVariantContext);
}
