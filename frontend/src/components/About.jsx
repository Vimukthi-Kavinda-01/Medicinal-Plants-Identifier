import React from 'react';
import { ShieldWarning, TreeStructure, Sparkle } from '@phosphor-icons/react';

export default function About() {
  return (
    <section id="about" className="mt-12 scroll-mt-20">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-herb-100 shadow-soft space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-herb-100 text-herb-700 flex items-center justify-center">
            <TreeStructure size={20} weight="fill" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">About HerbSense AI</h3>
            <p className="text-xs text-gray-500">Computer vision for herbal conservation & research</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          HerbSense connects modern mobile devices to custom computer vision workflows hosted on Roboflow.
          Trained on medicinal plants from tropical, subtropical, and temperate regions, the system evaluates
          botanical features and matches them with traditional pharmacology and modern phytochemical data.
        </p>

        {/* Disclaimer box */}
        <div className="rounded-2xl bg-amber-50/90 border border-amber-200/80 p-4 sm:p-5 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
          <ShieldWarning size={22} weight="fill" className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-950 mb-1">Educational & Research Disclaimer</h4>
            <p className="text-amber-800">
              HerbSense is designed for educational exploration, botanical identification, and field research.
              It is not intended as medical advice or a substitute for professional diagnosis. Never consume wild plants
              or ingest remedies without consulting a licensed healthcare practitioner or qualified herbalist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

