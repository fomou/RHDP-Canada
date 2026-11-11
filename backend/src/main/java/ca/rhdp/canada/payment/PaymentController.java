package ca.rhdp.canada.payment;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final PaymentIntentService payments;

  public PaymentController(PaymentIntentService payments) {
    this.payments = payments;
  }

  @PostMapping("/intent")
  public PaymentIntentResponse createMembershipIntent(@AuthenticationPrincipal String email) {
    return payments.createMembershipIntent(email);
  }
}
