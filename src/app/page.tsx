"use client";
import { useEffect, useState } from "react";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ url: string; threshold: number }>>([]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setDetections([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("threshold", String(threshold));
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Detection failed");
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error(data?.error ?? "Detection failed");
      setDetections(data);
      // Save recent upload entry (non-persistent; cleared on refresh)
      // We intentionally do not revoke this URL so the thumbnail remains visible until page refresh
      if (file) {
        const entryUrl = URL.createObjectURL(file);
        setHistory((prev) => [{ url: entryUrl, threshold }, ...prev].slice(0, 8));
      }
    } catch (e: any) {
      setError(e?.message ?? "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setDetections([]);
    setError(null);
  };

  
  const DEFAULT_THRESHOLD = 0.25;
  const canDetect = !!file && !loading; 

  // Shared panel style
  const panelClass = "rounded-md p-2 bg-white/50 dark:bg-black/30 w-full flex items-center justify-center";
  const panelInnerClass = "relative w-full max-w-[520px] aspect-[4/3] max-h-[60vh] flex items-center justify-center";

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Object Detection Demo</h1>
        <p className="text-sm text-gray-500">Upload an image, set a threshold, and detect objects.</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <section>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Uploaded Image:</div>
          <div className={panelClass}>
            <div className={panelInnerClass}>
              <ImageUploader
                onFileSelected={(f) => {
                  setFile(f);
                  // Reset previous detection output when a new image is chosen
                  setDetections([]);
                  setError(null);
                }}
                previewUrl={previewUrl}
                onClear={handleRemoveImage}
                onError={setError}
              />
               {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </div>
          <div className="mt-4">
            <Controls
              threshold={threshold}
              onThresholdChange={setThreshold}
              onDetect={handleDetect}
              onReset={()=> setThreshold(DEFAULT_THRESHOLD)}
              disabled={!canDetect}
            />
          </div>
        </section>

        <section>
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Result:</div>
          <div className={panelClass}>
            <div className={panelInnerClass}>
              {previewUrl ? (
                <DetectionCanvas
                  imageUrl={previewUrl}
                  detections={detections}
                  loading={loading}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full select-none text-gray-400 border rounded-md bg-white/50 dark:bg-black/30">
                  <span>No result yet</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent uploads (non-persistent) */}
        <section className="md:col-span-2">
          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Examples</div>
          <div className="w-full overflow-x-auto border rounded-md bg-white/50 dark:bg-black/30">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-3">Upload Image</th>
                  <th className="p-3">Confidence threshold</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td className="p-3 text-gray-400" colSpan={2}>No recent examples</td>
                  </tr>
                ) : (
                  history.map((h, i) => (
                    <tr key={i} className="border-t border-gray-200/60">
                      <td className="p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={h.url} alt="Recent upload" className="h-16 w-16 object-cover rounded" />
                      </td>
                      <td className="p-3 align-middle">{h.threshold.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
