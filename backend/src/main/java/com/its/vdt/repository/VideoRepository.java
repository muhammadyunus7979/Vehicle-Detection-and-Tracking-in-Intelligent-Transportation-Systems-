package com.its.vdt.repository;

import java.util.List;
import java.util.Optional;

import com.its.vdt.model.Video;

public interface VideoRepository {

    Optional<Video> findById(String id);

    List<Video> findByUserId(String userId);

    Video save(Video video);
}

