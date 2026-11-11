package ca.rhdp.canada.auth;

import ca.rhdp.canada.member.Member;
import ca.rhdp.canada.member.MemberRepository;
import ca.rhdp.canada.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final MemberRepository members;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(
      MemberRepository members, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.members = members;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    Member member =
        members
            .findByEmailIgnoreCase(request.email())
            .orElseThrow(() -> new BadCredentialsException("Courriel ou mot de passe incorrect."));
    if (!passwordEncoder.matches(request.password(), member.getPasswordHash())) {
      throw new BadCredentialsException("Courriel ou mot de passe incorrect.");
    }
    return new LoginResponse(
        jwtService.generateAccessToken(member.getEmail()), "Bearer", jwtService.expirationSeconds());
  }
}
