"use client";

import type { ReactNode } from "react";
import { NotificationProvider } from "@/components/notifications/notification-provider";

/** Client boundary: modal de notificaciones para toda la app. */
export function NotificationRoot({ children }: { children: ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
