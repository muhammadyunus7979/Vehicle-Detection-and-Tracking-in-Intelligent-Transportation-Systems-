import { useState } from "react";

import { startProcessing, uploadVideo, UploadMeta, UploadResponse } from "../api/videoApi";

export const useVideoProcessing = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<UploadResponse | null>(null);

  const upload = async (file: File, meta: UploadMeta) => {
    setIsUploading(true);
    try {
      const result = await uploadVideo(file, meta);
      setCurrentVideo(result);
      return result;
    } finally {
      setIsUploading(false);
    }
  };

  const triggerProcessing = async (videoId: string) => {
    return startProcessing(videoId);
  };

  return {
    upload,
    triggerProcessing,
    isUploading,
    currentVideo
  };
};


