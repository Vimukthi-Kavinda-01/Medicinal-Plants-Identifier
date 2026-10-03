import React from 'react';
import { Leaf } from '@phosphor-icons/react';

/** Step 8 – plants that are easy to confuse with the result. */
export default function SimilarPlants({ plants }) {
  if (!plants || plants.length === 0) return null;

  return (
    <section className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Similar plants to compare</h4>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {plants.map((plant) => (
          <article key={plant.id} className="rounded-xl border border-herb-100 bg-white p-3.5 shadow-soft">
            <div className="mb-1 flex items-center gap-2">
              <Leaf size={16} weight="fill" className="text-herb-600" />
              <h5 className="text-sm font-bold text-herb-900">{plant.name}</h5>
            </div>
            <p className="mb-2 text-[11px] italic text-herb-700">{plant.scientificName}</p>
            <p className="text-xs leading-relaxed text-gray-600">{plant.reason}</p>
            {plant.tip && (
              <p className="mt-2 rounded-lg bg-herb-50 p-2 text-xs leading-relaxed text-herb-900">
                <span className="font-bold">How to tell apart: </span>
                {plant.tip}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
