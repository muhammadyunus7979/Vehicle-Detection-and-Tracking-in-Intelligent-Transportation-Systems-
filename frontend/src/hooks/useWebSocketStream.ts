import { useEffect, useRef, useState } from "react";

interface DetectionPayload {
  frame_idx: number;
  timestamp: string;
  detections: Array<{
    id: string;
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
    track_id: string;
    speed_kph?: number;
  }>;
  fps: number;
  latency_ms: number;
}

export const useWebSocketStream = (videoId: string | null) => {
  const [payload, setPayload] = useState<DetectionPayload | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!videoId) {
      return;
    }
    const wsUrl = `${(import.meta.env.VITE_WS_URL as string) ?? "ws://localhost:8080"}/ws/videos/${videoId}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onmessage = (event) => {
      setPayload(JSON.parse(event.data));
    };
    return () => {
      socketRef.current?.close();
    };
  }, [videoId]);

  return payload;
};


