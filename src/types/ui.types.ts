import type { BackgroundType } from "./common.types";

export type VideoVersion = {
  id: string;
  createdAt: number;
  settings: {
    text: string;
    language: string;
    voiceGender: string;
    voiceSpeed: string;
    aspectRatio: string;
    backgroundType: BackgroundType;
    backgroundValue?: string;
  };
  videoUrl: string;
};

