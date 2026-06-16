let keyboardHandler:
  | ((e: KeyboardEvent) => void)
  | null = null;

let contextMenuHandler:
  | ((e: MouseEvent) => void)
  | null = null;

export const startKeyboardMonitoring = (
  onViolation: (
    type: string,
    message: string
  ) => void
) => {
  keyboardHandler = (e: KeyboardEvent) => {
    if (e.key === "F12") {
      e.preventDefault();

      onViolation(
        "KEY_BLOCKED",
        "Developer tools blocked"
      );
    }

    if (
      e.ctrlKey &&
      e.shiftKey &&
      e.key.toLowerCase() === "i"
    ) {
      e.preventDefault();

      onViolation(
        "KEY_BLOCKED",
        "Inspect blocked"
      );
    }

    if (
      e.ctrlKey &&
      e.key.toLowerCase() === "c"
    ) {
      e.preventDefault();

      onViolation(
        "COPY_ATTEMPT",
        "Copy attempt"
      );
    }

    if (
      e.ctrlKey &&
      e.key.toLowerCase() === "v"
    ) {
      e.preventDefault();

      onViolation(
        "PASTE_ATTEMPT",
        "Paste attempt"
      );
    }
  };

  contextMenuHandler = (
    e: MouseEvent
  ) => {
    e.preventDefault();

    onViolation(
      "RIGHT_CLICK",
      "Right click blocked"
    );
  };

  document.addEventListener(
    "keydown",
    keyboardHandler,
    true
  );

  document.addEventListener(
    "contextmenu",
    contextMenuHandler
  );
};

export const stopKeyboardMonitoring = () => {
  if (keyboardHandler) {
    document.removeEventListener(
      "keydown",
      keyboardHandler,
      true
    );
  }

  if (contextMenuHandler) {
    document.removeEventListener(
      "contextmenu",
      contextMenuHandler
    );
  }
};