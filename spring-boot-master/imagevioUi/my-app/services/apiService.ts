import { ImageEditResponse } from "@/types/editor";

export async function sendPromptCommand(
  prompt: string,
  sessionId?: string | null
): Promise<ImageEditResponse> {
  const response = await fetch("/api/proxy/api/v1/imagevio/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sessionId ? { "X-Session-ID": sessionId } : {}),
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error_message || `Server responded with status ${response.status}`
    );
  }

  return response.json();
}
