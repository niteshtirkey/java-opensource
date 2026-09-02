import DOMPurify from "dompurify";
import { z } from "zod";

export const PromptSchema = z
  .string()
  .min(1, "Prompt cannot be empty")
  .max(500, "Prompt must be 500 characters or fewer")
  .regex(/^[a-zA-Z0-9\s.,!?'"()_-]*$/, "Invalid characters in prompt");

export class SecuritySanitizer {
  static sanitize(input: string): string {
    if (typeof window !== "undefined") {
      return DOMPurify.sanitize(input.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });
    }
    return input.replace(/<[^>]*>?/gm, "").trim();
  }

  static validatePrompt(prompt: string): { valid: boolean; error?: string } {
    const sanitized = this.sanitize(prompt);
    const result = PromptSchema.safeParse(sanitized);
    if (!result.success) {
      return { valid: false, error: result.error.issues[0]?.message || "Invalid prompt syntax" };
    }
    return { valid: true };
  }
}
