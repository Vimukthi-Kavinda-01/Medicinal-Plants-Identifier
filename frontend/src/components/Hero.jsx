import React from 'react';
import { Sparkle, ShieldCheck, Camera, Cpu } from '@phosphor-icons/react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-herb-800 to-herb-700 text-white pt-8 pb-12 px-4 shadow-inner">
      <div className="max-w-4xl mx-auto text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
        <div className="sm:max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-herb-900/60 border border-herb-600/60 px-3 py-1 rounded-full text-xs font-semibold text-herb-200 mb-4 backdrop-blur-sm">
            <Sparkle size={13} weight="fill" className="text-accent-300" />
            <span>Roboflow Serverless AI Workflow</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3">
            Identify Medicinal <br />
            <span className="text-herb-200">Plants with AI</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-herb-100/90 leading-relaxed mb-5">
            Capture a photo in nature or upload from your gallery. Our deep learning model identifies species,
            evaluates confidence, and delivers medicinal uses right to your screen.
          </p>

          {/* Quick feature tags */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-herb-900/40 text-herb-100 px-2.5 py-1 rounded-md border border-herb-600/40">
              <Camera size={13} /> Direct Camera Capture
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-herb-900/40 text-herb-100 px-2.5 py-1 rounded-md border border-herb-600/40">
              <Cpu size={13} /> YOLO11n Logic
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-herb-900/40 text-herb-100 px-2.5 py-1 rounded-md border border-herb-600/40">
              <ShieldCheck size={13} /> Secure Server Proxy
            </span>
          </div>
        </div>

        {/* Decorative graphic / icon for larger screens */}
        <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 rounded-2xl bg-herb-600/40 border border-herb-500/30 p-4 shadow-lg backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-herb-500/50 flex items-center justify-center text-white mb-2 shadow-inner">
            <Sparkle size={32} weight="duotone" className="text-accent-200" />
          </div>
          <span className="text-xs font-bold text-herb-100">Live AI Vision</span>
          <span className="text-[10px] text-herb-300">Confidence Scoring</span>
        </div>
      </div>
    </section>
  );
}

