import { ChangeEvent, FormEvent, useMemo, useState, useEffect } from "react";

import { useVideoProcessing } from "../hooks/useVideoProcessing";
import { DetectionSettings, useSettings } from "../context/SettingsContext";
import VideoPlayer from "../components/VideoPlayer";
import MetricsChart from "../components/MetricsChart";
import { fetchVideoInfo, fetchVehicleSpeeds, fetchAnalytics, type VideoInfo, type VehicleSpeeds, type SpeedData } from "../api/videoApi";

const Dashboard = () => {
  const { settings, updateSettings } = useSettings();
  const { upload, triggerProcessing, isUploading, currentVideo } = useVideoProcessing();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState("upload");
  const [fpsTarget, setFpsTarget] = useState(settings.maxFps);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [vehicleSpeeds, setVehicleSpeeds] = useState<SpeedData[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const formattedSettings = useMemo(
    () => [
      { label: "Confidence threshold", value: settings.confidenceThreshold.toFixed(2) },
      { label: "NMS threshold", value: settings.nmsThreshold.toFixed(2) },
      { label: "Max FPS", value: settings.maxFps.toString() }
    ],
    [settings]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.item(0) ?? null;
    setFile(nextFile);
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage("Choose a video file to upload.");
      return;
    }

    try {
      const response = await upload(file, {
        title: title || file.name,
        sourceType,
        fpsTarget
      });
      setStatusMessage(`Uploaded video ${response.videoId} (status: ${response.status}). Starting processing...`);
      
      // Automatically start processing after upload
      try {
        const job = await triggerProcessing(response.videoId);
        setStatusMessage(`Processing started for video ${response.videoId}: ${job.jobId} (${job.status})`);
        // Start polling for completion
        pollForCompletion(response.videoId);
      } catch (processingError) {
        setStatusMessage(`Upload successful but failed to start processing: ${response.videoId}`);
        console.error("Processing error", processingError);
      }
    } catch (error) {
      setStatusMessage("Video upload failed. Check the console for details.");
      console.error("Upload failed", error);
    }
  };

  const handleStartProcessing = async () => {
    if (!currentVideo) {
      setStatusMessage("Upload a video before starting processing.");
      return;
    }

    try {
      const job = await triggerProcessing(currentVideo.videoId);
      setStatusMessage(`Processing started: ${job.jobId} (${job.status})`);
      pollForCompletion(currentVideo.videoId);
    } catch (error) {
      setStatusMessage("Failed to start processing.");
      console.error("Processing error", error);
    }
  };

  const loadVideoData = async (videoId: string) => {
    setIsLoadingData(true);
    try {
      const [info, speeds, analyticsData] = await Promise.all([
        fetchVideoInfo(videoId),
        fetchVehicleSpeeds(videoId),
        fetchAnalytics(videoId)
      ]);
      setVideoInfo(info);
      setVehicleSpeeds(speeds.speeds);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Failed to load video data", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const pollForCompletion = async (videoId: string) => {
    const maxAttempts = 30;
    let attempts = 0;
    
    const poll = async () => {
      try {
        const info = await fetchVideoInfo(videoId);
        if (info.status === "COMPLETED") {
          await loadVideoData(videoId);
          setStatusMessage("Video processing completed!");
          return;
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          setStatusMessage("Processing is taking longer than expected. Please refresh.");
        }
      } catch (error) {
        console.error("Polling error", error);
      }
    };
    
    poll();
  };

  const handleSettingChange =
      (key: "confidenceThreshold" | "nmsThreshold" | "maxFps") =>
      (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const numericValue = Number(event.target.value);
        if (!Number.isNaN(numericValue)) {
          updateSettings({ [key]: numericValue } as Partial<DetectionSettings>);
        }
      };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">Vehicle Detection Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8">
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Upload video</h2>
          <form className="mt-4 flex flex-col gap-4" onSubmit={handleUpload}>
            <input type="file" accept="video/*" onChange={handleFileChange} className="text-sm" />
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-sm">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-indigo-400 text-slate-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Source
                <select
                  value={sourceType}
                  onChange={(event) => setSourceType(event.target.value)}
                  className="rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-indigo-400 text-slate-100"
                >
                  <option value="upload">Upload</option>
                  <option value="stream">Stream</option>
                  <option value="camera">Camera</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                FPS target
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={fpsTarget}
                  onChange={(event) => setFpsTarget(Number(event.target.value))}
                  className="rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-indigo-400 text-slate-100"
                />
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isUploading}
                className="rounded bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-800"
              >
                {isUploading ? "Uploading…" : "Upload"}
              </button>
              <button
                type="button"
                onClick={handleStartProcessing}
                className="rounded border border-indigo-400 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500 hover:text-white"
              >
                Start processing
              </button>
            </div>
            {statusMessage && <p className="text-sm text-slate-300">{statusMessage}</p>}
          </form>
        </section>

        {videoInfo && videoInfo.status === "COMPLETED" && (
          <>
            <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold mb-4">Processed Video</h2>
              {isLoadingData ? (
                <p className="text-sm text-gray-600 dark:text-slate-400">Loading video data...</p>
              ) : (
                <VideoPlayer videoUrl={videoInfo.videoUrl} title={videoInfo.title} />
              )}
            </section>

            {vehicleSpeeds.length > 0 && (
              <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-lg font-semibold mb-4">Vehicle Speeds</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left p-2">Track ID</th>
                        <th className="text-left p-2">Class</th>
                        <th className="text-left p-2">Speed (km/h)</th>
                        <th className="text-left p-2">Frame</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicleSpeeds.slice(0, 20).map((speed, idx) => (
                        <tr key={idx} className="border-b border-slate-800">
                          <td className="p-2">{speed.trackId}</td>
                          <td className="p-2">{speed.clazz}</td>
                          <td className="p-2 font-medium">{speed.speedKph.toFixed(1)}</td>
                          <td className="p-2">{speed.frameIdx}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {vehicleSpeeds.length > 20 && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                      Showing first 20 of {vehicleSpeeds.length} speed records
                    </p>
                  )}
                </div>
              </section>
            )}

            {analytics && (
              <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
                <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="rounded border border-slate-800 bg-slate-950 p-3">
                    <dt className="text-xs uppercase text-slate-500">mAP50</dt>
                    <dd className="text-lg font-semibold text-slate-100">
                      {analytics.summary.map50.toFixed(3)}
                    </dd>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-3">
                    <dt className="text-xs uppercase text-slate-500">Avg Speed</dt>
                    <dd className="text-lg font-semibold text-slate-100">
                      {analytics.summary.avgSpeedKph?.toFixed(1) || "N/A"} km/h
                    </dd>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-3">
                    <dt className="text-xs uppercase text-slate-500">Max Speed</dt>
                    <dd className="text-lg font-semibold text-slate-100">
                      {analytics.summary.maxSpeedKph?.toFixed(1) || "N/A"} km/h
                    </dd>
                  </div>
                  <div className="rounded border border-slate-800 bg-slate-950 p-3">
                    <dt className="text-xs uppercase text-slate-500">Total Vehicles</dt>
                    <dd className="text-lg font-semibold text-slate-100">
                      {analytics.summary.totalVehicles}
                    </dd>
                  </div>
                </div>
                <MetricsChart
                  accuracySeries={analytics.accuracySeries || []}
                  fpsSeries={analytics.fpsSeries || []}
                  speedSeries={analytics.speedSeries || []}
                  classDistribution={analytics.classDistribution || []}
                />
              </section>
            )}
          </>
        )}

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold">Current settings</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {formattedSettings.map((item) => (
              <div key={item.label} className="rounded border border-slate-800 bg-slate-950 p-3">
                <dt className="text-xs uppercase text-slate-500">{item.label}</dt>
                <dd className="text-sm text-slate-100">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              Confidence threshold
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={settings.confidenceThreshold}
                onChange={handleSettingChange("confidenceThreshold")}
                className="rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-indigo-400 text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              NMS threshold
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={settings.nmsThreshold}
                onChange={handleSettingChange("nmsThreshold")}
                className="rounded border border-slate-700 bg-slate-800 p-2 outline-none focus:border-indigo-400 text-slate-100"
              />
            </label>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

