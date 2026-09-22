const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

/**
 * Converts a URL-safe base64 string to a Uint8Array for PushManager subscription.
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Checks whether the current browser supports Web Push notifications.
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Returns the VAPID public key from env or dynamically from the backend.
 */
export async function getVapidPublicKey(): Promise<string> {
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  }
  const res = await fetch(`${BACKEND_URL}/api/notifications/vapid-public-key`);
  if (!res.ok) {
    throw new Error("Failed to fetch VAPID public key from server");
  }
  const data = await res.json();
  return data.publicKey;
}

/**
 * Gets the current active push subscription from the service worker, if any.
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error("Error checking push subscription:", error);
    return null;
  }
}

/**
 * Requests notification permission, registers PushManager subscription,
 * and synchronizes the subscription with the backend.
 */
export async function subscribeToPushNotifications(): Promise<{
  success: boolean;
  message?: string;
  subscription?: PushSubscription;
}> {
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      message: "Push notifications are not supported on this browser/device.",
    };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return {
      success: false,
      message:
        permission === "denied"
          ? "Notification permission was blocked in your browser settings."
          : "Notification permission prompt was dismissed.",
    };
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const vapidKey = await getVapidPublicKey();
    if (!vapidKey) {
      return {
        success: false,
        message: "Server VAPID public key is not configured.",
      };
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidKey);
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey as any,
    });
  }

  const subJson = subscription.toJSON();
  if (!subJson.endpoint || !subJson.keys?.p256dh || !subJson.keys?.auth) {
    return {
      success: false,
      message: "Browser failed to generate push encryption keys.",
    };
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}/api/notifications/subscribe`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      endpoint: subJson.endpoint,
      keys: {
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
      },
      userAgent: navigator.userAgent,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      message:
        errData.message ||
        `Server registration failed with HTTP ${res.status}`,
    };
  }

  return {
    success: true,
    message: "Push notifications enabled successfully!",
    subscription,
  };
}

/**
 * Unsubscribes from browser PushManager and removes subscription from backend.
 */
export async function unsubscribeFromPushNotifications(): Promise<{
  success: boolean;
  message?: string;
}> {
  if (!isPushNotificationSupported()) {
    return { success: false, message: "Push notifications are not supported." };
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe().catch((err) => {
      console.warn("PushManager unsubscribe error:", err);
    });

    const token =
      typeof window !== "undefined" ? localStorage.getItem("admin-token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    await fetch(`${BACKEND_URL}/api/notifications/unsubscribe`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ endpoint }),
    }).catch((err) => {
      console.warn("Backend unsubscribe error:", err);
    });
  }

  return {
    success: true,
    message: "Push notifications turned off.",
  };
}
