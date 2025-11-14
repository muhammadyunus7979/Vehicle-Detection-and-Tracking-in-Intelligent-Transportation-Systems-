package com.its.vdt.dto;

import java.util.List;

public record AnalyticsResponse(
        Summary summary,
        List<TimeSeriesPoint> accuracySeries,
        List<TimeSeriesPoint> fpsSeries,
        List<TimeSeriesPoint> speedSeries,
        List<ClassCount> classDistribution) {

    public record Summary(
            double map50,
            double map5095,
            double precision,
            double recall,
            double avgFps,
            double avgLatencyMs,
            double avgSpeedKph,
            double maxSpeedKph,
            int totalVehicles) {
    }

    public record TimeSeriesPoint(String timestamp, double value) {
    }

    public record ClassCount(String clazz, long count) {
    }
}

