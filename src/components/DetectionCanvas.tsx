"use client";
import { useEffect, useRef } from "react";
import type { Detection } from "@/types/detection";

type Props = {
  imageUrl?: string | null;
  imageSize?: { width: number; height: number } | null; // original image dims
  detections: Detection[];
  threshold: number; // 0..1
};

export default function DetectionCanvas({ imageUrl, imageSize, detections, threshold }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Fit canvas to displayed size (CSS will limit height)
      const containerMaxH = 360; // keep similar size to preview
      const scale = Math.min(1, containerMaxH / img.height);
      const dispW = Math.round(img.width * scale);
      const dispH = Math.round(img.height * scale);

      canvas.width = dispW;
      canvas.height = dispH;

      // draw image
      ctx.clearRect(0, 0, dispW, dispH);
      ctx.drawImage(img, 0, 0, dispW, dispH);

      // scale detections from original size to display size
      const baseW = imageSize?.width ?? img.width;
      const baseH = imageSize?.height ?? img.height;
      const sx = dispW / baseW;
      const sy = dispH / baseH;

      ctx.lineWidth = 2;
      ctx.font = "12px ui-sans-serif, system-ui";

      detections
        .filter((d) => d.score >= threshold)
        .forEach((d) => {
          const x = Math.round(d.box.x * sx);
          const y = Math.round(d.box.y * sy);
          const w = Math.round(d.box.w * sx);
          const h = Math.round(d.box.h * sy);

          ctx.strokeStyle = "#ef4444"; // red-500
          ctx.fillStyle = "rgba(239,68,68,0.15)";
          ctx.strokeRect(x, y, w, h);
          ctx.fillRect(x, y, w, h);

          // label background
          const label = `${d.label} ${d.score.toFixed(2)}`;
          const textW = ctx.measureText(label).width + 6;
          const textH = 16;
          ctx.fillStyle = "#ef4444";
          ctx.fillRect(x, Math.max(0, y - textH), textW, textH);
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, x + 3, Math.max(10, y - 4));
        });
    };
    img.src = imageUrl;
  }, [imageUrl, detections, threshold, imageSize]);

  return (
    <div className="border rounded-md p-2 bg-white/50 dark:bg-black/30">
      <canvas ref={canvasRef} className="max-h-[360px] w-auto block mx-auto" />
    </div>
  );
}
