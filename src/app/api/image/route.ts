// src/app/api/image/route.ts
import { NextResponse } from "next/server";
import { generateImage } from "@/lib/image/image.service";
import type { AspectRatio } from "@/types/common.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { prompt, aspectRatio } = body;

    // Basic validation
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateImage({
      prompt,
      aspectRatio: aspectRatio as AspectRatio | undefined,
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      imagePath: result.imagePath,
    });
  } catch (error: any) {
    console.error("Image generation API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate image",
      },
      { status: 500 }
    );
  }
}

