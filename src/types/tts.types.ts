import type { Language, VoiceGender, VoiceSpeed } from "./common.types";

export type TTSInput = {
  text: string;
  language: Language;
  voiceGender: VoiceGender;
  voiceSpeed: VoiceSpeed;
};

export type TTSResult = {
  audioPath: string;
};