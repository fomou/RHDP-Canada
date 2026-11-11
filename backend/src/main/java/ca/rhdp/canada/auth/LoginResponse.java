package ca.rhdp.canada.auth;

public record LoginResponse(String accessToken, String tokenType, long expiresIn) {}
