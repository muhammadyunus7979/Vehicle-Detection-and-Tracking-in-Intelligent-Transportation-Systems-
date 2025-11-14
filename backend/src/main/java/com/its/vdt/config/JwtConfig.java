package com.its.vdt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expiration:3600}")
    private long expirationSeconds;

    public String secret() {
        return secret;
    }

    public long expirationSeconds() {
        return expirationSeconds;
    }
}

