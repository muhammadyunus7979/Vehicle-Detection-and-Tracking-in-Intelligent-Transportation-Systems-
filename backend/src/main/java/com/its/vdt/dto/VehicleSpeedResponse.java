package com.its.vdt.dto;

import java.util.List;

public record VehicleSpeedResponse(
        List<SpeedData> speeds) {

    public record SpeedData(
            String trackId,
            String clazz,
            Double speedKph,
            Long frameIdx,
            String timestamp) {
    }
}

