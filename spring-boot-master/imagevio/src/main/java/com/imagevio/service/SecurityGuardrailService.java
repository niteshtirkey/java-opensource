package com.imagevio.service;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class SecurityGuardrailService {

    // Injection & Jailbreak patterns
    private static final Pattern[] INJECTION_PATTERNS = new Pattern[]{
            Pattern.compile("disregard\\s+previous\\s+instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("ignore\\s+(all\\s+)?(previous|past)\\s+instructions", Pattern.CASE_INSENSITIVE),
            Pattern.compile("act\\s+as\\s+(a|an)?\\s*terminal", Pattern.CASE_INSENSITIVE),
            Pattern.compile("run\\s+shell\\s+commands?", Pattern.CASE_INSENSITIVE),
            Pattern.compile("system\\s+prompt", Pattern.CASE_INSENSITIVE),
            Pattern.compile("you\\s+are\\s+now\\s+a", Pattern.CASE_INSENSITIVE),
            Pattern.compile("bypass\\s+(operating\\s+)?boundaries", Pattern.CASE_INSENSITIVE),
            Pattern.compile("sudo\\s+", Pattern.CASE_INSENSITIVE),
            Pattern.compile("/bin/(sh|bash)", Pattern.CASE_INSENSITIVE)
    };

    /**
     * Checks whether the user input contains prompt injection, jailbreak attempts,
     * or malicious control overrides.
     *
     * @param prompt The incoming user prompt.
     * @return true if safe, false if a security violation is detected.
     */
    public boolean isSafe(String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            return true;
        }

        String cleanedPrompt = prompt.trim();

        for (Pattern pattern : INJECTION_PATTERNS) {
            if (pattern.matcher(cleanedPrompt).find()) {
                return false;
            }
        }

        return true;
    }
}
