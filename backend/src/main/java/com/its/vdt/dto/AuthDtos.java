package com.its.vdt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record LoginRequest(@Email String email, @NotBlank String password) {
    }

    public record RegisterRequest(@Email String email, @NotBlank String password) {
    }

    public record AuthResponse(String token, String userId, String email) {
    }
}

