package com.its.vdt.dto;

import java.time.Instant;
import java.util.List;

public record DetectionPayload(
        long frameIdx,
        Instant timestamp,
        List<Detection> detections,
        double fps,
        double latencyMs) {

    public record Detection(
            String id,
            String clazz,
            double confidence,
            double[] bbox,
            String trackId,
            Double speedKph) {
    }
}

