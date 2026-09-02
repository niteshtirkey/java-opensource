import axios from "axios";
import { ImageEditResponse } from "@/types/editor";
import { SecuritySanitizer } from "@/utils/security";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export async function initSession(sessionId: string) {
  const response = await apiClient.post("/api/sessions/init", { sessionId });
  return response.data;
}

export async function sendPromptCommand(
  prompt: string,
  sessionId?: string | null
): Promise<ImageEditResponse> {
  const validation = SecuritySanitizer.validatePrompt(prompt);
  if (!validation.valid) {
    return {
      session_status: "blocked",
      error_message: validation.error || "Input failed security validation.",
      parsed_operations: [],
    };
  }

  const cleanPrompt = SecuritySanitizer.sanitize(prompt);

  const response = await apiClient.post(
    "/api/parse/command",
    { prompt: cleanPrompt },
    {
      headers: sessionId ? { "X-Session-ID": sessionId } : {},
    }
  );

  return response.data;
}
