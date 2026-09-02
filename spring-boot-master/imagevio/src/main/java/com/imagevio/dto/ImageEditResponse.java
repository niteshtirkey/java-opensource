package com.imagevio.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ImageEditResponse {

    @JsonProperty("session_status")
    private String sessionStatus;

    @JsonProperty("error_message")
    private String errorMessage;

    @JsonProperty("parsed_operations")
    private List<ImageOperation> parsedOperations;

    public ImageEditResponse() {
        this.parsedOperations = new ArrayList<>();
    }

    public ImageEditResponse(String sessionStatus, List<ImageOperation> parsedOperations) {
        this.sessionStatus = sessionStatus;
        this.parsedOperations = parsedOperations != null ? parsedOperations : new ArrayList<>();
    }

    public static ImageEditResponse blocked() {
        ImageEditResponse response = new ImageEditResponse();
        response.setSessionStatus("blocked");
        response.setErrorMessage("Invalid or unsafe command syntax detected. Please provide a standard image editing instruction.");
        response.setParsedOperations(new ArrayList<>());
        return response;
    }

    public static ImageEditResponse active(List<ImageOperation> operations) {
        return new ImageEditResponse("active", operations);
    }

    public String getSessionStatus() {
        return sessionStatus;
    }

    public void setSessionStatus(String sessionStatus) {
        this.sessionStatus = sessionStatus;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public List<ImageOperation> getParsedOperations() {
        return parsedOperations;
    }

    public void setParsedOperations(List<ImageOperation> parsedOperations) {
        this.parsedOperations = parsedOperations;
    }
}
