"use client";
import { useEffect, useRef } from "react";
import type { Detection } from "@/types/detection";

type Props = {
  imageUrl?: string | null;
  detections?: any[];
};

export default function DetectionCanvas({ imageUrl, detections }: Props) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className={`relative w-full h-full max-w-[520px] max-h-[60vh] ${
        imageUrl
          ? "bg-transparent"
          : "border rounded-md bg-white/50 dark:bg-black/30 flex items-center justify-center"
      }`}>
        {imageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={imageUrl}
              alt="result preview"
              className="max-h-full max-w-full object-contain rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
            {/* Draw bounding boxes if detections exist */}
            {Array.isArray(detections) && detections.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {detections.map((det, i) => {
                  const box = det.box || det.bbox || det.bounding_box;
                  const label = det.label || det.class || det.name;
                  const score = det.score || det.confidence;
                  if (!box) return null;
                  // Support both [x, y, w, h] and {x, y, w, h}
                  let x, y, w, h;
                  if (Array.isArray(box)) {
                    [x, y, w, h] = box;
                  } else {
                    ({ x, y, w, h } = box);
                  }
                  return (
                    <div
                      key={i}
                      className="absolute border-2 border-red-500 rounded"
                      style={{
                        left: x,
                        top: y,
                        width: w,
                        height: h,
                        pointerEvents: "none",
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow">
                        {label} {score !== undefined ? (score * 100).toFixed(1) + "%" : ""}
                      </div>
                    </div>
                  );
                })}
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
