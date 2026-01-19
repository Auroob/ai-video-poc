"use client";

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
}: VideoFormProps) {

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
                onChange={() => onBackgroundTypeChange("image")}
              />
              Image upload
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

              {imagePreview && backgroundType === "image" && (
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
