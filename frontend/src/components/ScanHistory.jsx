import React, { useState, useEffect } from 'react';
import { CaretDown, CaretUp, Plant, ClockCounterClockwise } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatPlantLabel(scan) {
  if (scan.plant?.commonName) return scan.plant.commonName;
  if (!scan.detectedClass) return 'Unknown plant';
  // Convert snake_case / CamelCase → "Title Case"
  return scan.detectedClass
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function confidenceColor(conf) {
  const pct = conf * 100;
  if (pct >= 85) return 'text-herb-700 bg-herb-50 border-herb-200';
  if (pct >= 65) return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

// ── Skeleton placeholder ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-40 bg-gray-200 rounded-lg" />
          <div className="h-3 w-28 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-7 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-3 w-24 bg-gray-100 rounded-lg" />
    </div>
  );
}

// ── Single scan card ──────────────────────────────────────────────────────────
function ScanCard({ scan }) {
  const [expanded, setExpanded] = useState(false);
  const name = formatPlantLabel(scan);
  const pct = scan.confidence != null ? (scan.confidence * 100).toFixed(1) + '%' : '—';
  const confClass = scan.confidence != null ? confidenceColor(scan.confidence) : 'text-gray-500 bg-gray-50 border-gray-200';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-soft overflow-hidden transition-all">
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-herb-50/40 transition-colors"
        aria-expanded={expanded}
      >
        {/* Leaf icon badge */}
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-herb-100 text-herb-700">
          <Plant size={18} weight="duotone" />
        </div>

        <div className="flex-1 min-w-0 space-y-0.5">
          <p className="font-bold text-sm text-gray-900 leading-tight truncate">{name}</p>
          {scan.plant?.scientificName && (
            <p className="text-xs italic text-gray-500 truncate">{scan.plant.scientificName}</p>
          )}
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <ClockCounterClockwise size={12} />
            {formatDate(scan.createdAt)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${confClass}`}>
            {pct}
          </span>
          <span className="text-gray-400">
            {expanded ? <CaretUp size={15} /> : <CaretDown size={15} />}
          </span>
        </div>
      </button>

      {/* Expandable description */}
      {expanded && (
        <div className="px-4 pb-4">
          <div className="rounded-xl bg-herb-50 border border-herb-100 p-3 text-xs text-herb-900 leading-relaxed">
            {scan.description
              ? (typeof scan.description === 'string'
                  ? scan.description
                  : (scan.description?.description || JSON.stringify(scan.description)))
              : <span className="italic text-herb-600">No description available</span>
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="text-5xl leading-none select-none">🌱</div>
      <div className="space-y-1">
        <p className="font-bold text-gray-700">No scans yet</p>
        <p className="text-xs text-gray-500 max-w-[240px]">
          Identify a plant to build your history!
        </p>
      </div>
      <a
        href="#detect"
        className="mt-1 rounded-xl bg-herb-700 px-5 py-2 text-xs font-bold text-white hover:bg-herb-800 transition-colors"
      >
        Scan a plant
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ScanHistory() {
  const { token } = useAuth();
  const [scans, setScans] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function fetchScans() {
      setStatus('loading');
      try {
        const res = await fetch(`${API_BASE}/api/scans/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          // Show max 30 most recent scans
          const sorted = (data.scans || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 30);
          setScans(sorted);
          setStatus('success');
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message);
          setStatus('error');
        }
      }
    }

    fetchScans();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <section id="scan-history" className="mt-6 w-full">
      <div className="rounded-3xl bg-white shadow-card px-5 py-6 sm:px-7 sm:py-8 space-y-5">
        {/* Section header */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Your Scan History
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Your 30 most recent plant identifications
          </p>
        </div>

        {/* Loading skeletons */}
        {status === 'loading' && (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            Failed to load scan history: {errorMsg}
          </div>
        )}

        {/* Empty state */}
        {status === 'success' && scans.length === 0 && <EmptyState />}

        {/* Scan list */}
        {status === 'success' && scans.length > 0 && (
          <div className="space-y-3">
            {scans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
