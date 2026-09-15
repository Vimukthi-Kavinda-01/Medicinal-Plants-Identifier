import React from 'react';
import { PottedPlant, Sparkle } from '@phosphor-icons/react';

export default function Header({ backendConfigured }) {
  return (
    <header className="sticky top-0 z-40 bg-herb-800 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a href="#detect" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-herb-600 flex items-center justify-center text-white shadow-inner group-hover:bg-herb-500 transition-colors">
            <PottedPlant size={24} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">HerbSense</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-herb-700/80 px-2 py-0.5 rounded-full text-herb-200">
                <Sparkle size={12} weight="fill" /> YOLO11n AI
              </span>
            </div>
            <p className="text-[11px] text-herb-200 font-medium">Medicinal Plant Identifier</p>
          </div>
        </a>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#detect"
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-herb-100 hover:bg-herb-700 transition-colors"
          >
            Detect
          </a>
          <a
            href="#how-it-works"
            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-herb-100 hover:bg-herb-700 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#about"
            className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-herb-100 hover:bg-herb-700 transition-colors"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

