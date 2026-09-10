package com.imagevio;

import com.imagevio.service.TokenService;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class TokenServiceTest {

    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        tokenService = new TokenService();
        ReflectionTestUtils.setField(
                tokenService,
                "jwtSecret",
                "ImgevioSuperSecureSecretKeyThatIsAtLeast256BitsLongForProductionSecurityHS256!!"
        );
        ReflectionTestUtils.setField(tokenService, "jwtExpiration", 86400000L);
    }

    @Test
    void testGenerateAndValidateToken() {
        String sessionId = "sess-123456";
        String userId = "user-789";

        String token = tokenService.generateSessionToken(sessionId, userId);
        assertNotNull(token);
        assertFalse(token.isBlank());

        Claims claims = tokenService.validateToken(token);
        assertEquals(sessionId, claims.getSubject());
        assertEquals(userId, claims.get("user_id"));
        assertEquals("image:edit", claims.get("scope"));
        assertEquals("imgevio-backend", claims.getIssuer());
    }

    @Test
    void testIsTokenValidSuccess() {
        String sessionId = "sess-abc-xyz";
        String token = tokenService.generateSessionToken(sessionId, "user-1");

        assertTrue(tokenService.isTokenValid(token, sessionId));
        assertFalse(tokenService.isTokenValid(token, "different-session-id"));
    }

    @Test
    void testInvalidTokenRejected() {
        assertFalse(tokenService.isTokenValid("invalid.jwt.token", "sess-123"));
        assertFalse(tokenService.isTokenValid("", "sess-123"));
        assertFalse(tokenService.isTokenValid(null, "sess-123"));
    }
}
