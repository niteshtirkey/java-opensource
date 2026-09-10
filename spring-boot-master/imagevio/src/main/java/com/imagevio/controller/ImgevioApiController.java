package com.imagevio.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.imagevio.dto.ImageEditResponse;
import com.imagevio.dto.ImageOperation;
import com.imagevio.dto.PromptRequest;
import com.imagevio.dto.SessionInitResponse;
import com.imagevio.entity.EditSessionEntity;
import com.imagevio.repository.EditSessionRepository;
import com.imagevio.service.ImageVioNlpService;
import com.imagevio.service.TokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST API Gateway Controller for Imgevio Studio.
 * Handles session lifecycles, NLP command compilation, and state hydration.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000"}, allowCredentials = "true")
public class ImgevioApiController {

    private static final Logger log = LoggerFactory.getLogger(ImgevioApiController.class);

    private final ImageVioNlpService nlpService;
    private final EditSessionRepository editSessionRepository;
    private final TokenService tokenService;
    private final ObjectMapper objectMapper;

    public ImgevioApiController(ImageVioNlpService nlpService,
                                EditSessionRepository editSessionRepository,
                                TokenService tokenService,
                                ObjectMapper objectMapper) {
        this.nlpService = nlpService;
        this.editSessionRepository = editSessionRepository;
        this.tokenService = tokenService;
        this.objectMapper = objectMapper;
    }

    /**
     * Session Initialization Endpoint: POST /api/sessions/init
     */
    @PostMapping("/sessions/init")
    public ResponseEntity<SessionInitResponse> initSession(@RequestBody(required = false) Map<String, String> body) {
        String sessionId = (body != null && body.containsKey("sessionId") && !body.get("sessionId").isBlank())
                ? body.get("sessionId")
                : UUID.randomUUID().toString();

        String token = tokenService.generateSessionToken(sessionId, "user-" + UUID.randomUUID().toString().substring(0, 8));

        Map<String, Object> capabilities = Map.of(
                "max_dimension", 4096,
                "max_operations", 500,
                "supported_actions", ImageVioNlpService.WHITELISTED_ACTIONS,
                "version", "2.0"
        );

        SessionInitResponse response = new SessionInitResponse(
                sessionId,
                token,
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
                capabilities
        );

        return ResponseEntity.ok()
                .header("X-CSRF-Token", UUID.randomUUID().toString())
                .body(response);
    }

    /**
     * NLP Intent Parsing Endpoint: POST /api/parse/command & POST /api/v1/imagevio/parse
     */
    @PostMapping({"/parse/command", "/v1/imagevio/parse"})
    public ResponseEntity<ImageEditResponse> parseCommand(
            @RequestHeader(value = "X-Session-ID", required = false) String headerSessionId,
            @RequestBody PromptRequest request) {

        String prompt = request != null ? request.getPrompt() : null;
        ImageEditResponse response = nlpService.processPrompt(prompt);

        try {
            String sid = (headerSessionId != null && !headerSessionId.isBlank())
                    ? headerSessionId
                    : UUID.randomUUID().toString();

            String jsonPayload = objectMapper.writeValueAsString(response.getParsedOperations());
            
            EditSessionEntity sessionEntity = editSessionRepository.findBySessionId(sid).orElse(null);
            if (sessionEntity == null) {
                sessionEntity = new EditSessionEntity(
                        sid,
                        prompt,
                        response.getSessionStatus(),
                        jsonPayload
                );
            } else {
                sessionEntity.setPrompt(prompt);
                sessionEntity.setStatus(response.getSessionStatus());
                sessionEntity.setOperationsJson(jsonPayload);
            }
            
            editSessionRepository.save(sessionEntity);
        } catch (Exception e) {
            log.error("Failed to persist session to database: {}", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Session Retrieval & Hydration Endpoint: GET /api/sessions/{sessionId}
     */
    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<?> getSession(@PathVariable String sessionId) {
        return editSessionRepository.findBySessionId(sessionId)
                .map(s -> {
                    List<ImageOperation> ops = Collections.emptyList();
                    try {
                        if (s.getOperationsJson() != null && !s.getOperationsJson().isBlank()) {
                            ops = objectMapper.readValue(s.getOperationsJson(), new TypeReference<List<ImageOperation>>() {});
                        }
                    } catch (Exception e) {
                        log.warn("Failed to deserialize operations for session {}: {}", sessionId, e.getMessage());
                    }

                    return ResponseEntity.ok(Map.of(
                            "sessionId", s.getSessionId(),
                            "status", s.getStatus(),
                            "prompt", s.getPrompt() != null ? s.getPrompt() : "",
                            "operations", ops,
                            "createdAt", s.getCreatedAt() != null ? s.getCreatedAt().toString() : ""
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

