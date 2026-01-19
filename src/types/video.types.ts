import type { AspectRatio, BackgroundType } from "./common.types";

export type VideoGenerationInput = {
  audioPath: string;
  backgroundType: BackgroundType;
  backgroundValue: string;
  aspectRatio: AspectRatio;
  text: string;
};

export type VideoGenerationResult = {
  videoPath: string;
};

