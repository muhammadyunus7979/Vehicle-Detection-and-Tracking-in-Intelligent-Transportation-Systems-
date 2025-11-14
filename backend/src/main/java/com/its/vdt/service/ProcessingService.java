package com.its.vdt.service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.its.vdt.dto.AnalyticsResponse;
import com.its.vdt.dto.DetectionPayload;
import com.its.vdt.integration.InferenceClient;
import com.its.vdt.model.Video;
import com.its.vdt.repository.VideoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcessingService {

    private final VideoRepository videoRepository;
    private final InferenceClient inferenceClient;
    private final TrackingService trackingService;
    private final AnalyticsService analyticsService;

    @Async("processingExecutor")
    public void enqueue(@NonNull String videoId) {
        videoRepository.findById(videoId).ifPresentOrElse(video -> {
            log.info("Starting processing for video {}", videoId);
            processVideo(video);
        }, () -> log.warn("Video {} not found", videoId));
    }

    private void processVideo(Video video) {
        // Placeholder: In a real implementation, extract frames and send to inference service
        List<DetectionPayload> detections = inferenceClient.mockDetections(video.getId());
        trackingService.persistDetections(video.getId(), detections);
        analyticsService.updateMetrics(video.getId(), detections);
        video.setStatus(Video.VideoStatus.COMPLETED);
        videoRepository.save(video);
        log.info("Completed processing for video {}", video.getId());
    }

    public AnalyticsResponse fetchAnalytics(@NonNull String videoId) {
        return analyticsService.buildResponse(videoId);
    }
}

