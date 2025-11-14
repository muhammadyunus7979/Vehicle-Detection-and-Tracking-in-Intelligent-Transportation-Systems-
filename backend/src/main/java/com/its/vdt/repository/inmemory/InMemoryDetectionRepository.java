package com.its.vdt.repository.inmemory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.its.vdt.model.Detection;
import com.its.vdt.repository.DetectionRepository;
import com.its.vdt.repository.FrameRepository;

class InMemoryDetectionRepository extends BaseInMemoryRepo<Detection> implements DetectionRepository {

    private final FrameRepository frameRepository;

    InMemoryDetectionRepository(FrameRepository frameRepository) {
        this.frameRepository = frameRepository;
    }

    @Override
    public Optional<Detection> findById(String id) {
        return super.findById(id);
    }

    @Override
    public List<Detection> findByFrameIdIn(List<String> frameIds) {
        return storage.values().stream()
                .filter(d -> frameIds.contains(d.getFrameId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Detection> saveAll(List<Detection> detections) {
        detections.forEach(d -> {
            String id = ensureId(d.getId());
            d.setId(id);
            storage.put(id, d);
        });
        return detections;
    }

    @Override
    public List<Detection> findByVideoId(String videoId) {
        List<String> frameIds = frameRepository.findByVideoIdOrderByFrameIdxAsc(videoId).stream()
                .map(f -> f.getId())
                .collect(Collectors.toList());
        return findByFrameIdIn(frameIds);
    }
}


