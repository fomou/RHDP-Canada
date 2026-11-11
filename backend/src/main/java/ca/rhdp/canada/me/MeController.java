package ca.rhdp.canada.me;

import ca.rhdp.canada.member.MemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class MeController {

  private final MemberRepository members;

  public MeController(MemberRepository members) {
    this.members = members;
  }

  @GetMapping("/api/me")
  public MeResponse me(@AuthenticationPrincipal String email) {
    return members
        .findByEmailIgnoreCase(email)
        .map(member -> new MeResponse(member.getEmail(), member.getDisplayName()))
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
  }
}
