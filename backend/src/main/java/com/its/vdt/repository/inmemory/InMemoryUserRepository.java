package com.its.vdt.repository.inmemory;

import java.util.Optional;

import com.its.vdt.model.User;
import com.its.vdt.repository.UserRepository;

class InMemoryUserRepository extends BaseInMemoryRepo<User> implements UserRepository {

    @Override
    public Optional<User> findById(String id) {
        return super.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return storage.values().stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    @Override
    public User save(User user) {
        String id = ensureId(user.getId());
        user.setId(id);
        storage.put(id, user);
        return user;
    }
}


