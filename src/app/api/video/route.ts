// src/app/api/video/route.ts
import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts/tts.service";
import { generateVideo } from "@/lib/video/video.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      text,
      language,
      voiceGender,
      voiceSpeed,
      aspectRatio,
      backgroundType,
      backgroundValue,
    } = body;

    // Minimal validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text is required" },
        { status: 400 }
      );
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
      backgroundValue,
    });

    return NextResponse.json({
      success: true,
      videoPath: videoResult.videoPath,
    });
  } catch (error) {
    console.error("Video API failed:", error);

    return NextResponse.json(
      { success: false, error: "Video generation failed" },
      { status: 500 }
    );
  }
}