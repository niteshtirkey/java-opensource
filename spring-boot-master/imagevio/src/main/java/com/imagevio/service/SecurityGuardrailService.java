package com.imagevio.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class SecurityGuardrailService {

    // Prompt injection & jailbreak regex patterns
    private static final Pattern[] INJECTION_PATTERNS = new Pattern[]{
            Pattern.compile("disregard\\s+previous\\s+instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("ignore\\s+(all\\s+)?(previous|past)\\s+instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("act\\s+as\\s+(a|an)?\\s*terminal", Pattern.CASE_INSENSITIVE),
            Pattern.compile("run\\s+shell\\s+commands?", Pattern.CASE_INSENSITIVE),
            Pattern.compile("system\\s+prompt", Pattern.CASE_INSENSITIVE),
            Pattern.compile("you\\s+are\\s+now\\s+a", Pattern.CASE_INSENSITIVE),
            Pattern.compile("bypass\\s+(operating\\s+)?boundaries", Pattern.CASE_INSENSITIVE),
            Pattern.compile("DROP\\s+TABLE", Pattern.CASE_INSENSITIVE),
            Pattern.compile("DELETE\\s+FROM", Pattern.CASE_INSENSITIVE),
            Pattern.compile("UNION\\s+SELECT", Pattern.CASE_INSENSITIVE),
            Pattern.compile("eval\\s*\\(", Pattern.CASE_INSENSITIVE),
            Pattern.compile("exec\\s*\\(", Pattern.CASE_INSENSITIVE),
            Pattern.compile("system\\s*\\(", Pattern.CASE_INSENSITIVE),
            Pattern.compile("/bin/(sh|bash)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("`|\\$\\(", Pattern.CASE_INSENSITIVE)
    };

    /**
     * Validates prompt length, allowed character sets, and injection patterns.
     */
    public boolean isSafe(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return true;
        }

        String cleanedPrompt = prompt.trim();

        // 1. Length bound check (max 500 chars)
        if (cleanedPrompt.length() > 500) {
            return false;
        }

        // 2. Threat & Injection patterns check
        for (Pattern pattern : INJECTION_PATTERNS) {
            if (pattern.matcher(cleanedPrompt).find()) {
                return false;
            }
        }

        return true;
    }
}
