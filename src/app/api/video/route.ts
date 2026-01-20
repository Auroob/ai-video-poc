// src/app/api/video/route.ts
import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts/tts.service";
import { generateVideo } from "@/lib/video/video.service";
import type { Language, VoiceGender, VoiceSpeed, AspectRatio, BackgroundType } from "@/types/common.types";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {

    const formData = await req.formData();

    const text = formData.get("text") as string;
    const language = (formData.get("language") as Language) || "en";
    const voiceGender = formData.get("voiceGender") as VoiceGender;
    const voiceSpeed = (formData.get("voiceSpeed") as VoiceSpeed) || "normal";
    const aspectRatio = formData.get("aspectRatio") as AspectRatio;
    const backgroundType = formData.get("backgroundType") as BackgroundType;
    const backgroundValue = formData.get("backgroundValue") as string | null;
    const imageFile = formData.get("backgroundImage") as File | null;
    const generatedImageUrl = formData.get("generatedImageUrl") as string | null;

    // Basic validation
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

    if (backgroundType === "generate") {
      if (!generatedImageUrl) {
        return NextResponse.json(
          { success: false, error: "Generated background image is required" },
          { status: 400 }
        );
      }

      // Extract filename from URL
      try {
        const url = generatedImageUrl.startsWith("http")
          ? new URL(generatedImageUrl)
          : new URL(generatedImageUrl, "http://localhost");
        const fileName = url.searchParams.get("file");
        
        if (!fileName) {
          return NextResponse.json(
            { success: false, error: "Invalid generated image URL" },
            { status: 400 }
          );
        }

        const imagePath = path.join(process.cwd(), "tmp", fileName);
        
        if (!fs.existsSync(imagePath)) {
          return NextResponse.json(
            { success: false, error: "Generated image file not found" },
            { status: 400 }
          );
        }

        resolvedBackgroundValue = imagePath;
      } catch (error) {
        return NextResponse.json(
          { success: false, error: "Invalid generated image URL format" },
          { status: 400 }
        );
      }
    }

    //Generate audio
    const audioResult = await generateSpeech({
      text,
      language,
      voiceGender,
      voiceSpeed,
    });

    //Generate video
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