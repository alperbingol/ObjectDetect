## Resaro – Object Detection Demo (Next.js)

Simple image object detection with a clean React/Next.js app and a Hugging Face model.

### Stack
- Next.js App Router
- Canvas overlay for drawing results
- Server Route calling HF DETR (`facebook/detr-resnet-50`)

### Setup
1) Create `.env.local` in the project root:
```
HF_API_KEY=hf_...
```
2) Install & run:
```
npm install
npm run dev
```
Open `http://localhost:3000`.

### How it works
- Upload image → preview with a Blob URL.
- Click Detect → the server forwards raw image bytes to Hugging Face.
- Server filters detections by `threshold` and returns results.
- The client draws boxes and labels on a canvas at the image’s natural size; CSS scales it responsively.

### Features worth noting
- Canvas-based rendering: boxes and labels scale cleanly at any size.
- Server-side threshold filtering; no API key in the client.
- Simple, accessible UI: labeled panels, single error banner.
- Recent Examples table (session-only) to revisit uploads.

### Project structure
- `src/app/page.tsx` – page state and layout
- `src/app/api/detect/route.ts` – server call to HF + filtering
- `src/components/ImageUploader.tsx` – hidden input uploader
- `src/components/Controls.tsx` – threshold slider + actions
- `src/components/DetectionCanvas.tsx` – canvas drawing
- `src/components/Examples.tsx` – recent uploads table
- `src/types/detection.ts` – HF-aligned detection type

### Notes
- No hard-coded secrets; requires `HF_API_KEY`.
- Cold starts/queued responses from HF are forwarded as-is.
- This demo focuses on clarity over heavy abstractions.

