import { NextFunction, Request, Response } from "express";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { renderSchema } from "../lib/zod/video";

const renderJobs = new Map();

export const renderController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await renderSchema.parseAsync(req.body);
    if (!data) return res.status(400).json({ error: "All parameters are required" });

    const jobId = `job_${Date.now()}`;
    renderJobs.set(jobId, {
      status: "Pending",
      progress: 0,
      startTime: new Date(),
    });

    res.status(200).json({ jobId, status: "Started", message: `Render job initiated under name: ${jobId}.` });

    const texts = data.texts.map((text) => {
      const from = data.clips.slice(0, text.start).reduce((sum, clip) => sum + clip.duration, 0);
      return { ...text, from };
    });

    const fileName = `${new Date().getTime()}-video.mp4`;
    const outputPath = `renders/${fileName}`;

    const composition = await selectComposition({
      id: "VideoEditor",
      serveUrl: process.env.RENDER_URL!,
      inputProps: { clips: data.clips, texts },
    });

    await renderMedia({
      composition,
      codec: "h264",
      serveUrl: process.env.RENDER_URL!,
      outputLocation: outputPath,
      onProgress: ({ progress }) => renderJobs.set(jobId, { status: "Progress", progress: Math.round(progress * 100) }),
    });

    renderJobs.set(jobId, {
      status: "Completed",
      progress: 100,
      url: `${process.env.BASE_URL}/${fileName}`,
    });
  } catch (error) {
    console.error(`Error: ${error}`);
    if (!res.headersSent) return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const renderProgressController = (req: Request, res: Response, next: NextFunction) => {
  const { id: jobId } = req.params;
  const job = renderJobs.get(jobId);

  if (!job) return res.status(404).json({ message: "Job not found!" });

  return res.json(job);
};
