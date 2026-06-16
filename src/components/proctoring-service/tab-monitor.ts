let visibilityHandler:
  | (() => void)
  | null = null;

export const startTabMonitoring = (
  onViolation: (type: string, message: string) => void,
  onResolve: (type: string) => void
) => {
  visibilityHandler = () => {
    if (document.hidden) {
      onViolation("TAB_SWITCH", "Tab switched or minimized");
    } else {
      onResolve("TAB_SWITCH");
    }
  };

  document.addEventListener(
    "visibilitychange",
    visibilityHandler
  );
};

export const stopTabMonitoring = () => {
  if (visibilityHandler) {
    document.removeEventListener(
      "visibilitychange",
      visibilityHandler
    );
  }
};