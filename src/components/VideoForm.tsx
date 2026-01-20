"use client";

import { useState, useEffect } from "react";
import type { BackgroundType } from "@/types/common.types";

type VideoFormProps = {
  formRef: React.RefObject<HTMLFormElement | null>;
  backgroundType: BackgroundType;
  imagePreview: string | null;
  loading: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onImagePreviewClear: () => void;
  onGeneratedImage: (imageUrl: string) => void;
};

export default function VideoForm({
  formRef,
  backgroundType,
  imagePreview,
  loading,
  onImageChange,
  onSubmit,
  onBackgroundTypeChange,
  onImagePreviewClear,
  onGeneratedImage,
}: VideoFormProps) {
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Clear prompt and error when switching away from generate
  useEffect(() => {
    if (backgroundType !== "generate") {
      setImagePrompt("");
      setImageError(null);
    }
  }, [backgroundType]);

  async function handleGenerateImage(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!imagePrompt.trim()) {
      setImageError("Please enter a prompt");
      return;
    }

    setGeneratingImage(true);
    setImageError(null);

    try {
      const aspectRatio = formRef.current
        ? (formRef.current.elements.namedItem("aspectRatio") as HTMLSelectElement)
            .value
        : "16:9";

      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Image generation failed");
      }

      onGeneratedImage(data.imageUrl);
    } catch (err: any) {
      setImageError(err.message || "Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-lg bg-white p-6 shadow-sm text-gray-900"
    >
      <h2 className="text-xl font-medium">Configuration</h2>
      <p className="mt-1 text-sm text-gray-500">
        Configure your video settings before generation.
      </p>
      <div className="mt-6 space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Text Language
          </label>
          <select
            name="language"
            defaultValue="en"
            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            The text should be written in the selected language.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Text</label>
          <textarea
            name="text"
            required
            placeholder="Enter the text you want to turn into a video..."
            className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Voice Gender
            </label>
            <select
              name="voiceGender"
              defaultValue="female"
              className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Voice Speed
            </label>
            <select
              name="voiceSpeed"
              defaultValue="normal"
              className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Aspect Ratio
          </label>
          <select
            name="aspectRatio"
            defaultValue="16:9"
            className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            <option value="16:9">Landscape</option>
            <option value="9:16">Portrait</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-900">
            Background
          </label>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="backgroundType"
                value="color"
                checked={backgroundType === "color"}
                onChange={() => {
                  onBackgroundTypeChange("color");
                  onImagePreviewClear();
                }}
              />
              Solid color
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="backgroundType"
                value="image"
                checked={backgroundType === "image"}
                onChange={() => {
                  onBackgroundTypeChange("image");
                  if (backgroundType === "generate") {
                    onImagePreviewClear();
                  }
                }}
              />
              Image upload
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="backgroundType"
                value="generate"
                checked={backgroundType === "generate"}
                onChange={() => {
                  onBackgroundTypeChange("generate");
                  if (backgroundType === "image") {
                    onImagePreviewClear();
                  }
                }}
              />
              Generate background image
            </label>
          </div>

          <div className="flex gap-4">
            <input
              type="color"
              name="backgroundValue"
              defaultValue="#000000"
              disabled={backgroundType !== "color"}
              className="h-10 w-20 rounded border border-gray-300"
            />

            <div className="flex items-center gap-4">
              <label
                className={`inline-flex cursor-pointer items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                  backgroundType !== "image" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Upload image
                  <input
                  type="file"
                  name="backgroundImage"
                  accept="image/*"
                  disabled={backgroundType !== "image"}
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>

              {imagePreview && (backgroundType === "image" || backgroundType === "generate") && (
                <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-300">
                  <img
                    src={imagePreview}
                    alt="Background preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {backgroundType === "generate" && (
            <div className="space-y-3 rounded-md border border-gray-200 bg-gray-50 p-4">
              <label className="block text-sm font-medium text-gray-900">
                Image Generation Prompt
              </label>
              <textarea
                value={imagePrompt}
                onChange={(e) => {
                  setImagePrompt(e.target.value);
                  setImageError(null);
                }}
                placeholder="Describe the background image you want to generate..."
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                rows={3}
              />
              {imageError && (
                <p className="text-sm text-red-600">{imageError}</p>
              )}
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={generatingImage || loading}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-gray-800"
              >
                {generatingImage ? "Generating Image…" : "Generate Image"}
              </button>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating…" : "Generate Video"}
          </button>
        </div>
      </div>
    </form>
  );
}
