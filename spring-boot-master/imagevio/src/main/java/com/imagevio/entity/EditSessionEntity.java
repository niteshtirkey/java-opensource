package com.imagevio.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "edit_sessions")
public class EditSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sessionId;

    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(nullable = false)
    private String status; // active, blocked

    @Column(columnDefinition = "TEXT")
    private String operationsJson;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public EditSessionEntity() {
        this.createdAt = LocalDateTime.now();
    }

    public EditSessionEntity(String sessionId, String prompt, String status, String operationsJson) {
        this.sessionId = sessionId;
        this.prompt = prompt;
        this.status = status;
        this.operationsJson = operationsJson;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOperationsJson() {
        return operationsJson;
    }

    public void setOperationsJson(String operationsJson) {
        this.operationsJson = operationsJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
