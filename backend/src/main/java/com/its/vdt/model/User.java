package com.its.vdt.model;

import java.time.Instant;
import java.util.Set;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class User {

    private String id;

    private String email;
    private String passwordHash;
    private Set<String> roles;
    private Instant createdAt;
}

