package com.imagevio.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class TokenService {

    @Value("${security.jwt.secret:ImgevioSuperSecureSecretKeyThatIsAtLeast256BitsLongForProductionSecurityHS256!!}")
    private String jwtSecret;

    @Value("${security.jwt.expiration:86400000}")
    private long jwtExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateSessionToken(String sessionId, String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .issuer("imgevio-backend")
                .subject(sessionId)
                .claim("user_id", userId != null ? userId : "anonymous")
                .claim("scope", "image:edit")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token, String sessionId) {
        try {
            Claims claims = validateToken(token);
            return claims.getSubject().equals(sessionId) && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
