import React from 'react';
import { Sparkle, ArrowClockwise, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { formatPlantName, getPlantInfo } from '../lib/plantKnowledge';
import PlantInfoCard from './PlantInfoCard';

export default function ResultsPanel({ predictions, imagePreview, onReset }) {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-herb-100 text-center animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <WarningCircle size={32} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-1">No Plant Detected</h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-5">
          The AI model did not identify a clear medicinal plant in this image. Try taking a closer, well-lit photo
          focusing on the leaves, stem, or flowers.
        </p>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-herb-600 hover:bg-herb-700 text-white font-semibold text-xs transition-colors"
        >
          <ArrowClockwise size={15} /> Try Another Image
        </button>
      </div>
    );
  }

  const topPrediction = predictions[0];
  const topConfidencePct = Math.round(topPrediction.confidence * 100);
  const formattedTopName = formatPlantName(topPrediction.class);
  const topPlantInfo = getPlantInfo(topPrediction.class);
  const secondaryPredictions = predictions.slice(1, 5);

  const getConfidenceBadge = (pct) => {
    if (pct >= 75) {
      return {
        label: 'High Confidence',
        bg: 'bg-herb-100 text-herb-800 border-herb-300',
        bar: 'bg-herb-500',
      };
    }
    if (pct >= 45) {
      return {
        label: 'Moderate Match',
        bg: 'bg-accent-100 text-accent-800 border-accent-300',
        bar: 'bg-accent-500',
      };
    }
    return {
      label: 'Low Confidence',
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      bar: 'bg-amber-500',
    };
  };

  const confidenceBadge = getConfidenceBadge(topConfidencePct);

  return (
    <div className="mt-8 bg-white rounded-3xl p-5 sm:p-8 shadow-card border border-herb-100 animate-slide-up space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-herb-100 text-herb-700 flex items-center justify-center font-bold">
            <Sparkle size={18} weight="fill" />
          </span>
          <div>
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Identification Result</h3>
            <p className="text-xs text-gray-500">Processed by Roboflow YOLO11n Logic</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <ArrowClockwise size={14} /> Scan Another
        </button>
      </div>

      {/* Primary Detection Card */}
      <div className="rounded-2xl bg-gradient-to-br from-herb-50/70 to-herb-100/40 border border-herb-200 p-4 sm:p-6">
        <div className="sm:flex sm:items-center sm:gap-6">
          {/* Thumbnail */}
          {imagePreview && (
            <div className="w-full sm:w-32 h-36 sm:h-32 rounded-xl overflow-hidden shadow-sm border-2 border-white mb-4 sm:mb-0 shrink-0">
              <img
                src={imagePreview}
                alt="Analyzed plant"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Plant summary & confidence */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${confidenceBadge.bg}`}>
                {confidenceBadge.label}
              </span>
              <span className="text-xs text-gray-500 font-medium">Rank #1 Match</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-herb-900 tracking-tight">
              {formattedTopName}
            </h2>

            {/* Confidence Progress Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">Confidence Score</span>
                <span className="text-herb-800">{topConfidencePct}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${confidenceBadge.bar}`}
                  style={{ width: `${topConfidencePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Candidates List (if model returned multiple possibilities) */}
      {secondaryPredictions.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Other Potential Candidates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {secondaryPredictions.map((cand, idx) => {
              const candPct = Math.round(cand.confidence * 100);
              const candBadge = getConfidenceBadge(candPct);
              return (
                <div
                  key={idx}
                  className="rounded-xl p-3 bg-gray-50 border border-gray-100 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-semibold text-xs sm:text-sm text-gray-800 block">
                      {formatPlantName(cand.class)}
                    </span>
                    <div className="w-28 sm:w-36 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${candBadge.bar}`}
                        style={{ width: `${candPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-600 ml-2">{candPct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medicinal Profile & Uses Card */}
      <PlantInfoCard plantInfo={topPlantInfo} plantName={formattedTopName} />
    </div>
  );
}

