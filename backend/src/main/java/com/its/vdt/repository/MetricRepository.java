package com.its.vdt.repository;

import java.util.Optional;

import com.its.vdt.model.Metric;

public interface MetricRepository {

    Optional<Metric> findById(String id);

    Optional<Metric> findByVideoId(String videoId);

    Metric save(Metric metric);
}

