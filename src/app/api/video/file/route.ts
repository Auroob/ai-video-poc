import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (!file) {
    return new NextResponse("Missing file parameter", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "tmp", file);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}