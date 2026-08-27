export type ChatSource = "LOCAL_KB" | "WEBSITE" | "BOTH" | "NONE";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export class ChatApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

/**
 * Sends a chat message to the FastAPI chatbot backend.
 * Throws a ChatApiError if the response is not successful.
 * 
 * @param message The user's query or message.
 * @param history The conversation history of items containing { role: "user" | "assistant", content: string }.
 * @param provider The AI provider to use (defaults to "gemini").
 * @returns A promise resolving to the API response object with { answer, source }.
 */
export async function sendChatMessage(
  message: string,
  history: ChatHistoryItem[],
  provider: string = "gemini"
): Promise<{ answer: string; source: ChatSource }> {
  const baseURL = process.env.NEXT_PUBLIC_CHATBOT_API_URL || "https://mst-academy-copilot.onrender.com";

  let response: Response;
  try {
    response = await fetch(`${baseURL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history,
        provider,
      }),
    });
  } catch (error) {
    const err = error as Error;
    throw new ChatApiError(
      err.message || "An unexpected network error occurred while communicating with the chatbot."
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ChatApiError(`Failed to parse response: Server returned status ${response.status}`, response.status);
  }

  const responseData = data as {
    detail?: unknown;
    message?: string;
    answer?: string;
    source?: string;
  };

  if (!response.ok) {
    // Handle FastAPI 422 validation errors cleanly
    if (response.status === 422 && responseData.detail) {
      if (Array.isArray(responseData.detail)) {
        const formattedErrors = responseData.detail
          .map((err: unknown) => {
            const e = err as { loc?: (string | number)[]; msg?: string };
            const location = Array.isArray(e.loc) ? e.loc.join(" -> ") : (e.loc || "unknown");
            return `${location}: ${e.msg || "invalid field"}`;
          })
          .join("; ");
        throw new ChatApiError(`Validation Error: ${formattedErrors}`, response.status);
      }
      throw new ChatApiError(`Validation Error: ${JSON.stringify(responseData.detail)}`, response.status);
    }

    // Handle generic non-200 responses
    throw new ChatApiError(
      responseData.message || (typeof responseData.detail === 'string' ? responseData.detail : undefined) || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return {
    answer: responseData.answer || "No response content received.",
    source: (responseData.source as ChatSource) || "NONE",
  };
}
