"use client";
import { useMemo, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import Controls from "@/components/Controls";
import DetectionCanvas from "@/components/DetectionCanvas";
import type { Detection } from "@/types/detection";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.25);
  // Placeholder state for Phase 1; will be populated by API in Phase 3/4
  const [detections] = useState<Detection[]>([]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const handleDetect = () => {
    // Phase 1: no-op. In Phase 3, this will call /api/detect.
    alert("Detect clicked. In the next phase, we'll call the API.");
  };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Object Detection Demo</h1>
        <p className="text-sm text-gray-500">Upload an image, set a threshold, and detect objects.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <section>
          <ImageUploader onFileSelected={setFile} previewUrl={previewUrl} />
          <div className="mt-4">
            <Controls
              threshold={threshold}
              onThresholdChange={setThreshold}
              onDetect={handleDetect}
              disabled={!file}
            />
          </div>
        </section>

        <section>
          <DetectionCanvas
            imageUrl={previewUrl}
            imageSize={null}
            detections={detections}
            threshold={threshold}
          />
        </section>
      </main>
    </div>
  );
}
