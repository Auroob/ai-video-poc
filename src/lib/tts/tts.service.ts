// src/lib/tts/tts.service.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { TTSInput, TTSResult } from "@/types/tts.types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSpeech(
  input: TTSInput
): Promise<TTSResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!input.text.trim()) {
    throw new Error("Text input is empty");
  }

  const voice =
    input.voiceGender === "female" ? "alloy" : "verse";

  // Speed mapping
  const speed =
    input.voiceSpeed === "slow"
      ? 0.75
      : input.voiceSpeed === "fast"
      ? 1.25
      : 1.0;

  const fileId = crypto.randomUUID();
  const outputDir = path.join(process.cwd(), "tmp");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const audioPath = path.join(outputDir, `${fileId}.mp3`);

  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: input.text,
      speed,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(audioPath, buffer);

    return { audioPath };
  } catch (error) {
    console.error("TTS generation failed:", error);
    throw new Error("Audio generation failed");
  }
}