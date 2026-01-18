// src/app/api/tts/route.ts
import { NextResponse } from "next/server";
import { generateSpeech } from "@/lib/tts/tts.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      text,
      language,
      voiceGender,
      voiceSpeed,
    } = body;

    // Basic validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const result = await generateSpeech({
      text,
      language,
      voiceGender,
      voiceSpeed,
    });

    return NextResponse.json({
      success: true,
      audioPath: result.audioPath,
    });
  } catch (error) {
    console.error("TTS API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate speech",
      },
      { status: 500 }
    );
  }
}