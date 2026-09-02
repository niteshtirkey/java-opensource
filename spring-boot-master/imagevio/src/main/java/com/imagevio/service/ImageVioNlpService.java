package com.imagevio.service;

import com.imagevio.dto.ImageEditResponse;
import com.imagevio.dto.ImageOperation;
import com.imagevio.dto.OperationParameters;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ImageVioNlpService {

    private final SecurityGuardrailService securityGuardrailService;

    // Allowed actions
    public static final Set<String> WHITELISTED_ACTIONS = Set.of(
            "resize", "crop", "filter", "rotate", "adjust_brightness"
    );

    private static final int MIN_DIMENSION = 1;
    private static final int MAX_DIMENSION = 4096;
    private static final int MIN_ROTATION = -360;
    private static final int MAX_ROTATION = 360;

    // Pattern matchers for operation parsing
    private static final Pattern RESIZE_PATTERN = Pattern.compile(
            "(?:resize|scale|dimensions?)\\s+(?:to\\s+)?(\\d+)\\s*(?:x|by|\\*|,)?\\s*(\\d+)?", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern CROP_PATTERN = Pattern.compile(
            "crop\\s+(?:to\\s+)?(\\d+)\\s*(?:x|by|\\*|,)?\\s*(\\d+)?", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern ROTATE_PATTERN = Pattern.compile(
            "rotate\\s+(?:by\\s+)?(-?\\d+)(?:\\s*deg(?:rees?)?)?", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern BRIGHTNESS_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?brightness\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern FILTER_PATTERN = Pattern.compile(
            "(?:apply\\s+)?(?:filter\\s+([a-zA-Z0-9_-]+)|(grayscale|sepia|vintage|blur|sharpen|invert|black_and_white)\\s+filter)", Pattern.CASE_INSENSITIVE
    );

    public ImageVioNlpService(SecurityGuardrailService securityGuardrailService) {
        this.securityGuardrailService = securityGuardrailService;
    }

    /**
     * Parses the user prompt, runs security checks, and extracts whitelisted image editing operations.
     */
    public ImageEditResponse processPrompt(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return ImageEditResponse.active(Collections.emptyList());
        }

        // 1. Security & Pre-processing layer
        if (!securityGuardrailService.isSafe(prompt)) {
            return ImageEditResponse.blocked();
        }

        // 2. Sequential Operation Parsing
        List<ImageOperation> operations = new ArrayList<>();
        int sequenceCounter = 1;

        // Split complex multi-step/conversational instructions by delimiters (and, then, comma, semicolon, newline)
        String[] steps = prompt.split("(?i)\\s+(?:and\\s+then|then|and)\\s+|[,;\\n]+");

        for (String step : steps) {
            String cleanStep = step.trim();
            if (cleanStep.isEmpty()) continue;

            ImageOperation op = parseStep(cleanStep, sequenceCounter);
            if (op != null && WHITELISTED_ACTIONS.contains(op.getActionType())) {
                operations.add(op);
                sequenceCounter++;
            }
        }

        return ImageEditResponse.active(operations);
    }

    private ImageOperation parseStep(String stepText, int sequenceId) {
        // Check Resize
        Matcher resizeMatcher = RESIZE_PATTERN.matcher(stepText);
        if (resizeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(resizeMatcher.group(1));
            int h = resizeMatcher.group(2) != null ? parseBoundedDimension(resizeMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "resize", params);
        }

        // Check Crop
        Matcher cropMatcher = CROP_PATTERN.matcher(stepText);
        if (cropMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(cropMatcher.group(1));
            int h = cropMatcher.group(2) != null ? parseBoundedDimension(cropMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "crop", params);
        }

        // Check Rotate
        Matcher rotateMatcher = ROTATE_PATTERN.matcher(stepText);
        if (rotateMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int deg = parseBoundedRotation(rotateMatcher.group(1));
            params.setRotationDegrees(deg);
            return new ImageOperation(sequenceId, "rotate", params);
        }

        // Check Brightness
        Matcher brightnessMatcher = BRIGHTNESS_PATTERN.matcher(stepText);
        if (brightnessMatcher.find()) {
            OperationParameters params = new OperationParameters();
            double intensity = parseIntensity(brightnessMatcher.group(1));
            params.setIntensityLevel(intensity);
            return new ImageOperation(sequenceId, "adjust_brightness", params);
        }

        // Check Filter
        Matcher filterMatcher = FILTER_PATTERN.matcher(stepText);
        if (filterMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String filter = filterMatcher.group(1) != null ? filterMatcher.group(1) : filterMatcher.group(2);
            params.setFilterName(filter.toLowerCase());
            return new ImageOperation(sequenceId, "filter", params);
        }

        // Unknown / non-whitelisted actions are safely skipped (mapped to null/ignored)
        return null;
    }

    private int parseBoundedDimension(String val) {
        if (val == null) return 0;
        try {
            long parsed = Long.parseLong(val);
            if (parsed > MAX_DIMENSION) {
                return MAX_DIMENSION; // Resource exhaustion shield
            }
            if (parsed < MIN_DIMENSION) {
                return MIN_DIMENSION;
            }
            return (int) parsed;
        } catch (NumberFormatException e) {
            return MIN_DIMENSION;
        }
    }

    private int parseBoundedRotation(String val) {
        if (val == null) return 0;
        try {
            int deg = Integer.parseInt(val);
            if (deg > MAX_ROTATION) deg = MAX_ROTATION;
            if (deg < MIN_ROTATION) deg = MIN_ROTATION;
            return deg;
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private double parseIntensity(String val) {
        if (val == null || val.isBlank()) return 1.0;
        try {
            return Double.parseDouble(val);
        } catch (NumberFormatException e) {
            return 1.0;
        }
    }
}
