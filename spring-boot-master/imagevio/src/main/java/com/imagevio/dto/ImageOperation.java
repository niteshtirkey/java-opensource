package com.imagevio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ImageOperation {

    @JsonProperty("sequence_id")
    private int sequenceId;

    @JsonProperty("action_type")
    private String actionType;

    @JsonProperty("parameters")
    private OperationParameters parameters;

    public ImageOperation() {
        this.parameters = new OperationParameters();
    }

    public ImageOperation(int sequenceId, String actionType, OperationParameters parameters) {
        this.sequenceId = sequenceId;
        this.actionType = actionType;
        this.parameters = parameters != null ? parameters : new OperationParameters();
    }

    public int getSequenceId() {
        return sequenceId;
    }

    public void setSequenceId(int sequenceId) {
        this.sequenceId = sequenceId;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public OperationParameters getParameters() {
        return parameters;
    }

    public void setParameters(OperationParameters parameters) {
        this.parameters = parameters;
    }
}
