import axios, { AxiosError } from "axios";
import { ImageEditResponse } from "@/types/editor";
import { SecuritySanitizer } from "@/utils/security";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

/**
 * Executes an async task with exponential backoff retry.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 600): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(fn, retries - 1, delayMs * 2);
  }
}

export async function initSession(sessionId: string) {
  return withRetry(async () => {
    const response = await apiClient.post("api/sessions/init", { sessionId });
    return response.data;
  });
}


