package com.imagevio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OperationParameters {

    @JsonProperty("target_width")
    private int targetWidth;

    @JsonProperty("target_height")
    private int targetHeight;

    @JsonProperty("filter_name")
    private String filterName = "";

    @JsonProperty("rotation_degrees")
    private int rotationDegrees;

    @JsonProperty("intensity_level")
    private double intensityLevel;

    // Advanced Editing Features
    @JsonProperty("contrast")
    private double contrast = 1.0;

    @JsonProperty("saturation")
    private double saturation = 1.0;

    @JsonProperty("text")
    private String text;

    @JsonProperty("font_size")
    private int fontSize = 24;

    @JsonProperty("text_color")
    private String textColor = "#ffffff";

    @JsonProperty("shape_type")
    private String shapeType; // rect, circle, star, line

    @JsonProperty("flip_horizontal")
    private boolean flipHorizontal;

    @JsonProperty("flip_vertical")
    private boolean flipVertical;

    public OperationParameters() {
    }

    public int getTargetWidth() {
        return targetWidth;
    }

    public void setTargetWidth(int targetWidth) {
        this.targetWidth = targetWidth;
    }

    public int getTargetHeight() {
        return targetHeight;
    }

    public void setTargetHeight(int targetHeight) {
        this.targetHeight = targetHeight;
    }

    public String getFilterName() {
        return filterName;
    }

    public void setFilterName(String filterName) {
        this.filterName = filterName != null ? filterName : "";
    }

    public int getRotationDegrees() {
        return rotationDegrees;
    }

    public void setRotationDegrees(int rotationDegrees) {
        this.rotationDegrees = rotationDegrees;
    }

    public double getIntensityLevel() {
        return intensityLevel;
    }

    public void setIntensityLevel(double intensityLevel) {
        this.intensityLevel = intensityLevel;
    }

    public double getContrast() {
        return contrast;
    }

    public void setContrast(double contrast) {
        this.contrast = contrast;
    }

    public double getSaturation() {
        return saturation;
    }

    public void setSaturation(double saturation) {
        this.saturation = saturation;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getFontSize() {
        return fontSize;
    }

    public void setFontSize(int fontSize) {
        this.fontSize = fontSize;
    }

    public String getTextColor() {
        return textColor;
    }

    public void setTextColor(String textColor) {
        this.textColor = textColor;
    }

    public String getShapeType() {
        return shapeType;
    }

    public void setShapeType(String shapeType) {
        this.shapeType = shapeType;
    }

    public boolean isFlipHorizontal() {
        return flipHorizontal;
    }

    public void setFlipHorizontal(boolean flipHorizontal) {
        this.flipHorizontal = flipHorizontal;
    }

    public boolean isFlipVertical() {
        return flipVertical;
    }

    public void setFlipVertical(boolean flipVertical) {
        this.flipVertical = flipVertical;
    }
}
