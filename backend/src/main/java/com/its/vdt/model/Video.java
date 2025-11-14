package com.its.vdt.model;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Video {

    private String id;

    private String userId;
    private String title;
    private String sourceUrl;
    private String storagePath;
    private Instant uploadedAt;
    private Double duration;
    private Integer fpsTarget;
    private VideoStatus status;

    public enum VideoStatus {
        QUEUED,
        PROCESSING,
        COMPLETED,
        FAILED
    }
}

