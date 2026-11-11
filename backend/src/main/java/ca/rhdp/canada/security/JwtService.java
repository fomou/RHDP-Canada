package ca.rhdp.canada.security;

import ca.rhdp.canada.config.RhdpProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

  private final RhdpProperties properties;

  public JwtService(RhdpProperties properties) {
    this.properties = properties;
  }

  public String generateAccessToken(String email) {
    Instant now = Instant.now();
    long seconds = properties.getJwt().getExpirationSeconds();
    return Jwts.builder()
        .subject(email)
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plusSeconds(seconds)))
        .signWith(signingKey())
        .compact();
  }

  public String extractSubject(String token) {
    return Jwts.parser()
        .verifyWith(signingKey())
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();
  }

  public long expirationSeconds() {
    return properties.getJwt().getExpirationSeconds();
  }

  private SecretKey signingKey() {
    byte[] secret = properties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
    if (secret.length < 32) {
      throw new IllegalStateException("JWT_SECRET must be at least 32 bytes.");
    }
    return Keys.hmacShaKeyFor(secret);
  }
}
