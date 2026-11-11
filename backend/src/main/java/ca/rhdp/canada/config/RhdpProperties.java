package ca.rhdp.canada.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rhdp")
public class RhdpProperties {

  private String corsAllowedOrigins = "http://localhost:3000";
  private final Jwt jwt = new Jwt();
  private final Stripe stripe = new Stripe();
  private final DemoUser demoUser = new DemoUser();

  public String getCorsAllowedOrigins() {
    return corsAllowedOrigins;
  }

  public void setCorsAllowedOrigins(String corsAllowedOrigins) {
    this.corsAllowedOrigins = corsAllowedOrigins;
  }

  public Jwt getJwt() {
    return jwt;
  }

  public Stripe getStripe() {
    return stripe;
  }

  public DemoUser getDemoUser() {
    return demoUser;
  }

  public static class Jwt {

    private String secret = "";
    private long expirationSeconds = 3600;

    public String getSecret() {
      return secret;
    }

    public void setSecret(String secret) {
      this.secret = secret == null ? "" : secret;
    }

    public long getExpirationSeconds() {
      return expirationSeconds;
    }

    public void setExpirationSeconds(long expirationSeconds) {
      this.expirationSeconds = expirationSeconds;
    }
  }

  public static class Stripe {

    private String secretKey = "";

    public String getSecretKey() {
      return secretKey;
    }

    public void setSecretKey(String secretKey) {
      this.secretKey = secretKey == null ? "" : secretKey;
    }
  }

  public static class DemoUser {

    private String email = "";
    private String password = "";
    private String displayName = "Membre démo";

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email == null ? "" : email;
    }

    public String getPassword() {
      return password;
    }

    public void setPassword(String password) {
      this.password = password == null ? "" : password;
    }

    public String getDisplayName() {
      return displayName;
    }

    public void setDisplayName(String displayName) {
      this.displayName = displayName == null || displayName.isBlank() ? "Membre démo" : displayName;
    }
  }
}
