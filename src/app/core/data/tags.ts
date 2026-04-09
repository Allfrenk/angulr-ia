// src/app/core/data/tags.ts
// Mappa centralizzata dei tag predefiniti con colori.
// In un'app reale questi verrebbero caricati da DB per garantire persistenza.

export interface TagConfig {
  label: string;
  darkClass: string; // classi Tailwind dark mode
  lightClass: string; // classi Tailwind light mode
}

export const PREDEFINED_TAGS: TagConfig[] = [
  {
    label: 'enterprise',
    darkClass: 'bg-violet-900/40 border-violet-700 text-violet-300',
    lightClass: 'bg-violet-100 border-violet-300 text-violet-700',
  },
  {
    label: 'priority',
    darkClass: 'bg-red-900/40 border-red-700 text-red-300',
    lightClass: 'bg-red-100 border-red-300 text-red-700',
  },
  {
    label: 'new',
    darkClass: 'bg-green-900/40 border-green-700 text-green-300',
    lightClass: 'bg-green-100 border-green-300 text-green-700',
  },
  {
    label: 'agency',
    darkClass: 'bg-blue-900/40 border-blue-700 text-blue-300',
    lightClass: 'bg-blue-100 border-blue-300 text-blue-700',
  },
  {
    label: 'startup',
    darkClass: 'bg-amber-900/40 border-amber-700 text-amber-300',
    lightClass: 'bg-amber-100 border-amber-300 text-amber-700',
  },
  {
    label: 'retail',
    darkClass: 'bg-cyan-900/40 border-cyan-700 text-cyan-300',
    lightClass: 'bg-cyan-100 border-cyan-300 text-cyan-700',
  },
  {
    label: 'finance',
    darkClass: 'bg-emerald-900/40 border-emerald-700 text-emerald-300',
    lightClass: 'bg-emerald-100 border-emerald-300 text-emerald-700',
  },
  {
    label: 'consulting',
    darkClass: 'bg-indigo-900/40 border-indigo-700 text-indigo-300',
    lightClass: 'bg-indigo-100 border-indigo-300 text-indigo-700',
  },
  {
    label: 'healthcare',
    darkClass: 'bg-teal-900/40 border-teal-700 text-teal-300',
    lightClass: 'bg-teal-100 border-teal-300 text-teal-700',
  },
  {
    label: 'media',
    darkClass: 'bg-pink-900/40 border-pink-700 text-pink-300',
    lightClass: 'bg-pink-100 border-pink-300 text-pink-700',
  },
  {
    label: 'tech',
    darkClass: 'bg-sky-900/40 border-sky-700 text-sky-300',
    lightClass: 'bg-sky-100 border-sky-300 text-sky-700',
  },
  {
    label: 'partner',
    darkClass: 'bg-orange-900/40 border-orange-700 text-orange-300',
    lightClass: 'bg-orange-100 border-orange-300 text-orange-700',
  },
];

// Helper: ottieni le classi CSS per un tag dato il suo label
export function getTagClasses(label: string, isDark: boolean): string {
  const tag = PREDEFINED_TAGS.find((t) => t.label === label);
  if (tag) {
    return `rounded-full px-2 py-0.5 text-xs border ${isDark ? tag.darkClass : tag.lightClass}`;
  }
  // Fallback per tag custom non in mappa
  return isDark
    ? 'rounded-full px-2 py-0.5 text-xs border bg-zinc-800 border-zinc-700 text-zinc-400'
    : 'rounded-full px-2 py-0.5 text-xs border bg-zinc-100 border-zinc-300 text-zinc-600';
}
