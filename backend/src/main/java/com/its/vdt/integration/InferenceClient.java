package com.its.vdt.integration;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.its.vdt.dto.DetectionPayload;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class InferenceClient {

    private final Random random = new Random();
    private static final String[] VEHICLE_TYPES = {"car", "truck", "bike", "motorcycle", "bus", "van"};

    public List<DetectionPayload> mockDetections(String videoId) {
        log.info("Generating mock detections for video {}", videoId);
        List<DetectionPayload> payloads = new ArrayList<>();
        
        // Generate mock detections for 20 frames (more frames for better speed vs time graph)
        for (int frameIdx = 0; frameIdx < 20; frameIdx++) {
            List<DetectionPayload.Detection> detections = new ArrayList<>();
            
            // Generate 1-4 random detections per frame
            int numDetections = random.nextInt(4) + 1;
            for (int i = 0; i < numDetections; i++) {
                String vehicleType = VEHICLE_TYPES[random.nextInt(VEHICLE_TYPES.length)];
                double speedKph;
                
                // Different speed ranges for different vehicle types
                switch (vehicleType) {
                    case "truck":
                    case "bus":
                        speedKph = 30 + random.nextDouble() * 70; // 30-100 km/h
                        break;
                    case "bike":
                    case "motorcycle":
                        speedKph = 20 + random.nextDouble() * 80; // 20-100 km/h
                        break;
                    default: // car, van
                        speedKph = 40 + random.nextDouble() * 100; // 40-140 km/h
                        break;
                }
                
                detections.add(new DetectionPayload.Detection(
                    "det-" + frameIdx + "-" + i,
                    vehicleType,
                    0.5 + random.nextDouble() * 0.5, // confidence between 0.5 and 1.0
                    new double[]{
                        random.nextDouble() * 100, // x
                        random.nextDouble() * 100, // y
                        50 + random.nextDouble() * 100, // width
                        50 + random.nextDouble() * 100  // height
                    },
                    "track-" + (frameIdx % 5), // trackId cycles through 5 tracks
                    speedKph
                ));
            }
            
            payloads.add(new DetectionPayload(
                frameIdx,
                Instant.now().minusSeconds(10 - frameIdx),
                detections,
                30.0, // fps
                50.0 + random.nextDouble() * 50.0 // latencyMs between 50-100
            ));
        }
        
        log.info("Generated {} mock detection payloads for video {}", payloads.size(), videoId);
        return payloads;
    }
}
