import React from 'react';
import { ListNumbers } from '@phosphor-icons/react';
import { getConfidenceStyle } from '../lib/confidence';

/** Step 4 – the three best predictions with confidence scores. */
export default function Top3Predictions({ predictions, level }) {
  const overall = getConfidenceStyle(level);

  return (
    <section className="rounded-2xl border border-herb-200 bg-white p-4 sm:p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold text-herb-900">
          <ListNumbers size={18} weight="bold" className="text-herb-600" />
          Top {predictions.length} predictions
        </h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${overall.badge}`}>{overall.label}</span>
      </div>

      <ol className="space-y-3">
        {predictions.map((prediction, index) => (
          <li key={prediction.class} className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-herb-100 text-xs font-bold text-herb-800">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="truncate text-gray-800">{prediction.name}</span>
                <span className="ml-2 text-herb-800">{prediction.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${index === 0 ? overall.bar : 'bg-gray-400'}`}
                  style={{ width: `${prediction.percent}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}