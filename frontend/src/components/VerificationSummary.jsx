import React from 'react';
import { SealCheck, ArrowsClockwise, SkipForward } from '@phosphor-icons/react';

const STATUS_STYLES = {
  confirmed: { Icon: SealCheck, box: 'border-herb-200 bg-herb-50 text-herb-900', title: 'Verified by your answers' },
  adjusted: { Icon: ArrowsClockwise, box: 'border-accent-200 bg-accent-50 text-accent-900', title: 'Prediction adjusted' },
  skipped: { Icon: SkipForward, box: 'border-gray-200 bg-gray-50 text-gray-800', title: 'Not cross-checked' },
  not_needed: { Icon: SealCheck, box: 'border-herb-200 bg-herb-50 text-herb-900', title: 'High-confidence match' },
};

/** Step 6 outcome: was the prediction verified, adjusted or left as-is? */
export default function VerificationSummary({ verification, ranked }) {
  if (!verification) return null;
  const style = STATUS_STYLES[verification.status] || STATUS_STYLES.skipped;
  const { Icon } = style;
  const checked = ranked.filter((item) => item.compared > 0);

  return (
    <div className={`rounded-2xl border p-4 text-xs ${style.box}`}>
      <div className="mb-1 flex items-center gap-2 text-sm font-bold">
        <Icon size={18} weight="fill" /> {style.title}
      </div>
      <p className="leading-relaxed">{verification.message}</p>

      {checked.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-black/5 pt-3">
          {checked.map((item) => (
            <li key={item.class} className="flex justify-between gap-3">
              <span className="font-semibold">{item.name}</span>
              <span className="text-right opacity-80">
                image {Math.round(item.modelConfidence * 100)}% · features {item.matched}/{item.compared} match → {item.percent}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}