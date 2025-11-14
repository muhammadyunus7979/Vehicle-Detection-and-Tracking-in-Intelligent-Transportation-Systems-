import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface DetectionSettings {
  confidenceThreshold: number;
  nmsThreshold: number;
  maxFps: number;
}

interface SettingsContextValue {
  settings: DetectionSettings;
  updateSettings: (patch: Partial<DetectionSettings>) => void;
}

const defaultSettings: DetectionSettings = {
  confidenceThreshold: 0.25,
  nmsThreshold: 0.45,
  maxFps: 30
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<DetectionSettings>(defaultSettings);

  // Always set dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DetectionSettings;
        setSettings(parsed);
      } catch (error) {
        console.warn("Failed to parse stored settings", error);
        localStorage.removeItem("settings");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
    // Always ensure dark mode is set
    document.documentElement.classList.add("dark");
  }, [settings]);

  const updateSettings = (patch: Partial<DetectionSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
};

