import React, { useEffect } from 'react';
import { CheckCircle, WarningCircle, Info, X } from '@phosphor-icons/react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-slide-up">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
          isError
            ? 'bg-red-950/90 text-red-100 border-red-800'
            : isSuccess
            ? 'bg-herb-900/90 text-herb-100 border-herb-700'
            : 'bg-gray-900/90 text-gray-100 border-gray-700'
        }`}
      >
        {isError ? (
          <WarningCircle size={22} className="text-red-400 shrink-0" weight="fill" />
        ) : isSuccess ? (
          <CheckCircle size={22} className="text-herb-300 shrink-0" weight="fill" />
        ) : (
          <Info size={22} className="text-accent-300 shrink-0" weight="fill" />
        )}

        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

