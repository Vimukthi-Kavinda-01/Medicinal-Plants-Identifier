import React from 'react';
import { Info, FirstAidKit, ShieldWarning, Tree, Atom } from '@phosphor-icons/react';

export default function PlantInfoCard({ plantInfo, plantName }) {
  if (!plantInfo) {
    return (
      <div className="rounded-2xl bg-herb-50/70 border border-herb-200/80 p-5 text-gray-600 text-sm">
        <div className="flex items-center gap-2 font-bold text-herb-800 mb-2">
          <Info size={18} className="text-accent-600" />
          <span>Botanical Insights</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Detected species: <strong className="text-herb-900">{plantName}</strong>. Further botanical information
          is currently being researched for this specific classification.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-herb-50/80 border border-herb-200 p-5 sm:p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-herb-200/70 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-herb-600 text-white flex items-center justify-center">
            <FirstAidKit size={18} weight="fill" />
          </div>
          <div>
            <h4 className="font-bold text-herb-900 text-base">Medicinal Properties & Profile</h4>
            <p className="text-xs text-herb-700 italic">
              {plantInfo.scientificName} • {plantInfo.family}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* Medicinal Uses */}
        <div className="bg-white/80 p-3.5 rounded-xl border border-herb-100 shadow-soft sm:col-span-2">
          <div className="flex items-center gap-1.5 font-bold text-herb-800 mb-1.5">
            <FirstAidKit size={15} className="text-herb-600" />
            <span>Therapeutic & Traditional Uses</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{plantInfo.medicinalUses}</p>
        </div>

        {/* Active Compounds */}
        {plantInfo.activeCompounds && (
          <div className="bg-white/80 p-3.5 rounded-xl border border-herb-100 shadow-soft">
            <div className="flex items-center gap-1.5 font-bold text-accent-800 mb-1.5">
              <Atom size={15} className="text-accent-600" />
              <span>Key Phytochemicals</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{plantInfo.activeCompounds}</p>
          </div>
        )}

        {/* Habitat */}
        {plantInfo.habitat && (
          <div className="bg-white/80 p-3.5 rounded-xl border border-herb-100 shadow-soft">
            <div className="flex items-center gap-1.5 font-bold text-herb-800 mb-1.5">
              <Tree size={15} className="text-herb-600" />
              <span>Native Habitat</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{plantInfo.habitat}</p>
          </div>
        )}
      </div>

      {/* Precaution warning banner */}
      {plantInfo.precautions && (
        <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 flex items-start gap-2.5 text-amber-900 text-xs">
          <ShieldWarning size={18} weight="fill" className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5 text-amber-950">Precaution & Safety Note:</span>
            <span className="text-amber-800 leading-relaxed">{plantInfo.precautions}</span>
          </div>
        </div>
      )}
    </div>
  );
}

