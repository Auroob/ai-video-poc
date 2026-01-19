import { type CanvasRenderingContext2D } from "canvas";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// Wraps text to fit within a maximum width using canvas text metrics
export function wrapText(
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

// Splits text into subtitle chunks based on character limit
export function splitIntoSubtitleChunks(
  text: string,
  maxChars = 80
): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  let current = "";

  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current.length > 0) {
        chunks.push(current);
      }
      current = word;
    }
  }

  if (current.length > 0) {
    chunks.push(current);
  }

  return chunks;
}

// Gets the duration of an audio file using ffprobe
export async function getAudioDuration(audioPath: string): Promise<number> {
  const { stdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`
  );
  return parseFloat(stdout.trim());
}

