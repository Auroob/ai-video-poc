"use client";

import type { VideoVersion } from "@/types/ui.types";
import { describeChanges } from "@/lib/helpers/ui.helpers";

type VersionHistoryProps = {
  versions: VideoVersion[];
  expandedVersionId: string | null;
  onLoadVersion: (version: VideoVersion) => void;
  onToggleExpand: (versionId: string) => void;
};

export default function VersionHistory({
  versions,
  expandedVersionId,
  onLoadVersion,
  onToggleExpand,
}: VersionHistoryProps) {

  function handleVersionClick(version: VideoVersion) {
    const isCurrentlyExpanded = expandedVersionId === version.id;
    if (isCurrentlyExpanded) {
      onToggleExpand(version.id);
    } else {
      onLoadVersion(version);
    }
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow-sm text-gray-900">
      <h2 className="text-xl font-medium">Version History</h2>
      <p className="mt-1 text-sm text-gray-500">
        View and regenerate previous versions.
      </p>
      <div className="mt-6 space-y-4">
        {versions.map((version, index) => {
          const isExpanded = expandedVersionId === version.id;
          return (
            <div
              key={version.id}
              className="rounded-md border border-gray-200 p-3 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Version {versions.length - index}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(version.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {describeChanges(versions[index + 1] ?? null, version)}
                  </p>
                </div>

                <button
                  className="text-sm font-medium text-gray-900"
                  onClick={() => handleVersionClick(version)}
                >
                  {isExpanded ? "Hide" : "Preview"}
                </button>
              </div>

              {isExpanded && (
                <div className="space-y-3 border-t border-gray-200 pt-3">
                  <video
                    src={version.videoUrl}
                    controls
                    className="w-full max-h-[300px] rounded-md object-contain"
                  />

                  <div className="flex justify-end">
                    <a
                      href={version.videoUrl}
                      download
                      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white inline-block"
                    >
                      Download Video
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
