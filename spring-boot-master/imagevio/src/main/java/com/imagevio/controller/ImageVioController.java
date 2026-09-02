package com.imagevio.controller;

import com.imagevio.dto.ImageEditResponse;
import com.imagevio.dto.PromptRequest;
import com.imagevio.service.ImageVioNlpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/imagevio")
public class ImageVioController {

    private final ImageVioNlpService nlpService;

    public ImageVioController(ImageVioNlpService nlpService) {
        this.nlpService = nlpService;
    }

    @PostMapping("/parse")
    public ResponseEntity<ImageEditResponse> parseInstruction(@RequestBody PromptRequest request) {
        ImageEditResponse response = nlpService.processPrompt(request != null ? request.getPrompt() : null);
        return ResponseEntity.ok(response);
    }
}
