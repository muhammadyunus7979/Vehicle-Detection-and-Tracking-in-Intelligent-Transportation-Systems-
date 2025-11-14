package com.its.vdt.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.its.vdt.dto.DetectionPayload;
import com.its.vdt.model.Detection;
import com.its.vdt.model.Frame;
import com.its.vdt.repository.DetectionRepository;
import com.its.vdt.repository.FrameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TrackingService {

    private final FrameRepository frameRepository;
    private final DetectionRepository detectionRepository;

    public void persistDetections(String videoId, List<DetectionPayload> payloads) {
        payloads.forEach(payload -> {
            Frame frame = Objects.requireNonNull(Frame.builder()
                    .videoId(videoId)
                    .frameIdx(payload.frameIdx())
                    .timestamp(payload.timestamp())
                    .processedAt(payload.timestamp())
                    .build());
            Frame savedFrame = frameRepository.save(frame);

            List<Detection> detections = Objects.requireNonNull(payload.detections().stream()
                    .map(det -> Detection.builder()
                            .frameId(savedFrame.getId())
                            .clazz(det.clazz())
                            .confidence(det.confidence())
                            .bbox(Detection.BoundingBox.builder()
                                    .x(det.bbox()[0])
                                    .y(det.bbox()[1])
                                    .w(det.bbox()[2])
                                    .h(det.bbox()[3])
                                    .build())
                            .trackId(det.trackId())
                            .speedKph(det.speedKph())
                            .build())
                    .collect(Collectors.toList()));
            detectionRepository.saveAll(detections);
        });
    }
}

