// lib/entity-extractor.ts

export interface Entities {
  people: string[];
  organizations: string[];
  locations: string[];
  misc: string[];
}

export function extractEntities(text: string): Entities {
  const words = text.split(/\s+/);
  const miscSet = new Set<string>();

  for (const w of words) {
    const clean = w.replace(/[^A-Za-z]/g, "");
    if (!clean) continue;

    const isCapitalized =
      clean.length > 1 &&
      clean[0] === clean[0].toUpperCase() &&
      clean.slice(1) !== clean.slice(1).toUpperCase();

    if (isCapitalized) {
      miscSet.add(clean);
    }
  }

  const misc = Array.from(miscSet).slice(0, 30);

  return {
    people: [],
    organizations: [],
    locations: [],
    misc
  };
}
