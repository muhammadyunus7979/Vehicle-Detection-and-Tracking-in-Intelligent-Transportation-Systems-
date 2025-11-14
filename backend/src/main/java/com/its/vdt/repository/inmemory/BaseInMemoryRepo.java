package com.its.vdt.repository.inmemory;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

abstract class BaseInMemoryRepo<T> {
    protected final Map<String, T> storage = new ConcurrentHashMap<>();

    protected String ensureId(String existingId) {
        return existingId != null && !existingId.isBlank() ? existingId : UUID.randomUUID().toString();
    }

    protected Optional<T> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }
}


