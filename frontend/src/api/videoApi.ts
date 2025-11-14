import api from "./client";

export interface UploadMeta {
  title: string;
  sourceType: string;
  fpsTarget: number;
}

export interface UploadResponse {
  videoId: string;
  status: string;
}

export const uploadVideo = async (file: File, meta: UploadMeta) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("meta", new Blob([JSON.stringify(meta)], { type: "application/json" }));
  const response = await api.post<UploadResponse>("/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};

export const startProcessing = async (videoId: string) => {
  const response = await api.post(`/videos/${videoId}/process`);
  return response.data as { jobId: string; status: string };
};

export const fetchAnalytics = async (videoId: string) => {
  const response = await api.get(`/videos/${videoId}/analytics`);
  return response.data;
};

export interface VideoInfo {
  videoId: string;
  title: string;
  videoUrl: string;
  status: string;
  uploadedAt: string;
  duration: number | null;
  fpsTarget: number | null;
}

export const fetchVideoInfo = async (videoId: string): Promise<VideoInfo> => {
  const response = await api.get<VideoInfo>(`/videos/${videoId}`);
  return response.data;
};

export interface SpeedData {
  trackId: string;
  clazz: string;
  speedKph: number;
  frameIdx: number;
  timestamp: string;
}

export interface VehicleSpeeds {
  speeds: SpeedData[];
}

export const fetchVehicleSpeeds = async (videoId: string): Promise<VehicleSpeeds> => {
  const response = await api.get<VehicleSpeeds>(`/videos/${videoId}/speeds`);
  return response.data;
};


