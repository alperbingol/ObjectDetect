"use client";
import { useId } from "react";

type Props = {
  threshold: number; // 0..1
  onThresholdChange: (v: number) => void;
  onDetect: () => void;
  disabled?: boolean;
};

export default function Controls({ threshold, onThresholdChange, onDetect, disabled }: Props) {
  const id = useId();
  return (
    <div className="w-full space-y-4">
      <div>
        <label htmlFor={id} className="text-sm font-medium">Confidence threshold: {threshold.toFixed(2)}</label>
        <input
          id={id}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={threshold}
          onChange={(e) => onThresholdChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onDetect}
        className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        Detect Objects
      </button>
    </div>
  );
}
