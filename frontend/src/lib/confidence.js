/**
 * Shared confidence styling. Levels come from the backend ('high' | 'medium' | 'low').
 */
export const CONFIDENCE_STYLES = {
  high: {
    label: 'High Confidence',
    badge: 'bg-herb-100 text-herb-800 border-herb-300',
    bar: 'bg-herb-500',
  },
  medium: {
    label: 'Moderate Confidence',
    badge: 'bg-accent-100 text-accent-800 border-accent-300',
    bar: 'bg-accent-500',
  },
  low: {
    label: 'Low Confidence',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    bar: 'bg-amber-500',
  },
};

export function getConfidenceStyle(level) {
  return CONFIDENCE_STYLES[level] || CONFIDENCE_STYLES.low;
}