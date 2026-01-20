// src/lib/video/video.service.ts
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import util from "util";

import { generateSubtitleImage } from "@/lib/subtitles/subtitle-image";
import { splitIntoSubtitleChunks, getAudioDuration } from "@/lib/helpers/video.helpers";
import type { VideoGenerationInput, VideoGenerationResult } from "@/types/video.types";

const execAsync = util.promisify(exec);

export async function generateVideo(
  input: VideoGenerationInput
): Promise<VideoGenerationResult> {
  const { audioPath, backgroundType, backgroundValue, aspectRatio, text } = input;

  if (!fs.existsSync(audioPath)) {
    throw new Error("Audio file not found");
  }

  const outputDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const [w, h] =
  aspectRatio === "9:16" ? [720, 1280] : [1280, 720];

  const videoId = crypto.randomUUID();
  const outputPath = path.join(outputDir, `${videoId}.mp4`);

  // Aspect ratio dimensions
  const size =
    aspectRatio === "9:16" ? "720x1280" : "1280x720";

  const [outW, outH] =
    aspectRatio === "9:16" ? [720, 1280] : [1280, 720];

  const chunks = splitIntoSubtitleChunks(text);
  const audioDuration = await getAudioDuration(audioPath);

  const totalWords = chunks.reduce(
    (sum, chunk) => sum + chunk.split(/\s+/).length,
    0
  );

  const subtitleImages = chunks.map(chunk =>
    generateSubtitleImage(chunk, w, h)
  );

  let filterParts: string[] = [];
  let currentLabel = "base";
  let currentTime = 0;

  chunks.forEach((chunk, index) => {
    const wordsInChunk = chunk.split(/\s+/).length;
    const duration =
      (wordsInChunk / totalWords) * audioDuration;
      
    let endTime = currentTime + duration;

    // Force last subtitle to end exactly at audio end
    if (index === chunks.length - 1) {
      endTime = audioDuration;
    }

    const start = currentTime.toFixed(2);
    const end = endTime.toFixed(2);

    const inputIndex = index + 2; // 0=background, 1=audio
    const outputLabel =
      index === chunks.length - 1 ? "v" : `v${index}`;

    filterParts.push(
      `[${currentLabel}][${inputIndex}:v]overlay=enable='between(t,${start},${end})'[${outputLabel}]`
    );

    currentLabel = outputLabel;
    currentTime += duration;

    // Prevent overshoot due to floating point drift
    if (currentTime > audioDuration) {
      currentTime = audioDuration;
    }
  });

  const filterComplex = filterParts.join(";");

  let command = "";

  if (backgroundType === "color") {
    command = `
      ffmpeg -y
      -f lavfi -i color=${backgroundValue}:s=${size}
      -i "${audioPath}"
      ${subtitleImages.map(img => `-i "${img}"`).join(" ")}
      -filter_complex "
        [0:v]null[base];
        ${filterComplex}
      "
      -map "[v]"
      -map 1:a:0
      -c:v libx264
      -pix_fmt yuv420p
      -c:a aac
      -ar 44100
      -ac 2
      -shortest
      "${outputPath}"
    `;
  }

  if (backgroundType === "image" || backgroundType === "generate") {
    if (!fs.existsSync(backgroundValue)) {
      throw new Error("Background image not found");
    }

    command = `
      ffmpeg -y
      -loop 1 -i "${backgroundValue}"
      -i "${audioPath}"
      ${subtitleImages.map(img => `-i "${img}"`).join(" ")}
      -filter_complex "
        [0:v]
        scale=${outW}:${outH}:force_original_aspect_ratio=decrease,
        pad=${outW}:${outH}:(ow-iw)/2:(oh-ih)/2,
        setsar=1
        [base];
        ${filterComplex}
      "
      -map "[v]"
      -map 1:a:0
      -c:v libx264
      -pix_fmt yuv420p
      -c:a aac
      -ar 44100
      -ac 2
      -shortest
      "${outputPath}"
    `;
  }

  try {
    await execAsync(command.replace(/\s+/g, " ").trim());
  } catch (error) {
    console.error("FFmpeg failed:", error);
    throw new Error("Video generation failed");
  }

  return { videoPath: outputPath };
}