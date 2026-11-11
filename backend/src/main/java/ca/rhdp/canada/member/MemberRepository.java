package ca.rhdp.canada.member;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

  Optional<Member> findByEmailIgnoreCase(String email);

  boolean existsByEmailIgnoreCase(String email);
}
