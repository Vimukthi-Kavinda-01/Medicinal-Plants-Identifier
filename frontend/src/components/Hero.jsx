import React from 'react';
import { Sparkle, ShieldCheck, Camera, Cpu, ArrowDown } from '@phosphor-icons/react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#deede2] bg-[#edf8f0] px-4 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="relative mx-auto flex max-w-5xl items-end justify-between gap-8 sm:px-2">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-herb-200 bg-white/70 px-3 py-1 text-xs font-bold text-herb-700 shadow-sm">
            <Sparkle size={13} weight="fill" className="text-herb-500" />
            <span>Field-ready plant intelligence</span>
          </div>

          {/* Heading */}
          <h1 className="serif-heading mb-4 text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-herb-900 sm:text-6xl">
            Know the plant<br />
            <span className="text-herb-500">behind the leaf.</span>
          </h1>

          {/* Description */}
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-herb-800/75 sm:text-base">
            Upload a photo or use your camera to identify a medicinal plant, then get a clear AI-generated field description alongside its confidence and botanical profile.
          </p>

          {/* Quick feature tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 rounded-md border border-herb-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-herb-700">
              <Camera size={13} /> Direct Camera Capture
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-herb-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-herb-700">
              <Cpu size={13} /> YOLO11n Logic
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-herb-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-herb-700">
              <ShieldCheck size={13} /> Secure Server Proxy
            </span>
          </div>
        </div>

        {/* Decorative graphic / icon for larger screens */}
        <div className="hidden h-40 w-40 flex-col items-center justify-center rounded-[32px] border border-herb-200 bg-white/60 p-4 shadow-[0_16px_35px_rgba(27,85,48,0.08)] backdrop-blur-sm md:flex">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-herb-100 text-herb-600 shadow-inner">
            <ArrowDown size={28} weight="bold" className="animate-bounce" />
          </div>
          <span className="text-xs font-bold text-herb-800">Start with a photo</span>
          <span className="text-[10px] text-herb-600">Results in seconds</span>
        </div>
      </div>
    </section>
  );
}

