import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export function generateSubtitleImage(
  text: string,
  width: number,
  height: number
): string {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Text styling
  ctx.fillStyle = "white";
  ctx.font = "32px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  const paddingBottom = 40;
  const lines = text.split("\n");

  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      width / 2,
      height - paddingBottom - (lines.length - i - 1) * 36
    );
  });

  const fileName = `${crypto.randomUUID()}.png`;
  const outputPath = path.join(process.cwd(), "tmp", fileName);

  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));

  return outputPath;
}