package com.its.vdt.repository;

import java.util.Optional;

import com.its.vdt.model.User;

public interface UserRepository {

    Optional<User> findById(String id);

    Optional<User> findByEmail(String email);

    User save(User user);
}

