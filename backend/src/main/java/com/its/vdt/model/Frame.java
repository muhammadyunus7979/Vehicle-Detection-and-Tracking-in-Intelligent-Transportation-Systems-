package com.its.vdt.model;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Frame {

    private String id;

    private String videoId;
    private long frameIdx;
    private Instant timestamp;
    private String storagePath;
    private Instant processedAt;
}

