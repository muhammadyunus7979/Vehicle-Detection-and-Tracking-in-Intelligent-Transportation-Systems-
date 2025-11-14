package com.its.vdt.repository.inmemory;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.its.vdt.model.Frame;
import com.its.vdt.repository.FrameRepository;

class InMemoryFrameRepository extends BaseInMemoryRepo<Frame> implements FrameRepository {

    @Override
    public Optional<Frame> findById(String id) {
        return super.findById(id);
    }

    @Override
    public List<Frame> findByVideoIdOrderByFrameIdxAsc(String videoId) {
        return storage.values().stream()
                .filter(f -> videoId.equals(f.getVideoId()))
                .sorted(Comparator.comparingLong(Frame::getFrameIdx))
                .collect(Collectors.toList());
    }

    @Override
    public Frame save(Frame frame) {
        String id = ensureId(frame.getId());
        frame.setId(id);
        storage.put(id, frame);
        return frame;
    }
}


