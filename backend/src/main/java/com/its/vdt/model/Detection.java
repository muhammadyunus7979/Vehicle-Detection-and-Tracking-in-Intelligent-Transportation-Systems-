package com.its.vdt.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Detection {

    private String id;

    private String frameId;
    private String clazz;
    private double confidence;
    private BoundingBox bbox;
    private String trackId;
    private Double speedKph;

    @Data
    @Builder
    public static class BoundingBox {
        private double x;
        private double y;
        private double w;
        private double h;
    }
}

