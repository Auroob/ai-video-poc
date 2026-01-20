import type { VideoVersion } from "@/types/ui.types";
import type { BackgroundType } from "@/types/common.types";


// Handles image file input changes and creates a preview data URL
export function handleImageChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setImagePreview: (preview: string | null) => void
): void {
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

// Loads a video version's settings into a form
export function loadVersion(
  version: VideoVersion,
  formRef: React.RefObject<HTMLFormElement | null>,
  setBackgroundType: (type: BackgroundType) => void,
  setVideoUrl: (url: string | null) => void,
  setExpandedVersionId: (id: string | null | ((prev: string | null) => string | null)) => void
): void {
  if (!formRef.current) return;

  const form = formRef.current;

  (form.elements.namedItem("text") as HTMLTextAreaElement).value =
    version.settings.text;

  (form.elements.namedItem("language") as HTMLSelectElement).value =
    version.settings.language;

  (form.elements.namedItem("voiceGender") as HTMLSelectElement).value =
    version.settings.voiceGender;

  (form.elements.namedItem("voiceSpeed") as HTMLSelectElement).value =
    version.settings.voiceSpeed;

  (form.elements.namedItem("aspectRatio") as HTMLSelectElement).value =
    version.settings.aspectRatio;

  setBackgroundType(version.settings.backgroundType);
  setVideoUrl(version.videoUrl);

  setExpandedVersionId(prev =>
    prev === version.id ? null : version.id
  );
}

// Describes the changes between two video versions
export function describeChanges(
  prev: VideoVersion | null,
  curr: VideoVersion
): string {
  if (!prev) return "Initial version";

  const changes: string[] = [];

  if (prev.settings.text !== curr.settings.text)
    changes.push("Transcript updated");

  if (prev.settings.voiceGender !== curr.settings.voiceGender)
    changes.push(
      `Voice gender: ${prev.settings.voiceGender} → ${curr.settings.voiceGender}`
    );

  if (prev.settings.voiceSpeed !== curr.settings.voiceSpeed)
    changes.push(
      `Voice speed: ${prev.settings.voiceSpeed} → ${curr.settings.voiceSpeed}`
    );

  if (prev.settings.backgroundType !== curr.settings.backgroundType)
    changes.push("Background changed");

  return changes.join(", ");
}

// Handles form submission for video generation
export async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>,
  backgroundType: BackgroundType,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setVideoUrl: (url: string | null) => void,
  setVersions: (versions: VideoVersion[] | ((prev: VideoVersion[]) => VideoVersion[])) => void,
  generatedImageUrl?: string | null
): Promise<void> {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setVideoUrl(null);

  const formData = new FormData(e.currentTarget);

  // Add generated image URL if background type is "generate"
  if (backgroundType === "generate" && generatedImageUrl) {
    formData.append("generatedImageUrl", generatedImageUrl);
  }

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
    const newVersion: VideoVersion = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      settings: {
        text: formData.get("text") as string,
        language: formData.get("language") as string,
        voiceGender: formData.get("voiceGender") as string,
        voiceSpeed: formData.get("voiceSpeed") as string,
        aspectRatio: formData.get("aspectRatio") as string,
        backgroundType,
        backgroundValue:
          backgroundType === "color"
            ? (formData.get("backgroundValue") as string)
            : undefined,
      },
      videoUrl: data.videoUrl,
    };

    setVersions(prev => [newVersion, ...prev]);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

