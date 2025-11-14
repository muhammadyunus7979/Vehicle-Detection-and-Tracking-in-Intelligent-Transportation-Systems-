package com.its.vdt.repository.inmemory;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.its.vdt.model.Video;
import com.its.vdt.repository.VideoRepository;

class InMemoryVideoRepository extends BaseInMemoryRepo<Video> implements VideoRepository {

    @Override
    public Optional<Video> findById(String id) {
        return super.findById(id);
    }

    @Override
    public List<Video> findByUserId(String userId) {
        return storage.values().stream().filter(v -> userId.equals(v.getUserId())).collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public Video save(Video video) {
        String id = ensureId(video.getId());
        video.setId(id);
        storage.put(id, video);
        return video;
    }
}


