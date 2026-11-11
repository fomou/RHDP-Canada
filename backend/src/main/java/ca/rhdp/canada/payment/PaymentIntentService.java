package ca.rhdp.canada.payment;

import ca.rhdp.canada.config.RhdpProperties;
import com.stripe.StripeClient;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PaymentIntentService {

  static final long MEMBERSHIP_AMOUNT_CENTS = 6000L;
  static final String CURRENCY = "cad";

  private final RhdpProperties properties;

  public PaymentIntentService(RhdpProperties properties) {
    this.properties = properties;
  }

  public PaymentIntentResponse createMembershipIntent(String memberEmail) {
    PaymentIntentCreateParams params =
        PaymentIntentCreateParams.builder()
            .setAmount(MEMBERSHIP_AMOUNT_CENTS)
            .setCurrency(CURRENCY)
            .setDescription("Adhésion RHDP Canada")
            .putMetadata("memberEmail", memberEmail)
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(true)
                    .build())
            .build();

    if (!stripeConfigured()) {
      return new PaymentIntentResponse(
          "stub", MEMBERSHIP_AMOUNT_CENTS, CURRENCY, "not_sent", null, null);
    }

    try {
      StripeClient client = new StripeClient(properties.getStripe().getSecretKey());
      PaymentIntent intent = client.v1().paymentIntents().create(params);
      return new PaymentIntentResponse(
          "stripe",
          MEMBERSHIP_AMOUNT_CENTS,
          CURRENCY,
          intent.getStatus(),
          intent.getId(),
          intent.getClientSecret());
    } catch (StripeException ex) {
      throw new ResponseStatusException(
          HttpStatus.BAD_GATEWAY, "Stripe a refusé la création du paiement.");
    }
  }

  private boolean stripeConfigured() {
    String key = properties.getStripe().getSecretKey();
    return key.startsWith("sk_") && !key.contains("replace_me") && key.length() >= 24;
  }
}
