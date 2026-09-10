package com.imagevio.service;

import com.imagevio.dto.ImageEditResponse;
import com.imagevio.dto.ImageOperation;
import com.imagevio.dto.OperationParameters;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Enterprise-grade Natural Language Processing Service for Imgevio Studio.
 * Converts conversational, descriptive, and technical prompts into structured
 * image editing pipelines with deterministic execution guarantees.
 */
@Service
public class ImageVioNlpService {

    private final SecurityGuardrailService securityGuardrailService;

    // Allowed action types
    public static final Set<String> WHITELISTED_ACTIONS = Set.of(
            "resize", "crop", "filter", "rotate", "adjust_brightness",
            "color_adjust", "add_text", "add_shape", "add_sticker", "apply_overlay", "flip"
    );

    private static final int MIN_DIMENSION = 1;
    private static final int MAX_DIMENSION = 4096;
    private static final int MIN_ROTATION = -360;
    private static final int MAX_ROTATION = 360;

    // --- Regex Patterns for Explicit & Conversational Commands ---

    private static final Pattern RESIZE_PATTERN = Pattern.compile(
            "(?:resize|scale|dimensions?|make\\s+it)\\s+(?:to\\s+)?(\\d+)\\s*(?:x|by|\\*|,)?\\s*(\\d+)?", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern SOCIAL_PRESET_PATTERN = Pattern.compile(
            "(?:resize\\s+for\\s+|make\\s+it\\s+|set\\s+canvas\\s+to\\s+)?(instagram\\s+post|instagram\\s+story|reels|tiktok|youtube\\s+thumbnail|youtube|cinematic\\s+wide|cinema)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CROP_DIM_PATTERN = Pattern.compile(
            "crop\\s+(?:to\\s+)?(\\d+)\\s*(?:x|by|\\*|,)?\\s*(\\d+)?", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CROP_SHAPE_PATTERN = Pattern.compile(
            "(?:crop\\s+(?:to\\s+)?(?:a\\s+)?(square|circle|avatar|rectangle|1:1|16:9|4:3))", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern ROTATE_EXPLICIT_PATTERN = Pattern.compile(
            "rotate\\s+(?:by\\s+)?(-?\\d+)(?:\\s*deg(?:rees?)?)?", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern ROTATE_CONVERSATIONAL_PATTERN = Pattern.compile(
            "(?:rotate|turn)\\s+(clockwise|counter[\\s-]?clockwise|left|right|upside[\\s-]?down)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern BRIGHTNESS_EXPLICIT_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?brightness\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern BRIGHTNESS_CONVERSATIONAL_PATTERN = Pattern.compile(
            "(?:make\\s+it\\s+|increase\\s+|decrease\\s+|reduce\\s+|add\\s+)?(brighter|darker|more\\s+bright|less\\s+bright|more\\s+light|dim)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CONTRAST_EXPLICIT_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?contrast\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern CONTRAST_CONVERSATIONAL_PATTERN = Pattern.compile(
            "(?:make\\s+it\\s+|increase\\s+|decrease\\s+|reduce\\s+|add\\s+)?(high\\s+contrast|more\\s+contrast|punchy|low\\s+contrast|less\\s+contrast|soften)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern SATURATION_EXPLICIT_PATTERN = Pattern.compile(
            "(?:adjust\\s+)?saturation\\s+(?:to\\s+|by\\s+)?([+-]?\\d*(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern SATURATION_CONVERSATIONAL_PATTERN = Pattern.compile(
            "(?:make\\s+it\\s+|increase\\s+|decrease\\s+|reduce\\s+|add\\s+)?(vibrant|more\\s+vibrant|more\\s+color|saturate|desaturate|less\\s+color|muted\\s+colors?)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern TEXT_PATTERN = Pattern.compile(
            "(?:add|insert|write)\\s+text\\s+[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern SHAPE_PATTERN = Pattern.compile(
            "(?:add|draw|insert)\\s+(?:a\\s+)?(rectangle|circle|star|triangle|line|box)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern STICKER_PATTERN = Pattern.compile(
            "(?:add|insert|place)\\s+(?:a\\s+)?(?:sticker\\s+)?(neon\\s+heart|golden\\s+crown|crown|verified\\s+badge|verified|sparkle\\s+star|sparkle|fire\\s+flame|fire|cyber\\s+badge|polaroid\\s+frame)(?:\\s+sticker)?", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern OVERLAY_PATTERN = Pattern.compile(
            "(?:apply|add)\\s+(?:overlay\\s+([a-zA-Z0-9_-]+)|(golden\\s+hour|film\\s+dust|cyber\\s+glitch|prism\\s+rainbow)(?:\\s+overlay|\\s+effect)?)", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern FLIP_PATTERN = Pattern.compile(
            "(?:flip|mirror)\\s*(horizontally|vertically|horizontal|vertical|upside\\s+down)?", Pattern.CASE_INSENSITIVE
    );

    private static final Pattern FILTER_PATTERN = Pattern.compile(
            "(?:apply\\s+|convert\\s+to\\s+|make\\s+it\\s+|turn\\s+to\\s+|add\\s+)?(?:filter\\s+([a-zA-Z0-9_-]+)|(grayscale|sepia|vintage|blur|sharpen|invert|black_and_white|black\\s+and\\s+white|b&w|oil_painting|pencil_sketch|pop_art|comic|neon|vignette|glitch|pixelate)(?:\\s+filter|\\s+look|\\s+effect|\\s+tone)?)", Pattern.CASE_INSENSITIVE
    );

    public ImageVioNlpService(SecurityGuardrailService securityGuardrailService) {
        this.securityGuardrailService = securityGuardrailService;
    }

    /**
     * Processes a natural language prompt and compiles it into sequential ImageOperations.
     */
    public ImageEditResponse processPrompt(String prompt) {
        if (prompt == null || prompt.isBlank()) {
            return ImageEditResponse.active(Collections.emptyList());
        }

        if (!securityGuardrailService.isSafe(prompt)) {
            return ImageEditResponse.blocked();
        }

        List<ImageOperation> operations = new ArrayList<>();
        int sequenceCounter = 1;

        // Split on standard conversational conjunctions and delimiters
        String[] steps = prompt.split("(?i)\\s+(?:and\\s+then|then|and|plus|with)\\s+|[,;\\n]+");

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

    /**
     * Parses an individual clause into a concrete ImageOperation DTO.
     */
    private ImageOperation parseStep(String stepText, int sequenceId) {
        // 1. Social Media Presets
        Matcher socialMatcher = SOCIAL_PRESET_PATTERN.matcher(stepText);
        if (socialMatcher.find()) {
            String match = socialMatcher.group(1).toLowerCase();
            OperationParameters params = new OperationParameters();
            if (match.contains("post")) {
                params.setTargetWidth(1080); params.setTargetHeight(1080);
            } else if (match.contains("story") || match.contains("reels") || match.contains("tiktok")) {
                params.setTargetWidth(1080); params.setTargetHeight(1920);
            } else if (match.contains("youtube")) {
                params.setTargetWidth(1280); params.setTargetHeight(720);
            } else if (match.contains("cinema")) {
                params.setTargetWidth(1920); params.setTargetHeight(816);
            }
            if (params.getTargetWidth() > 0) {
                return new ImageOperation(sequenceId, "resize", params);
            }
        }

        // 2. Resize
        Matcher resizeMatcher = RESIZE_PATTERN.matcher(stepText);
        if (resizeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(resizeMatcher.group(1));
            int h = resizeMatcher.group(2) != null ? parseBoundedDimension(resizeMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "resize", params);
        }

        // 3. Crop by dimensions
        Matcher cropDimMatcher = CROP_DIM_PATTERN.matcher(stepText);
        if (cropDimMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int w = parseBoundedDimension(cropDimMatcher.group(1));
            int h = cropDimMatcher.group(2) != null ? parseBoundedDimension(cropDimMatcher.group(2)) : w;
            params.setTargetWidth(w);
            params.setTargetHeight(h);
            return new ImageOperation(sequenceId, "crop", params);
        }

        // 4. Crop by shape / aspect ratio
        Matcher cropShapeMatcher = CROP_SHAPE_PATTERN.matcher(stepText);
        if (cropShapeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String shape = cropShapeMatcher.group(1).toLowerCase();
            params.setShapeType(shape.contains("circle") || shape.contains("avatar") ? "circle" : "rectangle");
            return new ImageOperation(sequenceId, "crop", params);
        }

        // 5. Rotation (Explicit degrees)
        Matcher rotateMatcher = ROTATE_EXPLICIT_PATTERN.matcher(stepText);
        if (rotateMatcher.find()) {
            OperationParameters params = new OperationParameters();
            int deg = parseBoundedRotation(rotateMatcher.group(1));
            params.setRotationDegrees(deg);
            return new ImageOperation(sequenceId, "rotate", params);
        }

        // 6. Rotation (Conversational)
        Matcher rotateConvMatcher = ROTATE_CONVERSATIONAL_PATTERN.matcher(stepText);
        if (rotateConvMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String dir = rotateConvMatcher.group(1).toLowerCase();
            int deg = 90;
            if (dir.contains("counter") || dir.contains("left")) deg = -90;
            if (dir.contains("upside")) deg = 180;
            params.setRotationDegrees(deg);
            return new ImageOperation(sequenceId, "rotate", params);
        }

        // 7. Brightness (Explicit number)
        Matcher brightnessMatcher = BRIGHTNESS_EXPLICIT_PATTERN.matcher(stepText);
        if (brightnessMatcher.find() && brightnessMatcher.group(1) != null && !brightnessMatcher.group(1).isBlank()) {
            OperationParameters params = new OperationParameters();
            double intensity = parseFactor(brightnessMatcher.group(1));
            params.setIntensityLevel(intensity);
            return new ImageOperation(sequenceId, "adjust_brightness", params);
        }

        // 8. Brightness (Conversational)
        Matcher brightnessConvMatcher = BRIGHTNESS_CONVERSATIONAL_PATTERN.matcher(stepText);
        if (brightnessConvMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String phrase = brightnessConvMatcher.group(1).toLowerCase();
            double val = (phrase.contains("dark") || phrase.contains("less") || phrase.contains("dim")) ? 0.8 : 1.25;
            params.setIntensityLevel(val);
            return new ImageOperation(sequenceId, "adjust_brightness", params);
        }

        // 9. Contrast (Explicit number)
        Matcher contrastMatcher = CONTRAST_EXPLICIT_PATTERN.matcher(stepText);
        if (contrastMatcher.find() && contrastMatcher.group(1) != null && !contrastMatcher.group(1).isBlank()) {
            OperationParameters params = new OperationParameters();
            double c = parseFactor(contrastMatcher.group(1));
            params.setContrast(c);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // 10. Contrast (Conversational)
        Matcher contrastConvMatcher = CONTRAST_CONVERSATIONAL_PATTERN.matcher(stepText);
        if (contrastConvMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String phrase = contrastConvMatcher.group(1).toLowerCase();
            double c = (phrase.contains("high") || phrase.contains("more") || phrase.contains("punchy")) ? 1.3 : 0.8;
            params.setContrast(c);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // 11. Saturation (Explicit number)
        Matcher satMatcher = SATURATION_EXPLICIT_PATTERN.matcher(stepText);
        if (satMatcher.find() && satMatcher.group(1) != null && !satMatcher.group(1).isBlank()) {
            OperationParameters params = new OperationParameters();
            double s = parseFactor(satMatcher.group(1));
            params.setSaturation(s);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // 12. Saturation (Conversational)
        Matcher satConvMatcher = SATURATION_CONVERSATIONAL_PATTERN.matcher(stepText);
        if (satConvMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String phrase = satConvMatcher.group(1).toLowerCase();
            double s = (phrase.contains("vibrant") || phrase.contains("more") || phrase.contains("saturate")) ? 1.35 : 0.65;
            params.setSaturation(s);
            return new ImageOperation(sequenceId, "color_adjust", params);
        }

        // 13. Add Text
        Matcher textMatcher = TEXT_PATTERN.matcher(stepText);
        if (textMatcher.find()) {
            OperationParameters params = new OperationParameters();
            params.setText(textMatcher.group(1));
            return new ImageOperation(sequenceId, "add_text", params);
        }

        // 14. Add Shape
        Matcher shapeMatcher = SHAPE_PATTERN.matcher(stepText);
        if (shapeMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String shape = shapeMatcher.group(1).toLowerCase();
            if (shape.equals("box")) shape = "rectangle";
            params.setShapeType(shape);
            return new ImageOperation(sequenceId, "add_shape", params);
        }

        // 15. Add Procedural Stickers
        Matcher stickerMatcher = STICKER_PATTERN.matcher(stepText);
        if (stickerMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String key = stickerMatcher.group(1).toLowerCase().replace(" ", "_");
            params.setStickerKey(key);
            return new ImageOperation(sequenceId, "add_sticker", params);
        }

        // 16. Apply Atmospheric Overlays
        Matcher overlayMatcher = OVERLAY_PATTERN.matcher(stepText);
        if (overlayMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String eff = overlayMatcher.group(1) != null ? overlayMatcher.group(1) : overlayMatcher.group(2);
            if (eff != null) {
                params.setOverlayEffect(eff.toLowerCase().replace(" ", "_"));
                return new ImageOperation(sequenceId, "apply_overlay", params);
            }
        }

        // 17. Flip / Mirror
        Matcher flipMatcher = FLIP_PATTERN.matcher(stepText);
        if (flipMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String dir = flipMatcher.group(1) != null ? flipMatcher.group(1).toLowerCase() : "horizontal";
            if (dir.startsWith("h") || dir.equals("mirror")) params.setFlipHorizontal(true);
            if (dir.startsWith("v") || dir.contains("upside")) params.setFlipVertical(true);
            return new ImageOperation(sequenceId, "flip", params);
        }

        // 18. Filters (Named, Conversational & Synonyms)
        Matcher filterMatcher = FILTER_PATTERN.matcher(stepText);
        if (filterMatcher.find()) {
            OperationParameters params = new OperationParameters();
            String rawFilter = filterMatcher.group(1) != null ? filterMatcher.group(1) : filterMatcher.group(2);
            if (rawFilter != null) {
                String normalized = rawFilter.toLowerCase().replace(" ", "_").replace("&", "and");
                if (normalized.equals("b_and_w") || normalized.equals("bandw")) normalized = "black_and_white";
                params.setFilterName(normalized);
                return new ImageOperation(sequenceId, "filter", params);
            }
        }

        return null;
    }

    private int parseBoundedDimension(String val) {
        if (val == null) return 0;
        try {
            long parsed = Long.parseLong(val.trim());
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
            int deg = Integer.parseInt(val.trim());
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
            return Double.parseDouble(val.trim());
        } catch (NumberFormatException e) {
            return 1.0;
        }
    }
}
