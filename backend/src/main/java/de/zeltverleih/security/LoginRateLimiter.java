package de.zeltverleih.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {

    private final int maxAttempts;
    private final long windowMs;

    private record AttemptRecord(int count, Instant windowStart) {}

    private final Map<String, AttemptRecord> attempts = new ConcurrentHashMap<>();

    public LoginRateLimiter(
            @Value("${app.rate-limit.max-attempts}") int maxAttempts,
            @Value("${app.rate-limit.window-minutes}") int windowMinutes
    ) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMinutes * 60_000L;
    }

    public boolean isBlocked(String clientIp) {
        AttemptRecord record = attempts.get(clientIp);
        if (record == null) return false;

        if (isExpired(record)) {
            attempts.remove(clientIp);
            return false;
        }

        return record.count() >= maxAttempts;
    }

    public void recordFailure(String clientIp) {
        attempts.compute(clientIp, (ip, existing) -> {
            if (existing == null || isExpired(existing)) {
                return new AttemptRecord(1, Instant.now());
            }
            return new AttemptRecord(existing.count() + 1, existing.windowStart());
        });
    }

    public void reset(String clientIp) {
        attempts.remove(clientIp);
    }

    private boolean isExpired(AttemptRecord record) {
        return Instant.now().toEpochMilli() - record.windowStart().toEpochMilli() > windowMs;
    }
}
