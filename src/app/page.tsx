"use client";

import { useState, useRef, useEffect } from "react";
import {
  handleImageChange as handleImageChangeHelper,
  loadVersion as loadVersionHelper,
  handleSubmit as handleSubmitHelper,
} from "@/lib/helpers/ui.helpers";
import type { VideoVersion } from "@/types/ui.types";
import type { BackgroundType } from "@/types/common.types";
import VideoForm from "@/components/VideoForm";
import VideoPreview from "@/components/VideoPreview";
import VersionHistory from "@/components/VersionHistory";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("color");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [versions, setVersions] = useState<VideoVersion[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleImageChangeHelper(e, setImagePreview);
    setGeneratedImageUrl(null);
  }

  function handleGeneratedImage(imageUrl: string) {
    setImagePreview(imageUrl);
    setGeneratedImageUrl(imageUrl);
  }

  useEffect(() => {
    const saved = localStorage.getItem("videoVersions");
    if (saved) {
      setVersions(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("videoVersions", JSON.stringify(versions));
  }, [versions]);

  function loadVersion(version: VideoVersion) {
    loadVersionHelper(
      version,
      formRef,
      setBackgroundType,
      setVideoUrl,
      setExpandedVersionId
    );
  }

  function toggleExpand(versionId: string) {
    setExpandedVersionId((prev) => (prev === versionId ? null : versionId));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    await handleSubmitHelper(
      e,
      backgroundType,
      setLoading,
      setError,
      setVideoUrl,
      setVersions,
      generatedImageUrl
    );
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
            Generate short videos from text
          </p>
        </header>

        {/* Configuration Section */}
        <VideoForm
          formRef={formRef}
          backgroundType={backgroundType}
          imagePreview={imagePreview}
          loading={loading}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onBackgroundTypeChange={setBackgroundType}
          onImagePreviewClear={() => {
            setImagePreview(null);
            setGeneratedImageUrl(null);
          }}
          onGeneratedImage={handleGeneratedImage}
        />

        {/* Preview Section */}
        <VideoPreview videoUrl={videoUrl} loading={loading} error={error} />

        {/* Version History Section */}
        <VersionHistory
          versions={versions}
          expandedVersionId={expandedVersionId}
          onLoadVersion={loadVersion}
          onToggleExpand={toggleExpand}
        />
      </div>
    </main>
  );
}