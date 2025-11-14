package com.its.vdt.repository;

import java.util.List;
import java.util.Optional;

import com.its.vdt.model.Detection;

public interface DetectionRepository {

    Optional<Detection> findById(String id);

    List<Detection> findByFrameIdIn(List<String> frameIds);

    List<Detection> saveAll(List<Detection> detections);

    List<Detection> findByVideoId(String videoId);
}

