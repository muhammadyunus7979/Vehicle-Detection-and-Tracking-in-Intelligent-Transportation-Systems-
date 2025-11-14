package com.its.vdt.repository.inmemory;

import java.util.Optional;

import com.its.vdt.model.Metric;
import com.its.vdt.repository.MetricRepository;

class InMemoryMetricRepository extends BaseInMemoryRepo<Metric> implements MetricRepository {

    @Override
    public Optional<Metric> findById(String id) {
        return super.findById(id);
    }

    @Override
    public Optional<Metric> findByVideoId(String videoId) {
        return storage.values().stream().filter(m -> videoId.equals(m.getVideoId())).findFirst();
    }

    @Override
    public Metric save(Metric metric) {
        String id = ensureId(metric.getId());
        metric.setId(id);
        storage.put(id, metric);
        return metric;
    }
}


