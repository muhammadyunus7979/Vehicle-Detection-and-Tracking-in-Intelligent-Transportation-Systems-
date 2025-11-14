package com.its.vdt.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.its.vdt.dto.AnalyticsResponse;
import com.its.vdt.service.ProcessingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProcessingService processingService;

    @GetMapping("/{videoId}/analytics")
    public ResponseEntity<AnalyticsResponse> analytics(@PathVariable @NonNull String videoId) {
        return ResponseEntity.ok(processingService.fetchAnalytics(videoId));
    }
}


