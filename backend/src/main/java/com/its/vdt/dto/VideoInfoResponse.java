package com.its.vdt.dto;

import java.time.Instant;

public record VideoInfoResponse(
        String videoId,
        String title,
        String videoUrl,
        String status,
        Instant uploadedAt,
        Double duration,
        Integer fpsTarget) {
}

