import React, { useEffect } from 'react';
import { Camera, X, CircleNotch } from '@phosphor-icons/react';

export default function CameraModal({ isOpen, videoRef, onCapture, onClose, error }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gray-950/80 border-b border-gray-800">
          <div className="flex items-center gap-2 text-white">
            <Camera size={20} className="text-herb-400" />
            <span className="font-semibold text-sm sm:text-base">Camera Viewfinder</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Close camera"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-400 max-w-xs">
              <p className="font-semibold mb-2">Camera Error</p>
              <p className="text-xs text-gray-300">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-800 text-white text-xs font-semibold hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Aiming focus crosshair / frame guideline */}
              <div className="pointer-events-none absolute inset-8 border-2 border-white/30 rounded-2xl flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-herb-400 rounded-tl"></div>
                  <div className="w-5 h-5 border-t-2 border-r-2 border-herb-400 rounded-tr"></div>
                </div>
                <div className="text-center">
                  <span className="bg-black/60 text-white/90 text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                    Center the plant leaf or flower
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-5 h-5 border-b-2 border-l-2 border-herb-400 rounded-bl"></div>
                  <div className="w-5 h-5 border-b-2 border-r-2 border-herb-400 rounded-br"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Controls / Shutter */}
        <div className="p-4 sm:p-5 bg-gray-950 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onCapture}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-herb-600 hover:bg-herb-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-herb-900/50 transition-all"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span>Capture Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

