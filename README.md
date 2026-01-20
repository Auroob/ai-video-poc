# AI Video Generator – Proof of Concept

This project is a proof of concept (POC) for generating videos from text input in multiple languages (English, French, Spanish). 
It demonstrates an end-to-end pipeline that create videos with custom backgrounds and voices, then iterate on their creations.

## Live Demo

The application is deployed and accessible at:

https://ai-video-poc-production.up.railway.app/

Deployed on Railway (Docker-based deployment).

> Note: Video generation relies on native dependencies (FFmpeg), which is why the app is deployed using Docker.

## Features

### Core Workflow
- Enter a text transcript
- Choose voice settings (gender, speed)
- Select aspect ratio (16:9 or 9:16)
- Choose a background (solid color, uploaded image, or AI-generated image)
- Generate a downloadable video with:
  - Text-to-speech audio
  - Background visual
  - Synchronized subtitles
  - Correct aspect ratio

### Background Options
- Solid color background
- Image upload (with preview)
- AI-generated image background using OpenAI image generation

### Subtitles
- Dynamically generated subtitles
- Word-wrapped and aspect-ratio-aware
- Time-synchronized with narration
- Rendered using Canvas and composited with FFmpeg

### Iterative Editing & Version History
- Every generated video is stored as a version
- Versions persist across page reloads using localStorage
- Each version stores:
  - Transcript
  - Voice settings
  - Language
  - Aspect ratio
  - Background configuration
  - Video URL
- Users can:
  - Load previous versions into the form
  - Preview older videos
  - Download any previous version
  - See a summary of what changed between versions

### Storage & State
- File storage: local filesystem (`tmp/`) for generated assets
- Version metadata: persisted in browser localStorage
- State is maintained across sessions (POC-level persistence)

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- OpenAI APIs
  - Text-to-Speech
  - Image Generation
- FFmpeg (video/audio processing)
- Canvas (subtitle rendering)

### Infrastructure
- Docker (required for FFmpeg and native dependencies)
- Railway (deployment platform)

## Architecture Overview

1. **Text-to-Speech**
   - Uses OpenAI TTS to generate narration audio
   - Voice speed and gender are mapped to provider-level settings

2. **Subtitle Rendering**
   - Text is split into timed chunks
   - Subtitles are rendered as transparent PNG images using Canvas
   - Text wrapping adapts to aspect ratio

3. **Video Composition**
   - FFmpeg combines:
     - Background (color/image/generated image)
     - Subtitle images (overlaid with time-based filters)
     - Audio narration
   - Output is an MP4 video

4. **Versioning**
   - Each generation produces a version object
   - Versions are stored client-side for fast iteration
   - API returns stable URLs for preview and download


## Why These Design Choices

### Why FFmpeg?
- Industry standard for media processing
- Precise control over timing, overlays, and encoding
- Reliable for POC and production-grade pipelines

### Why Canvas for Subtitles?
- Allows precise control over typography and layout
- Easier to adapt text wrapping for different aspect ratios
- Avoids relying on FFmpeg `drawtext`, which is not always available

### Why client-side version storage?
- Keeps the POC simple and fast
- Satisfies persistence requirements without introducing database complexity
- Easy to migrate to a database in a future iteration

## Challenges Faced

### Native Dependencies
- Canvas and FFmpeg require system-level libraries
- Docker was introduced to ensure consistent availability across environments

### Subtitle Synchronization
- Ensuring subtitles remained in sync with speech over longer audio durations
- Required dynamic timing based on word distribution and audio duration

### Aspect Ratio Handling
- Subtitles needed different wrapping and spacing for 9:16 vs 16:9
- Implemented adaptive layout logic in subtitle rendering

### Language Selection and Translation

One challenge encountered was defining the correct behavior for language selection.

Currently:
- The selected language represents the language of the input text
- Text-to-speech is generated using the provided transcript as-is
- The UI explicitly communicates that the text should be written in the selected language

This approach avoids surprising behavior where:
- A user enters English text
- Selects another language
- Receives an output that does not match expectations

### Future Improvements
In a more advanced version of the product, language selection could enable:
- Automatic translation of the transcript before speech generation
- Batch generation of the same video in multiple languages
- Language validation or detection with user feedback
- Per-language voice and subtitle customization

These features were intentionally left out of the POC to keep the scope focused, avoid ambiguous UX, and ensure predictable behavior.

## Running the App Locally

### Prerequisites
- Node.js 22+
- FFmpeg installed locally
- OpenAI API key

### Environment Variables
Create a `.env.local` file:

```bash
OPENAI_API_KEY=your_open_api_key_here
```
### Install & Run
```bash
npm install
npm run dev
```
The app will be available at `http://localhost:3000`.


## Deployment Notes

- Deployed using Railway with Docker enabled
- FFmpeg and Canvas dependencies are installed at build time
- API routes stream generated files through controlled endpoints instead of exposing filesystem paths


## Future Improvements

- Database-backed persistence for projects and versions
- Background video uploads
- Batch generation across multiple languages
- More advanced subtitle animations
- User authentication and saved projects
- For this proof of concept, generated assets (audio, subtitle images, and videos) are stored on the local filesystem (`tmp/` directory). For a production-grade system, filesystem storage would be replaced with object storage such as AWS S3, Google Cloud Storage, Cloudflare R2


## Notes

This POC intentionally prioritizes:
- Clear architecture
- Correct handling of production constraints
- Extensibility for future iterations

Over-engineering (e.g., database, auth, queues) was intentionally avoided to keep the scope appropriate for a take-home assignment.

## Demo Walkthrough

A short video walkthrough demonstrating the main workflow and features of the application is available here:

https://www.loom.com/share/96abbc9338ce4eb5a5c84acac7bd17d2