// src/app/api/video/route.ts
import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts/tts.service";
import { generateVideo } from "@/lib/video/video.service";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {

    const formData = await req.formData();

    const text = formData.get("text") as string;
    const language = formData.get("language") as "en" | "fr" | "es";
    const voiceGender = formData.get("voiceGender") as "male" | "female";
    const voiceSpeed = (formData.get("voiceSpeed") as "slow" | "normal" | "fast") || "normal";
    const aspectRatio = formData.get("aspectRatio") as "16:9" | "9:16";
    const backgroundType = formData.get("backgroundType") as "color" | "image";
    const backgroundValue = formData.get("backgroundValue") as string | null;
    const imageFile = formData.get("backgroundImage") as File | null;

    // Minimal validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
    }

    let resolvedBackgroundValue = backgroundValue ?? "black";

    if (backgroundType === "image") {
    if (!imageFile) {
        return NextResponse.json(
        { success: false, error: "Background image is required" },
        { status: 400 }
        );
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const fileName = `${crypto.randomUUID()}-${imageFile.name}`;
    const imagePath = path.join(uploadDir, fileName);

    fs.writeFileSync(imagePath, buffer);

    resolvedBackgroundValue = imagePath;
    }

    // 1️⃣ Generate audio
    const audioResult = await generateSpeech({
      text,
      language,
      voiceGender,
      voiceSpeed,
    });

    // 2️⃣ Generate video
    const videoResult = await generateVideo({
      audioPath: audioResult.audioPath,
      text,
      aspectRatio,
      backgroundType,
      backgroundValue: resolvedBackgroundValue,
    });

    const fileName = path.basename(videoResult.videoPath);

    return NextResponse.json({
    success: true,
    videoUrl: `/api/video/file?file=${fileName}`,
    });
  } catch (error) {
    console.error("Video API failed:", error);

    return NextResponse.json(
      { success: false, error: "Video generation failed" },
      { status: 500 }
    );
  }
}