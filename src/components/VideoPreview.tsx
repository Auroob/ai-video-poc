"use client";

type VideoPreviewProps = {
  videoUrl: string | null;
  loading: boolean;
  error: string | null;
};

export default function VideoPreview({
  videoUrl,
  loading,
  error,
}: VideoPreviewProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm text-gray-900">
      <h2 className="text-xl font-medium">Preview</h2>
      <p className="mt-1 text-sm text-gray-500">
        Preview the generated video.
      </p>

      {loading && (
        <div className="mt-4 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Generating video… please wait
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {videoUrl && (
          <div className="w-full flex justify-center">
            <video
              src={videoUrl}
              controls
              className="max-h-[480px] w-full max-w-4xl rounded-md object-contain"
            />
          </div>
        )}

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
  );
}
