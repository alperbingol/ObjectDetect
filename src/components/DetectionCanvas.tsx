"use client";
import { useEffect, useRef, useState } from "react";
import type { Detection } from "@/types/detection";

type Props = {
  imageUrl?: string | null;
  detections?: any[];
  loading?: boolean;
};

export default function DetectionCanvas({ imageUrl, detections, loading }: Props) {
  // Deterministic label->color mapping
  const palette = [
    "#EF4444", // red-500
    "#10B981", // emerald-500
    "#3B82F6", // blue-500
    "#F59E0B", // amber-500
    "#8B5CF6", // violet-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
    "#22C55E", // green-500
    "#E11D48", // rose-600
    "#0EA5E9", // sky-500
    "#A855F7", // purple-500
    "#84CC16", // lime-500
    "#06B6D4", // cyan-500
    "#F43F5E", // rose-500
    "#D946EF", // fuchsia-500
  ];
  const hashLabel = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
    return Math.abs(h);
  };
  const colorFor = (label?: string) => palette[(hashLabel(label || "") % palette.length)];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [metrics, setMetrics] = useState<{ offsetX: number; offsetY: number; scaleX: number; scaleY: number } | null>(null);

  const computeMetrics = () => {
    const cont = containerRef.current;
    const img = imgRef.current;
    if (!cont || !img) return;
    const contRect = cont.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const naturalW = img.naturalWidth || 0;
    const naturalH = img.naturalHeight || 0;
    if (!naturalW || !naturalH) return;
    const offsetX = (contRect.width - imgRect.width) / 2;
    const offsetY = (contRect.height - imgRect.height) / 2;
    const scaleX = imgRect.width / naturalW;
    const scaleY = imgRect.height / naturalH;
    setMetrics({ offsetX, offsetY, scaleX, scaleY });
  };

  useEffect(() => {
    computeMetrics();
    const onResize = () => computeMetrics();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className={`relative w-full h-full max-w-[520px] max-h-[60vh] border rounded-md bg-white/50 dark:bg-black/30 flex items-center justify-center`}>
        {imageUrl ? (
          <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
            <img
              ref={imgRef}
              src={imageUrl}
              alt="result preview"
              className="max-h-full max-w-full object-contain object-center rounded-md shadow-sm"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              onLoad={computeMetrics}
            />
            {/* Draw bounding boxes if detections exist */}
            {Array.isArray(detections) && detections.length > 0 && metrics && (
              <div className="absolute inset-0 pointer-events-none">
                {detections.map((det, i) => {
                  const box = det.box || det.bbox || det.bounding_box;
                  const label = det.label || det.class || det.name;
                  const score = det.score || det.confidence;
                  if (!box) return null;
                  // Support both [x, y, w, h] and {x, y, w, h}
                  let x: number, y: number, w: number, h: number;
                  if (Array.isArray(box)) {
                    [x, y, w, h] = box as [number, number, number, number];
                  } else if ("xmin" in box) {
                    const xmin = box.xmin as number;
                    const ymin = box.ymin as number;
                    const xmax = box.xmax as number;
                    const ymax = box.ymax as number;
                    x = xmin; y = ymin; w = xmax - xmin; h = ymax - ymin;
                  } else {
                    ({ x, y, w, h } = box as { x: number; y: number; w: number; h: number });
                  }
                  const left = metrics.offsetX + x * metrics.scaleX;
                  const top = metrics.offsetY + y * metrics.scaleY;
                  const width = Math.max(0, w * metrics.scaleX);
                  const height = Math.max(0, h * metrics.scaleY);
                  const color = colorFor(label);
                  return (
                    <div
                      key={i}
                      className="absolute rounded"
                      style={{
                        left,
                        top,
                        width,
                        height,
                        border: `2px solid ${color}`,
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 text-white text-[11px] leading-none px-1.5 py-0.5 rounded-sm shadow"
                        style={{ backgroundColor: color, transform: "translateY(-100%)" }}
                      >
                        {label} {score !== undefined ? score.toFixed(2) : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div aria-label="Loading" className="h-10 w-10 rounded-full border-4 border-white/60 border-t-orange-400 animate-spin"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full select-none text-gray-400">
            <span>No image</span>
          </div>
        )}
      </div>
    </div>
  );
}
