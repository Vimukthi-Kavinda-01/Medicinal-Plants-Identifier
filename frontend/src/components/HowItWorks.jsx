import React from 'react';
import { Camera, Brain, BookOpen } from '@phosphor-icons/react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Capture or Upload',
      description: 'Use your phone camera to snap a clear photo of the plant leaf, flower, or bark, or choose an existing photo from your gallery.',
      icon: Camera,
    },
    {
      step: '02',
      title: 'AI Inference',
      description: 'Your image is processed via our secure backend and evaluated against your trained Roboflow YOLO11n workflow.',
      icon: Brain,
    },
    {
      step: '03',
      title: 'Medicinal Insights',
      description: 'View the identified plant species, real-time confidence rating, active phytochemicals, and therapeutic uses.',
      icon: BookOpen,
    },
  ];

  return (
    <section id="how-it-works" className="mt-14 scroll-mt-20">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-herb-950 mb-2">How It Works</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          From snapshot to botanical diagnosis in three streamlined steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-herb-100 shadow-soft flex flex-col items-center text-center relative group hover:border-herb-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-herb-100 text-herb-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Icon size={24} weight="duotone" />
              </div>
              <span className="text-[10px] font-extrabold tracking-widest text-accent-700 bg-accent-50 px-2 py-0.5 rounded-full mb-2 uppercase">
                Step {item.step}
              </span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

