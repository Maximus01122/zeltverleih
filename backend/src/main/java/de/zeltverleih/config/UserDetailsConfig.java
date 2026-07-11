package de.zeltverleih.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class UserDetailsConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(
            PasswordEncoder encoder,
            @Value("${app.auth.username}") String authUsername,
            @Value("${app.auth.password-hash:}") String passwordHash,
            @Value("${app.auth.password:}") String plainPassword) {
        String storedPassword;
        if (passwordHash != null && !passwordHash.isBlank()) {
            storedPassword = passwordHash.trim();
        } else if (plainPassword != null && !plainPassword.isBlank()) {
            storedPassword = encoder.encode(plainPassword);
        } else {
            throw new IllegalStateException(
                    "Set AUTH_PASSWORD_HASH (empfohlen) oder AUTH_PASSWORD in den Umgebungsvariablen.");
        }

        return new InMemoryUserDetailsManager(
                User.withUsername(authUsername)
                        .password(storedPassword)
                        .roles("ADMIN")
                        .build()
        );
    }
}
