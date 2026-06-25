package de.zeltverleih.controller;

import de.zeltverleih.security.AuthCredentialsService;
import de.zeltverleih.security.JwtService;
import de.zeltverleih.security.LoginRateLimiter;
import de.zeltverleih.security.TokenBlacklistService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;
    private final AuthCredentialsService credentialsService;
    private final TokenBlacklistService tokenBlacklistService;
    private final LoginRateLimiter loginRateLimiter;

    public AuthController(
            JwtService jwtService,
            AuthCredentialsService credentialsService,
            TokenBlacklistService tokenBlacklistService,
            LoginRateLimiter loginRateLimiter) {
        this.jwtService = jwtService;
        this.credentialsService = credentialsService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.loginRateLimiter = loginRateLimiter;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        String clientKey = resolveClientKey(request);

        if (loginRateLimiter.isBlocked(clientKey)) {
            return ResponseEntity.status(429).body(Map.of(
                "error", "Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen."));
        }

        String inputUser = body.get("username");
        String inputPass = body.get("password");

        if (inputUser == null || inputPass == null || !credentialsService.matches(inputUser, inputPass)) {
            loginRateLimiter.recordFailure(clientKey);
            return ResponseEntity.status(401).body(Map.of("error", "Ungültige Anmeldedaten"));
        }

        loginRateLimiter.reset(clientKey);
        String token = jwtService.generateToken(inputUser);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokenBlacklistService.revoke(authHeader.substring(7));
        }
        return ResponseEntity.ok(Map.of("message", "Abgemeldet"));
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
