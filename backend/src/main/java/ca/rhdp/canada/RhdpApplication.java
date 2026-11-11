package ca.rhdp.canada;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class RhdpApplication {

  public static void main(String[] args) {
    SpringApplication.run(RhdpApplication.class, args);
  }
}
