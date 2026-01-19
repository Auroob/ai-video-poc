"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<"color" | "image">("color");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoUrl(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Video generation failed");
      }

      setVideoUrl(data.videoUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Video Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Generate short videos from text and iterate on your results.
          </p>
        </header>

        {/* Configuration Section */}
        <form
            onSubmit={handleSubmit}
            className="rounded-lg bg-white p-6 shadow-sm text-gray-900"
        >
          <h2 className="text-xl font-medium">
            Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your video settings before generation.
          </p>
          <div className="mt-6 space-y-6">

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Text Language
              </label>
              <select name="language" defaultValue="en" className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                The text should be written in the selected language.
              </p>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Text
              </label>
              <textarea
                name="text"
                required
                placeholder="Enter the text you want to turn into a video..."
                className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                rows={4}
              />
            </div>

            {/* Voice Preferences */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Voice Gender
                </label>
                <select name="voiceGender" defaultValue="female" className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Voice Speed
                </label>
                <select name="voiceSpeed" defaultValue="normal" className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm">
                  <option value="slow">Slow</option>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Aspect Ratio
              </label>
              <select name="aspectRatio" defaultValue="16:9" className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm">
                <option value="16:9">Landscape</option>
                <option value="9:16">Portrait</option>
              </select>
            </div>

            {/* Background Selection */}
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
                      setBackgroundType("color");
                      setImagePreview(null);
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
                    onChange={() => setBackgroundType("image")}
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
                  {/* Upload button */}
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
                      onChange={handleImageChange}
                    />
                  </label>

                  {/* Image preview */}
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

            {/* Generate Button */}
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

        {/* Preview Section */}
        <section className="rounded-lg bg-white p-6 shadow-sm text-gray-900">
          <h2 className="text-xl font-medium">
            Preview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Preview the generated video.
          </p>
          <div className="mt-6 space-y-4">

            {/* Video Placeholder */}
            <div className="relative w-full overflow-hidden rounded-md border border-dashed border-gray-300 bg-gray-50">
              <div className="w-full aspect-video flex items-center justify-center">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    controls
                    className="max-h-[480px] w-full object-contain"
                  />
                ) : (
                  <span className="text-sm text-gray-400">
                    No video generated yet
                  </span>
                )}
              </div>
            </div>

            {/* Loading State (static placeholder) */}
            {loading && (
              <div className="mt-4 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Generating video… please wait
                </p>
              </div>
            )}

            {/* Error State (static placeholder) */}
            {error && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {/* Preview Actions */}
            <div className="flex justify-end">
              {videoUrl && (
                <a
                  href={videoUrl}
                  download
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white inline-block"
                >
                  Download Video
                </a>
              )}
            </div>

          </div>
        </section>

        {/* Version History Section */}
        <section className="rounded-lg bg-white p-6 shadow-sm text-gray-900">
          <h2 className="text-xl font-medium">
            Version History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            View and regenerate previous versions.
          </p>
          <div className="mt-6 space-y-4">

          {/* Mocked Version List */}
          <div className="space-y-3">

            {/* Version Item */}
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Version 1
                </p>
                <p className="text-xs text-gray-500">
                  Generated just now
                </p>
              </div>

              <button
                className="text-sm font-medium text-gray-400 cursor-not-allowed"
                disabled
              >
                Load
              </button>
            </div>

            {/* Version Item */}
            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Version 2
                </p>
                <p className="text-xs text-gray-500">
                  Generated 5 minutes ago
                </p>
              </div>

              <button
                className="text-sm font-medium text-gray-400 cursor-not-allowed"
                disabled
              >
                Load
              </button>
            </div>

          </div>

        </div>
        </section>

      </div>
    </main>
  );
}