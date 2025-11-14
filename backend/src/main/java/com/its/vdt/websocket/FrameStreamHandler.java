package com.its.vdt.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.its.vdt.dto.DetectionPayload;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class FrameStreamHandler {

    @MessageMapping("/videos.subscribe")
    @SendTo("/topic/frames")
    public DetectionPayload handleSubscription(String videoId) {
        log.info("Subscription received for video {}", videoId);
        // This method should be replaced with live data streaming.
        return new DetectionPayload(0, null, java.util.List.of(), 0, 0);
    }
}


