"use client";
import { useRef } from "react";

type Props = {
  onFileSelected: (file: File) => void;
  previewUrl?: string | null;
};

export default function ImageUploader({ onFileSelected, previewUrl }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <button
          type="button"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900"
          onClick={() => inputRef.current?.click()}
        >
          Choose image
        </button>
        <span className="text-xs text-gray-500">
          PNG or JPG up to ~5MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelected(f);
        }}
      />

      <div className="border rounded-md p-2 bg-white/50 dark:bg-black/30">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="preview"
            className="max-h-[360px] w-auto object-contain mx-auto"
          />
        ) : (
          <div className="text-center text-sm text-gray-500 py-16">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
}
