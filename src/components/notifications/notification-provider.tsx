"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  NotificationModal,
  type NotificationModalState,
} from "@/components/notifications/notification-modal";
import {
  registerNotificationHost,
  unregisterNotificationHost,
  type ConfirmOptions,
  type NotifyOptions,
} from "@/lib/notifications";

type NotificationContextValue = {
  notify: (message: string, options?: NotifyOptions) => Promise<void>;
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return ctx;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<NotificationModalState[]>([]);
  const active = queue[0] ?? null;

  const dequeue = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  const enqueue = useCallback((item: NotificationModalState) => {
    setQueue((q) => [...q, item]);
  }, []);

  const notify = useCallback(
    (message: string, options?: NotifyOptions) =>
      new Promise<void>((resolve) => {
        enqueue({
          kind: "alert",
          message,
          options,
          resolve: () => resolve(),
        });
      }),
    [enqueue],
  );

  const confirm = useCallback(
    (message: string, options?: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        enqueue({
          kind: "confirm",
          message,
          options,
          resolve,
        });
      }),
    [enqueue],
  );

  useEffect(() => {
    registerNotificationHost({ notify, confirm });
    return unregisterNotificationHost;
  }, [notify, confirm]);

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      <div className="min-h-full min-w-0 w-full flex-1">
        {children}
      </div>
      {active ? (
        <NotificationModal state={active} onClose={dequeue} />
      ) : null}
    </NotificationContext.Provider>
  );
}
