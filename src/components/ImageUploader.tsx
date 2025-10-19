"use client";
import { useRef } from "react";

type Props = {
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
  onClear: () => void;
  onError: (msg: string) => void;
  maxSizeMb?: number;
};

export default function ImageUploader({ onFileSelected, previewUrl, onClear, onError, maxSizeMb = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return onError("Only image files are supported.");
    if (file.size > maxSizeMb * 1024 * 1024) return onError(`File is too large. Max ${maxSizeMb}MB.`);
    onFileSelected(file);
    e.target.value = "";
  };

  const handleClear = () => {
    onClear?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <div className="relative w-full h-full max-w-[520px] max-h-[60vh] border rounded-md bg-white/50 dark:bg-black/30 flex items-center justify-center">
        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute top-2 left-2 rounded-full p-1  border shadow  hover:bg-gray-200 "
              title="Upload a different image"
            >
              ↻ 
            </button>
      
            <button
              type="button"
              onClick={handleClear}
              className="flex h-7 w-7 items-center justify-center absolute top-2 right-2 rounded-full border shadow hover:bg-gray-200 font-bold"
            >
              ✕
            </button>

             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt=""
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
            <p className="text-xs text-gray-400">Select an image to preview and detect</p>
          </div>
        )}
      </div>
    </div>
  );
}
