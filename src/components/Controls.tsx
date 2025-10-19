"use client";

type Props = {
  threshold: number;
  onThresholdChange: (v: number) => void;
  onDetect: () => void;
  onReset?: () => void;
  disabled?: boolean;
};

export default function Controls({ threshold, onThresholdChange, onDetect, onReset, disabled }: Props) {
  const inputId = "threshold";

  return (
    <div className="w-full space-y-4">
      <div className="mb-2">
        <label htmlFor={inputId} className="block text-sm font-medium mb-1">Confidence threshold</label>
        <div className="flex items-center gap-3">
          <input
            id={inputId}
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => onThresholdChange(e.currentTarget.valueAsNumber)}
            className="w-full max-w-[220px] accent-orange-400 h-2 rounded-lg appearance-none bg-gray-200"
          />
            <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 border text-gray-700">
              {threshold.toFixed(2)}
              </span>
        </div>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onDetect}
          className="rounded-md px-6 py-2 text-base font-semibold bg-gradient-to-r from-orange-300 to-orange-400 text-white shadow disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-400 hover:to-orange-500 transition"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md px-6 py-2 text-base font-semibold bg-gray-100 text-gray-700 border border-gray-300 shadow hover:bg-gray-200 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
