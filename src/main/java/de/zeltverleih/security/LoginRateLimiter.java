package de.zeltverleih.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private final int maxAttempts;
    private final long windowSeconds;
    private final Map<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    public LoginRateLimiter(
            @Value("${app.auth.login-max-attempts:5}") int maxAttempts,
            @Value("${app.auth.login-window-seconds:900}") long windowSeconds) {
        this.maxAttempts = maxAttempts;
        this.windowSeconds = windowSeconds;
    }

    public boolean isBlocked(String clientKey) {
        AttemptWindow window = attempts.get(clientKey);
        if (window == null) {
            return false;
        }
        window.pruneExpired(windowSeconds);
        return window.failures >= maxAttempts;
    }

    public void recordFailure(String clientKey) {
        attempts.compute(clientKey, (key, window) -> {
            AttemptWindow current = window != null ? window : new AttemptWindow();
            current.pruneExpired(windowSeconds);
            current.failures++;
            current.lastFailure = Instant.now();
            return current;
        });
    }

    public void reset(String clientKey) {
        attempts.remove(clientKey);
    }

    private static class AttemptWindow {
        int failures;
        Instant lastFailure = Instant.now();

        void pruneExpired(long windowSeconds) {
            if (lastFailure.plusSeconds(windowSeconds).isBefore(Instant.now())) {
                failures = 0;
            }
        }
    }
}
