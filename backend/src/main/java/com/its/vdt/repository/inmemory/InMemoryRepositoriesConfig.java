package com.its.vdt.repository.inmemory;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.its.vdt.repository.DetectionRepository;
import com.its.vdt.repository.FrameRepository;
import com.its.vdt.repository.MetricRepository;
import com.its.vdt.repository.UserRepository;
import com.its.vdt.repository.VideoRepository;

@Configuration
public class InMemoryRepositoriesConfig {

    @Bean
    public UserRepository userRepository() {
        return new InMemoryUserRepository();
    }

    @Bean
    public VideoRepository videoRepository() {
        return new InMemoryVideoRepository();
    }

    @Bean
    public FrameRepository frameRepository() {
        return new InMemoryFrameRepository();
    }

    @Bean
    public DetectionRepository detectionRepository(FrameRepository frameRepository) {
        return new InMemoryDetectionRepository(frameRepository);
    }

    @Bean
    public MetricRepository metricRepository() {
        return new InMemoryMetricRepository();
    }
}


