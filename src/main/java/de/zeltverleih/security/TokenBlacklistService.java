package de.zeltverleih.security;

import de.zeltverleih.model.datenbank.RevokedToken;
import de.zeltverleih.repository.RevokedTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class TokenBlacklistService {

    private final RevokedTokenRepository repository;
    private final JwtService jwtService;

    public TokenBlacklistService(RevokedTokenRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    @Transactional
    public void revoke(String token) {
        if (!jwtService.isValid(token)) {
            return;
        }
        String jti = jwtService.extractJti(token);
        if (repository.existsByJti(jti)) {
            return;
        }
        Instant expiresAt = jwtService.extractExpiration(token);
        repository.save(new RevokedToken(jti, expiresAt));
    }

    public boolean isRevoked(String token) {
        if (!jwtService.isValid(token)) {
            return true;
        }
        return repository.existsByJti(jwtService.extractJti(token));
    }

    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void cleanupExpired() {
        repository.deleteByExpiresAtBefore(Instant.now());
    }
}
