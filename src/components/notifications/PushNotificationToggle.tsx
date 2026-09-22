"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import {
  isPushNotificationSupported,
  getCurrentPushSubscription,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
} from "@/lib/push-notifications";

interface PushNotificationToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function PushNotificationToggle({
  className = "",
  showLabel = false,
}: PushNotificationToggleProps) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const isSupported = isPushNotificationSupported();
    setSupported(isSupported);

    if (isSupported) {
      setPermission(Notification.permission);
      getCurrentPushSubscription().then((sub) => {
        setSubscribed(!!sub);
      });
    }
  }, []);

  const handleToggle = async () => {
    if (!supported || loading) return;
    setLoading(true);
    setMessage(null);

    try {
      if (subscribed) {
        const res = await unsubscribeFromPushNotifications();
        if (res.success) {
          setSubscribed(false);
          setMessage("Notifications disabled");
        } else {
          setMessage(res.message || "Failed to disable notifications");
        }
      } else {
        const res = await subscribeToPushNotifications();
        if (res.success) {
          setSubscribed(true);
          setPermission("granted");
          setMessage("Notifications enabled!");
        } else {
          setPermission(Notification.permission);
          setMessage(res.message || "Could not enable notifications");
        }
      }
    } catch (err: any) {
      setMessage(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  if (!supported) return null;

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        title={
          permission === "denied"
            ? "Notifications blocked in browser settings"
            : subscribed
            ? "Push notifications are active (click to turn off)"
            : "Turn on push notifications"
        }
        aria-label="Toggle push notifications"
        className={`relative flex items-center gap-2 rounded-full border border-[var(--border)] p-2 transition cursor-pointer hover:bg-[var(--border)]/40 ${
          subscribed
            ? "text-mst-red bg-mst-red/10 border-mst-red/30"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        } ${className}`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin text-mst-red" />
        ) : subscribed ? (
          <>
            <BellRing size={16} className="text-mst-red" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
          </>
        ) : permission === "denied" ? (
          <BellOff size={16} className="text-neutral-400" />
        ) : (
          <Bell size={16} />
        )}

        {showLabel && (
          <span className="text-xs font-medium">
            {subscribed ? "Notifications On" : "Enable Alerts"}
          </span>
        )}
      </button>

      {/* Floating feedback message */}
      {message && (
        <div className="absolute top-full mt-2 right-0 z-50 whitespace-nowrap rounded-md bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text)] shadow-lg animate-in fade-in slide-in-from-top-1">
          {message}
        </div>
      )}
    </div>
  );
}
