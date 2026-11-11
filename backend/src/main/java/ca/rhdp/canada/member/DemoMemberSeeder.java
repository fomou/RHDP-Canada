package ca.rhdp.canada.member;

import ca.rhdp.canada.config.RhdpProperties;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoMemberSeeder implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(DemoMemberSeeder.class);

  private final MemberRepository members;
  private final PasswordEncoder passwordEncoder;
  private final RhdpProperties properties;

  public DemoMemberSeeder(
      MemberRepository members, PasswordEncoder passwordEncoder, RhdpProperties properties) {
    this.members = members;
    this.passwordEncoder = passwordEncoder;
    this.properties = properties;
  }

  @Override
  public void run(String... args) {
    String email = properties.getDemoUser().getEmail().trim();
    String password = properties.getDemoUser().getPassword();
    if (email.isEmpty() || password.isBlank()) {
      log.info("Demo member seed skipped. Set DEMO_USER_EMAIL and DEMO_USER_PASSWORD to enable it.");
      return;
    }
    if (members.existsByEmailIgnoreCase(email)) {
      return;
    }
    members.save(
        new Member(
            email.toLowerCase(Locale.ROOT),
            properties.getDemoUser().getDisplayName(),
            passwordEncoder.encode(password)));
    log.info("Seeded demo member {}", email.toLowerCase(Locale.ROOT));
  }
}
