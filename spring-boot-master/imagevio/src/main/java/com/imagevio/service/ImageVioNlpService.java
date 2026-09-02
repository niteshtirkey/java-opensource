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
            "resize", "crop", "filter", "rotate", "adjust_brightness",
            "color_adjust", "add_text", "add_shape", "flip"
    );

    private static final int MIN_DIMENSION = 1;
    private static final int MAX_DIMENSION = 4096;
    private static final int MIN_ROTATION = -360;
    private static final int MAX_ROTATION = 360;

    // Pattern matchers for operation parsing
    private static final Pattern RESIZE_PATTERN = Pattern.compile(
            "(?:resize|scale|dimensions?|make\\s+it)\\s+(?:to\\s+)?(\\d+)\\s*(?:x|by|\\*|,)?\\s*(\\d+)?", Pattern.CASE_INSENSITIVE
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
    private static final Pattern CONTRAST_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?contrast\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern SATURATION_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?saturation\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern TEXT_PATTERN = Pattern.compile(
            "(?:add|insert)\\s+text\\s+[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern SHAPE_PATTERN = Pattern.compile(
            "(?:add|draw)\\s+(?:a\\s+)?(rectangle|circle|star|triangle|line)", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern FLIP_PATTERN = Pattern.compile(
            "flip\\s+(horizontally|vertically|horizontal|vertical)", Pattern.CASE_INSENSITIVE
    );
    private static final Pattern FILTER_PATTERN = Pattern.compile(
            "(?:apply\\s+)?(?:filter\\s+([a-zA-Z0-9_-]+)|(grayscale|sepia|vintage|blur|sharpen|invert|black_and_white|oil_painting|pencil_sketch|pop_art|comic|neon|vignette|glitch|pixelate)\\s+filter)", Pattern.CASE_INSENSITIVE
    );

    public ImageVioNlpService(SecurityGuardrailService securityGuardrailService) {
        this.securityGuardrailService = securityGuardrailService;
    }

    public ImageEditResponse processPrompt(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return ImageEditResponse.active(Collections.emptyList());
        }

        if (!securityGuardrailService.isSafe(prompt)) {
            return ImageEditResponse.blocked();
        }

        List<ImageOperation> operations = new ArrayList<>();
        int sequenceCounter = 1;

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
        // Resize
        Matcher resizeMatcher = RESIZE_PATTERN.matcher(stepText);
        if (resizeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(resizeMatcher.group(1));
            int h = resizeMatcher.group(2) != null ? parseBoundedDimension(resizeMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "resize", params);
        }

        // Crop
        Matcher cropMatcher = CROP_PATTERN.matcher(stepText);
        if (cropMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(cropMatcher.group(1));
            int h = cropMatcher.group(2) != null ? parseBoundedDimension(cropMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "crop", params);
        }

        // Rotate
        Matcher rotateMatcher = ROTATE_PATTERN.matcher(stepText);
        if (rotateMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int deg = parseBoundedRotation(rotateMatcher.group(1));
            params.setRotationDegrees(deg);
            return new ImageOperation(sequenceId, "rotate", params);
        }

        // Brightness
        Matcher brightnessMatcher = BRIGHTNESS_PATTERN.matcher(stepText);
        if (brightnessMatcher.find()) {
            OperationParameters params = new OperationParameters();
            double intensity = parseFactor(brightnessMatcher.group(1));
            params.setIntensityLevel(intensity);
            return new ImageOperation(sequenceId, "adjust_brightness", params);
        }

        // Contrast
        Matcher contrastMatcher = CONTRAST_PATTERN.matcher(stepText);
        if (contrastMatcher.find()) {
            OperationParameters params = new OperationParameters();
            double c = parseFactor(contrastMatcher.group(1));
            params.setContrast(c);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // Saturation
        Matcher satMatcher = SATURATION_PATTERN.matcher(stepText);
        if (satMatcher.find()) {
            OperationParameters params = new OperationParameters();
            double s = parseFactor(satMatcher.group(1));
            params.setSaturation(s);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // Text
        Matcher textMatcher = TEXT_PATTERN.matcher(stepText);
        if (textMatcher.find()) {
            OperationParameters params = new OperationParameters();
            params.setText(textMatcher.group(1));
            return new ImageOperation(sequenceId, "add_text", params);
        }

        // Shape
        Matcher shapeMatcher = SHAPE_PATTERN.matcher(stepText);
        if (shapeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            params.setShapeType(shapeMatcher.group(1).toLowerCase());
            return new ImageOperation(sequenceId, "add_shape", params);
        }

        // Flip
        Matcher flipMatcher = FLIP_PATTERN.matcher(stepText);
        if (flipMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String dir = flipMatcher.group(1).toLowerCase();
            if (dir.startsWith("h")) params.setFlipHorizontal(true);
            if (dir.startsWith("v")) params.setFlipVertical(true);
            return new ImageOperation(sequenceId, "flip", params);
        }

        // Filter
        Matcher filterMatcher = FILTER_PATTERN.matcher(stepText);
        if (filterMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String filter = filterMatcher.group(1) != null ? filterMatcher.group(1) : filterMatcher.group(2);
            params.setFilterName(filter.toLowerCase());
            return new ImageOperation(sequenceId, "filter", params);
        }

        return null;
    }

    private int parseBoundedDimension(String val) {
        if (val == null) return 0;
        try {
            long parsed = Long.parseLong(val);
            if (parsed > MAX_DIMENSION) return MAX_DIMENSION;
            if (parsed < MIN_DIMENSION) return MIN_DIMENSION;
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

    private double parseFactor(String val) {
        if (val == null || val.isBlank()) return 1.0;
        try {
            return Double.parseDouble(val);
        } catch (NumberFormatException e) {
            return 1.0;
        }
    }
}
