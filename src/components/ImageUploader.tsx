"use client";
import { useCallback, useRef, useState } from "react";

type Props = {
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
  onClear?: () => void;
  onError?: (msg: string) => void;
  maxSizeMb?: number;
};

type FitMode = "contain" | "cover" | "auto";

export default function ImageUploader({ onFileSelected, previewUrl, onClear, onError, maxSizeMb = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setDragOver] = useState(false);

  // Accept any image type for input and drag-and-drop
  const ACCEPT = "image/*";

  const validateAndSend = useCallback(
    (file: File) => {
      // Only check size, let browser filter type for input, but check for drag-and-drop
      if (!file.type.startsWith("image/")) {
        onError?.("Only image files are supported.");
        return;
      }
      const maxBytes = maxSizeMb * 1024 * 1024;
      if (file.size > maxBytes) {
        onError?.(`File is too large. Max ${maxSizeMb}MB.`);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, onError, maxSizeMb]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) validateAndSend(f);
    // Reset input value so selecting the same file again will fire onChange
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSend(f);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={onInputChange}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative w-full h-full max-w-[520px] max-h-[60vh] border rounded-md bg-white/50 dark:bg-black/30 flex items-center justify-center transition-all duration-150 ${isDragOver ? "ring-2 ring-blue-500" : ""}`}
      >
        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Replace (upload) button - top-left */}
            <button
              type="button"
              aria-label="Replace image"
              onClick={() => inputRef.current?.click()}
              className="absolute top-2 left-2 z-10 rounded-full bg-white/90 dark:bg-black/70 border shadow p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
              style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Upload a different image"
            >
              {/* Simple image icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <rect x="4" y="6" width="16" height="12" rx="2" ry="2" />
                <circle cx="16" cy="10" r="1.5" />
                <path d="M6 16l4-4 3 3 4-4 3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {/* Remove button */}
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  onClear?.();
                  if (inputRef.current) inputRef.current.value = "";
                }}
                aria-label="Remove image"
                className="absolute top-2 right-2 z-10 rounded-full bg-white/90 dark:bg-black/70 border shadow p-1 text-base hover:bg-gray-200 dark:hover:bg-gray-800"
                style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <span style={{ fontWeight: 700, fontSize: 18, lineHeight: 1 }}>✕</span>
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-md shadow-sm"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full select-none">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-300 to-orange-400 text-white shadow hover:from-orange-400 hover:to-orange-500 transition mb-4"
              onClick={() => inputRef.current?.click()}
            >
              Upload image
            </button>
            <p className="mb-1 text-gray-500">Drag and drop an image here</p>
            <p className="text-xs text-gray-400">or click "Upload image"</p>
          </div>
        )}
      </div>
    </div>
  );
}
