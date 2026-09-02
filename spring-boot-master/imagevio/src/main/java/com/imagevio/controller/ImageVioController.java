package com.imagevio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.imagevio.dto.ImageEditResponse;
import com.imagevio.dto.PromptRequest;
import com.imagevio.entity.EditSessionEntity;
import com.imagevio.repository.EditSessionRepository;
import com.imagevio.service.ImageVioNlpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/imagevio")
public class ImageVioController {

    private final ImageVioNlpService nlpService;
    private final EditSessionRepository editSessionRepository;
    private final ObjectMapper objectMapper;

    public ImageVioController(ImageVioNlpService nlpService,
                              EditSessionRepository editSessionRepository,
                              ObjectMapper objectMapper) {
        this.nlpService = nlpService;
        this.editSessionRepository = editSessionRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/parse")
    public ResponseEntity<ImageEditResponse> parseInstruction(
            @RequestHeader(value = "X-Session-ID", required = false) String headerSessionId,
            @RequestBody PromptRequest request) {

        String prompt = request != null ? request.getPrompt() : null;
        ImageEditResponse response = nlpService.processPrompt(prompt);

        // Save session & operations history to PostgreSQL
        try {
            String sid = (headerSessionId != null && !headerSessionId.isBlank())
                    ? headerSessionId
                    : UUID.randomUUID().toString();

            String jsonPayload = objectMapper.writeValueAsString(response.getParsedOperations());
            EditSessionEntity sessionEntity = new EditSessionEntity(
                    sid,
                    prompt,
                    response.getSessionStatus(),
                    jsonPayload
            );
            editSessionRepository.save(sessionEntity);
        } catch (Exception e) {
            // Log persistence error without breaking user response
            System.err.println("Failed to persist session to DB: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
