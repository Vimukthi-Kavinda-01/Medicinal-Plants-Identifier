import React from 'react';
import { Leaf, Sparkle } from '@phosphor-icons/react';

export default function Header({ backendConfigured }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e3efe6] bg-white/90 text-herb-900 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <a href="#detect" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-herb-700 text-white shadow-[0_7px_16px_rgba(26,92,53,0.22)] transition-colors group-hover:bg-herb-600">
            <Leaf size={22} weight="fill" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-herb-900">HerbSense</span>
              <span className="hidden items-center gap-1 rounded-full bg-herb-50 px-2 py-0.5 text-[11px] font-semibold text-herb-700 sm:inline-flex">
                <Sparkle size={12} weight="fill" /> YOLO11n AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-gray-500">Medicinal plant intelligence</p>
          </div>
        </a>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#detect"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:text-sm"
          >
            Detect
          </a>
          <a
            href="#how-it-works"
            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:text-sm"
          >
            How it Works
          </a>
          <a
            href="#about"
            className="hidden rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-herb-50 hover:text-herb-700 sm:inline-block sm:text-sm"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

