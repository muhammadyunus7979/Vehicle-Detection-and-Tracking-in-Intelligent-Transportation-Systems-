package com.its.vdt.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VideoUploadRequest(
        @NotBlank String title,
        @NotBlank String sourceType,
        @NotNull Integer fpsTarget) {
}

