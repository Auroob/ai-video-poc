// src/lib/image/image.service.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ImageGenerationInput = {
  prompt: string;
  aspectRatio?: "16:9" | "9:16";
};

export type ImageGenerationResult = {
  imagePath: string;
  imageUrl: string;
};

export async function generateImage(
  input: ImageGenerationInput
): Promise<ImageGenerationResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  if (!input.prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const fileId = crypto.randomUUID();
  const outputDir = path.join(process.cwd(), "tmp");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Determine size based on aspect ratio
  // DALL-E 3 supports: 1024x1024, 1792x1024, 1024x1792
  let size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024";
  if (input.aspectRatio === "16:9") {
    size = "1792x1024";
  } else if (input.aspectRatio === "9:16") {
    size = "1024x1792";
  }

  const imagePath = path.join(outputDir, `${fileId}.png`);

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: input.prompt,
      size,
      quality: "standard",
      n: 1,
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("No image data returned from OpenAI");
    }

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download generated image");
    }

    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);

    return {
      imagePath,
      imageUrl: `/api/video/file?file=${path.basename(imagePath)}`,
    };
  } catch (error) {
    console.error("Image generation failed:", error);
    throw new Error("Image generation failed");
  }
}

