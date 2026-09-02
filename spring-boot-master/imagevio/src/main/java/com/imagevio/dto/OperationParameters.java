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
}
