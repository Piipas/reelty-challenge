import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shuffleArray<T>(arr: T[]): T[] {
  let seed = 12345;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return [...arr].sort(() => seededRandom() - 0.5);
}

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export const toSeconds = (ms: number) => Math.round(ms / 1000);
export const durationInSec = (from: Date, to: Date) =>
  toSeconds(to.getTime() - from.getTime());
export const avgDurationSeconds = (dates: Date[], start: Date) => {
  const durations = dates.map((d) => durationInSec(start, d));
  return durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;
};
export const formatDuration = (seconds: number | null | undefined) => {
  if (!seconds) return "Unknown";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
export const formatMusicName = (filename: string, maxLength: number = 8) => {
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  if (nameWithoutExtension.length > maxLength) {
    return nameWithoutExtension.substring(0, maxLength) + "...";
  }
  return nameWithoutExtension;
};
export const getVideoDuration = async (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };
    video.src = url;
  });
};
export const getVideoDimensions = async (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load video metadata"));
    };
    video.src = url;
  });
};
export const validateAspectRatio = (
  width: number,
  height: number,
  expectedRatio: "9:16" | "16:9"
): boolean => {
  const actualRatio = width / height;
  if (expectedRatio === "9:16") {
    return Math.abs(actualRatio - 9 / 16) <= 0.02;
  }
  return Math.abs(actualRatio - 16 / 9) <= 0.02;
};
