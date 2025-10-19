"use client";
type Item = { url: string; threshold: number };

export default function Examples({ items }: { items: Item[] }) {
  return (
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
            {items.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-400" colSpan={2}>No recent examples</td>
              </tr>
            ) : (
              items.map((h, i) => (
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
  );
}


