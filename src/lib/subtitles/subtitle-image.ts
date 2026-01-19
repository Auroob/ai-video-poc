import { createCanvas, type CanvasRenderingContext2D } from "canvas";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
}

export function generateSubtitleImage(
  text: string,
  width: number,
  height: number
): string {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Transparent background
  ctx.clearRect(0, 0, width, height);

  // Detect orientation
  const isPortrait = height > width;

  // Typography
  const fontSize = isPortrait ? 28 : 32;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Safe margins
  const horizontalPadding = Math.floor(width * 0.08);
  const maxTextWidth = width - horizontalPadding * 2;

  // Wrap text
  const lines = wrapText(ctx, text, maxTextWidth);

  // Vertical positioning (bottom-aligned block)
  const lineHeight = fontSize * 1.25;
  const blockHeight = lines.length * lineHeight;
  let y = height - blockHeight - 60;

  // Draw lines
  for (const line of lines) {
    ctx.fillText(line, width / 2, y);
    y += lineHeight;
  }

  const fileName = `${crypto.randomUUID()}.png`;
  const outputPath = path.join(process.cwd(), "tmp", fileName);

  fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));

  return outputPath;
}