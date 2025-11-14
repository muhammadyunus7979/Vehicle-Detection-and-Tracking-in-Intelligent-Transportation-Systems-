package com.its.vdt.model;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Metric {

    private String id;

    private String videoId;
    private double map50;
    private double map5095;
    private double precision;
    private double recall;
    private double avgFps;
    private double avgLatencyMs;
    private int totalVehicles;
    private Instant lastEvaluatedAt;
}

