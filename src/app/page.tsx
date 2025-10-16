"use client";
import { useEffect, useMemo, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import Controls from "@/components/Controls";
import DetectionCanvas from "@/components/DetectionCanvas";
import type { Detection } from "@/types/detection";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState(0.25);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setDetections([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("threshold", threshold.toString());
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Detection failed");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setDetections(data);
      } else if (data.error) {
        setError(data.error);
      } else {
        setDetections([]);
      }
      setResultUrl(previewUrl);
    } catch (err: any) {
      setError(err.message || "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => setFile(null);
  const handleResetThreshold = () => setThreshold(0.25);

  // Shared panel style
  const panelClass = "rounded-md p-2 bg-white/50 dark:bg-black/30 w-full flex items-center justify-center";
  const panelBoxStyle = { width: "100%", maxWidth: 520, aspectRatio: "4/3", maxHeight: "60vh" };

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Object Detection Demo</h1>
        <p className="text-sm text-gray-500">Upload an image, set a threshold, and detect objects.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input panel */}
        <section>
          <div className={panelClass} style={panelBoxStyle}>
            <ImageUploader
              onFileSelected={setFile}
              previewUrl={previewUrl}
              onClear={handleRemoveImage}
              onError={(msg) => alert(msg)}
            />
          </div>
          <div className="mt-4">
            <Controls
              threshold={threshold}
              onThresholdChange={setThreshold}
              onDetect={handleDetect}
              onReset={handleResetThreshold}
              disabled={!file}
            />
          </div>
        </section>
        {/* Result panel */}
        <section>
          <div
            className={
              resultUrl
                ? "rounded-md p-2 bg-white/50 dark:bg-black/30 w-full flex items-center justify-center"
                : panelClass
            }
            style={panelBoxStyle}
          >
            {resultUrl ? (
              <DetectionCanvas imageUrl={resultUrl} detections={detections} />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full select-none text-gray-400 border rounded-md bg-white/50 dark:bg-black/30">
                <span>No result yet</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
