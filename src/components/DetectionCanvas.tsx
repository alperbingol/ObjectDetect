"use client";
import { useEffect, useRef } from "react";
import type { Detection } from "@/types/detection";


const COLORS = ["#F97316", "#10B981", "#3B82F6", "#A855F7", "#E11D48"];
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i);
  return Math.abs(h);
};
const colorFor = (label = "") => COLORS[hash(label) % COLORS.length];

type Props = {
  imageUrl?: string | null;
  detections: Detection[];
  loading?: boolean;
};

export default function DetectionCanvas({ imageUrl, detections, loading }: Props) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Draw base image at natural resolution
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      // Make stroke look ~2 CSS px after canvas scaling
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / canvas.width || 1;
      const targetCssStroke = 2;
      const deviceStroke = Math.max(1, targetCssStroke / scaleX);
      ctx.lineWidth = deviceStroke;

      // Font size scaled so text remains ~12 CSS px after canvas scaling
      const targetCssFont = 12; // px
      const deviceFont = Math.max(8, Math.round(targetCssFont / scaleX));

      // Draw detections in natural pixel coords
      if (detections.length > 0) {
        detections.forEach((det) => {
          const { label, score } = det;
          const { xmin, ymin, xmax, ymax } = det.box;
          const x = xmin;
          const y = ymin;
          const w = Math.max(0, xmax - xmin);
          const h = Math.max(0, ymax - ymin);
          const color = colorFor(label);

          ctx.strokeStyle = color;
          ctx.strokeRect(x, y, w, h);

          // Label chip
          const text = `${label}${score !== undefined ? ` ${score.toFixed(2)}` : ""}`.trim();
          if (text) {
            ctx.font = `${deviceFont}px sans-serif`;
            ctx.textBaseline = "top";
            const paddingX = Math.max(2, Math.round(6 / scaleX));
            const paddingY = Math.max(1, Math.round(3 / scaleX));
            const textW = ctx.measureText(text).width;
            const rectW = textW + paddingX * 2;
            const rectH = deviceFont + paddingY * 2;
            const labelX = x;
            const labelY = Math.max(0, y - rectH - 2);
            ctx.fillStyle = color;
            ctx.fillRect(labelX, labelY, rectW, rectH);
            ctx.fillStyle = "#ffffff";
            ctx.fillText(text, labelX + paddingX, labelY + paddingY);
          }
        });
      }
    };
    img.src = imageUrl;
  }, [imageUrl, detections]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full max-w-[520px] max-h-[60vh] border rounded-md bg-white/50 dark:bg-black/30 flex items-center justify-center">
        {imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full rounded-md shadow-sm"
              aria-label="Detection result"
            />
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
