package com.its.vdt.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.its.vdt.dto.ProcessResponse;
import com.its.vdt.dto.UploadResponse;
import com.its.vdt.dto.VehicleSpeedResponse;
import com.its.vdt.dto.VideoInfoResponse;
import com.its.vdt.dto.VideoUploadRequest;
import com.its.vdt.model.Detection;
import com.its.vdt.model.Frame;
import com.its.vdt.model.Video;
import com.its.vdt.repository.DetectionRepository;
import com.its.vdt.repository.FrameRepository;
import com.its.vdt.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final ProcessingService processingService;
    private final DetectionRepository detectionRepository;
    private final FrameRepository frameRepository;

    @Value("${app.storage.path}")
    private String storagePath;

    public UploadResponse handleUpload(MultipartFile file, VideoUploadRequest request, String userId) {
        String videoId = UUID.randomUUID().toString();
        Path destination = Path.of(storagePath, videoId + "-" + file.getOriginalFilename());
        try {
            Files.createDirectories(destination.getParent());
            file.transferTo(destination);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store video", e);
        }

        Video video = Objects.requireNonNull(Video.builder()
                .id(videoId)
                .userId(userId)
                .title(request.title())
                .sourceUrl(destination.toString())
                .storagePath(destination.toString())
                .uploadedAt(Instant.now())
                .fpsTarget(request.fpsTarget())
                .status(Video.VideoStatus.QUEUED)
                .build());
        videoRepository.save(video);
        return new UploadResponse(videoId, video.getStatus().name());
    }

    public ProcessResponse startProcessing(@NonNull String videoId) {
        processingService.enqueue(videoId);
        return new ProcessResponse("job-" + videoId, "QUEUED");
    }

    public com.its.vdt.dto.AnalyticsResponse fetchAnalytics(@NonNull String videoId) {
        return processingService.fetchAnalytics(videoId);
    }

    public VideoInfoResponse getVideoInfo(@NonNull String videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found: " + videoId));
        
        // Create a URL for the video file (in production, this would be a proper URL)
        String videoUrl = "/api/videos/" + videoId + "/stream";
        
        return new VideoInfoResponse(
                video.getId(),
                video.getTitle(),
                videoUrl,
                video.getStatus() != null ? video.getStatus().name() : "UNKNOWN",
                video.getUploadedAt(),
                video.getDuration(),
                video.getFpsTarget()
        );
    }

    public VehicleSpeedResponse getVehicleSpeeds(@NonNull String videoId) {
        List<Frame> frames = frameRepository.findByVideoIdOrderByFrameIdxAsc(videoId);
        List<Detection> detections = detectionRepository.findByVideoId(videoId);
        
        List<VehicleSpeedResponse.SpeedData> speeds = detections.stream()
                .filter(d -> d.getSpeedKph() != null)
                .map(detection -> {
                    Frame frame = frames.stream()
                            .filter(f -> f.getId().equals(detection.getFrameId()))
                            .findFirst()
                            .orElse(null);
                    
                    return new VehicleSpeedResponse.SpeedData(
                            detection.getTrackId(),
                            detection.getClazz(),
                            detection.getSpeedKph(),
                            frame != null ? (long) frame.getFrameIdx() : 0L,
                            frame != null ? frame.getTimestamp().toString() : ""
                    );
                })
                .collect(Collectors.toList());
        
        return new VehicleSpeedResponse(speeds);
    }

    public Resource getVideoResource(@NonNull String videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found: " + videoId));
        
        if (video.getStoragePath() == null) {
            return null;
        }
        
        Path videoPath = Objects.requireNonNull(Path.of(video.getStoragePath()));
        if (!Files.exists(videoPath)) {
            return null;
        }
        
        return new FileSystemResource(videoPath);
    }
}

