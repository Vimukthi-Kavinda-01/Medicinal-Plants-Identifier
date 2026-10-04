import React from 'react';
import { ShieldWarning, WarningOctagon, Info } from '@phosphor-icons/react';

const SEVERITY_STYLES = {
  critical: { Icon: WarningOctagon, box: 'border-red-200 bg-red-50 text-red-900', icon: 'text-red-600' },
  caution: { Icon: ShieldWarning, box: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'text-amber-600' },
  info: { Icon: Info, box: 'border-accent-200 bg-accent-50 text-accent-900', icon: 'text-accent-600' },
};

/** Step 9 – safety warning shown with every final result. */
export default function WarningBanner({ warning }) {
  if (!warning) return null;
  const style = SEVERITY_STYLES[warning.severity] || SEVERITY_STYLES.info;
  const { Icon } = style;

  return (
    <div role="alert" className={`rounded-2xl border p-4 text-xs ${style.box}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-bold">
        <Icon size={20} weight="fill" className={style.icon} /> {warning.title}
      </div>
      <ul className="list-disc space-y-1 pl-5 leading-relaxed">
        {warning.messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}