export default function Home() {
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
        <section className="rounded-lg bg-white p-6 shadow-sm text-gray-900">
          <h2 className="text-xl font-medium">
            Configuration
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure your video settings before generation.
          </p>
          <div className="mt-6 space-y-6">

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Video Text
              </label>
              <textarea
                placeholder="Enter the text you want to turn into a video..."
                className="mt-2 w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                rows={4}
                disabled
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Language
              </label>
              <select
                className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
                disabled
              >
                <option>English</option>
                <option>French</option>
                <option>Spanish</option>
              </select>
            </div>

            {/* Voice Preferences */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Voice Gender
                </label>
                <select
                  className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
                  disabled
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Voice Speed
                </label>
                <select
                  className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
                  disabled
                >
                  <option>Slow</option>
                  <option>Normal</option>
                  <option>Fast</option>
                </select>
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Aspect Ratio
              </label>
              <select
                className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm"
                disabled
              >
                <option>16:9 (Landscape)</option>
                <option>9:16 (Portrait)</option>
              </select>
            </div>

            {/* Background Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">
                Background
              </label>

              <div className="flex items-center gap-4">
                <input type="radio" disabled />
                <span className="text-sm text-gray-700">Solid color</span>

                <input type="radio" disabled />
                <span className="text-sm text-gray-700">Image upload</span>
              </div>

              <div className="flex gap-4">
                <input
                  type="color"
                  className="h-10 w-20 cursor-not-allowed rounded border border-gray-300"
                  disabled
                />

                <input
                  type="file"
                  className="text-sm text-gray-500"
                  disabled
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <button
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white opacity-50"
                disabled
              >
                Generate Video
              </button>
            </div>

          </div>
        </section>

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
            <div className="flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 aspect-video">
              <span className="text-sm text-gray-400">
                No video generated yet
              </span>
            </div>

            {/* Loading State (static placeholder) */}
            <div className="mt-4 flex items-center justify-center rounded-md border border-gray-300 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Generating video… please wait
              </p>
            </div>

            {/* Error State (static placeholder) */}
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Something went wrong while generating the video. Please try again.
              </p>
            </div>
            
            {/* Preview Actions */}
            <div className="flex justify-end">
              <button
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white opacity-50"
                disabled
              >
                Download Video
              </button>
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