package com.its.vdt.controller;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.its.vdt.dto.ProcessResponse;
import com.its.vdt.dto.UploadResponse;
import com.its.vdt.dto.VehicleSpeedResponse;
import com.its.vdt.dto.VideoInfoResponse;
import com.its.vdt.dto.VideoUploadRequest;
import com.its.vdt.service.VideoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
@Validated
public class VideoController {

    private final VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> upload(
            @RequestPart("file") MultipartFile file,
            @RequestPart("meta") @Valid VideoUploadRequest request,
            Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous";
        UploadResponse response = videoService.handleUpload(file, request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/{videoId}/process")
    public ResponseEntity<ProcessResponse> process(@PathVariable @NonNull String videoId) {
        ProcessResponse response = videoService.startProcessing(videoId);
        return ResponseEntity.accepted().body(response);
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<VideoInfoResponse> getVideoInfo(@PathVariable @NonNull String videoId) {
        VideoInfoResponse response = videoService.getVideoInfo(videoId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{videoId}/speeds")
    public ResponseEntity<VehicleSpeedResponse> getVehicleSpeeds(@PathVariable @NonNull String videoId) {
        VehicleSpeedResponse response = videoService.getVehicleSpeeds(videoId);
        return ResponseEntity.ok(response);
    }
}







