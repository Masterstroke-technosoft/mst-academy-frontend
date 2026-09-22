"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  isPushNotificationSupported,
  subscribeToPushNotifications,
} from "@/lib/push-notifications";

/**
 * PushNotificationPrompt
 * Triggers the standard native browser/system permission dialog directly
 * ("localhost:4000 wants to show notifications: Allow / Block")
 * with no custom HTML popups or banners.
 */
export function PushNotificationPrompt() {
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!isPushNotificationSupported()) return;

    const triggerNativePrompt = async () => {
      try {
        if (Notification.permission === "default") {
          // Trigger the standard native browser permission prompt
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await subscribeToPushNotifications();
          }
        } else if (Notification.permission === "granted") {
          // Device already allowed notifications: silently sync with backend to ensure
          // the subscription is registered with this user's account and role (e.g. WORKING_PROFESSIONAL)
          await subscribeToPushNotifications();
        }
      } catch (err) {
        console.warn("Push notification registration error:", err);
      }
    };

    // Small delay to ensure the page has fully initialized
    const timer = setTimeout(() => {
      triggerNativePrompt();
    }, 800);

    return () => clearTimeout(timer);
  }, [user, ready]);

  // Completely headless — no custom HTML popups or overlays
  return null;
}
