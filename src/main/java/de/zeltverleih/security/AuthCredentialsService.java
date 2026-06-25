package de.zeltverleih.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthCredentialsService {

    private final String username;
    private final String passwordHash;
    private final PasswordEncoder passwordEncoder;

    public AuthCredentialsService(
            @Value("${app.auth.username}") String username,
            @Value("${app.auth.password-hash:}") String passwordHash,
            @Value("${app.auth.password:}") String plainPassword,
            PasswordEncoder passwordEncoder) {
        this.username = username;
        this.passwordEncoder = passwordEncoder;

        if (passwordHash != null && !passwordHash.isBlank()) {
            this.passwordHash = passwordHash;
        } else if (plainPassword != null && !plainPassword.isBlank()) {
            this.passwordHash = passwordEncoder.encode(plainPassword);
        } else {
            throw new IllegalStateException(
                "Set AUTH_PASSWORD_HASH (empfohlen) oder AUTH_PASSWORD in den Umgebungsvariablen.");
        }
    }

    public boolean matches(String inputUsername, String inputPassword) {
        return username.equals(inputUsername) && passwordEncoder.matches(inputPassword, passwordHash);
    }
}
