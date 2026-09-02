package com.imagevio.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class SessionInitResponse {

    @JsonProperty("session_id")
    private String sessionId;

    @JsonProperty("session_token")
    private String sessionToken;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("capabilities")
    private Map<String, Object> capabilities;

    public SessionInitResponse() {
    }

    public SessionInitResponse(String sessionId, String sessionToken, String imageUrl, Map<String, Object> capabilities) {
        this.sessionId = sessionId;
        this.sessionToken = sessionToken;
        this.imageUrl = imageUrl;
        this.capabilities = capabilities;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Map<String, Object> getCapabilities() {
        return capabilities;
    }

    public void setCapabilities(Map<String, Object> capabilities) {
        this.capabilities = capabilities;
    }
}
