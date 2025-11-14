package com.its.vdt.security;

import java.time.Instant;
import java.util.Date;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.its.vdt.config.JwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private final JwtConfig jwtConfig;

    public String generateToken(String userId, String email, Set<String> roles) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(userId)
                .claim("email", email)
                .claim("roles", roles)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusSeconds(jwtConfig.expirationSeconds())))
                .signWith(Keys.hmacShaKeyFor(jwtConfig.secret().getBytes()))
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtConfig.secret().getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

