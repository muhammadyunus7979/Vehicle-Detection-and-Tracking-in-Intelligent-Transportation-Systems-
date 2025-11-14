package com.its.vdt.repository;

import java.util.List;
import java.util.Optional;

import com.its.vdt.model.Frame;

public interface FrameRepository {

    Optional<Frame> findById(String id);

    List<Frame> findByVideoIdOrderByFrameIdxAsc(String videoId);

    Frame save(Frame frame);
}

