package ca.rhdp.canada.payment;

public record PaymentIntentResponse(
    String mode,
    long amount,
    String currency,
    String status,
    String paymentIntentId,
    String clientSecret) {}
