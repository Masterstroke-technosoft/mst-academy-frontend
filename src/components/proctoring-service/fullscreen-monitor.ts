let fullscreenHandler:
  | (() => void)
  | null = null;

export const startFullscreenMonitoring = (
  onViolation: (type: string, message: string) => void
) => {
  fullscreenHandler = () => {
    if (!document.fullscreenElement) {
      onViolation(
        "FULLSCREEN_EXIT",
        "Fullscreen exited"
      );
    }
  };

  document.addEventListener(
    "fullscreenchange",
    fullscreenHandler
  );
};

export const stopFullscreenMonitoring = () => {
  if (fullscreenHandler) {
    document.removeEventListener(
      "fullscreenchange",
      fullscreenHandler
    );
  }
};

export const enterFullscreen = async (
  element: HTMLElement
) => {
  await element.requestFullscreen();
};