package com.its.vdt.service;

import java.io.IOException;
import java.io.OutputStream;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {

    public StreamingResponseBodyAdapter buildStream(String videoId) {
        return new StreamingResponseBodyAdapter(videoId);
    }

    public class StreamingResponseBodyAdapter implements StreamingResponseBody {

        private final String videoId;

        public StreamingResponseBodyAdapter(String videoId) {
            this.videoId = videoId;
        }

        @Override
        public void writeTo(@NonNull OutputStream outputStream) throws IOException {
            // Placeholder streaming implementation.
            outputStream.write(("Streaming for video " + videoId).getBytes());
            outputStream.flush();
        }
    }
}

