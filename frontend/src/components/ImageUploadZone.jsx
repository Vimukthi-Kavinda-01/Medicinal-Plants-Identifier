import React, { useRef, useState } from 'react';
import { UploadSimple, X, Image as ImageIcon } from '@phosphor-icons/react';

export default function ImageUploadZone({ imagePreview, onImageSelected, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {imagePreview ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 border-2 border-herb-400 shadow-md">
          <img
            src={imagePreview}
            alt="Selected plant"
            className="w-full h-64 sm:h-80 object-contain mx-auto"
          />

          {/* Remove / Replace Button */}
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg active:scale-95"
            title="Remove plant image"
          >
            <X size={18} weight="bold" />
          </button>

          {/* Bottom badge indicator */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5 font-medium">
            <ImageIcon size={14} /> Ready for AI Identification
          </div>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[220px] sm:min-h-[260px] ${
            isDragging
              ? 'border-herb-500 bg-herb-100 scale-[0.99]'
              : 'border-herb-300 hover:border-herb-500 bg-herb-50/50 hover:bg-herb-100/60'
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-herb-100 flex items-center justify-center text-herb-600 mb-3 shadow-sm">
            <UploadSimple size={28} weight="bold" />
          </div>
          <h3 className="font-bold text-gray-800 text-base sm:text-lg mb-1">
            Upload Plant Image
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-3">
            Drag & drop your photo here, or click to browse from device gallery
          </p>
          <span className="text-[11px] font-semibold text-accent-700 bg-accent-100 px-3 py-1 rounded-full">
            Supports JPG, PNG, WEBP
          </span>
        </div>
      )}
    </div>
  );
}

