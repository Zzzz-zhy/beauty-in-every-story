import { products, stories } from "./content";

export type SelectionItem = { id: string; quantity: number; selected: boolean };
export type Preferences = {
  motion: "system" | "full" | "reduce";
  large: boolean;
  contrast: boolean;
  view: "wall" | "list";
};
export const defaultPreferences: Preferences = {
  motion: "system",
  large: false,
  contrast: false,
  view: "wall",
};
export function readJSON(storage: Storage, key: string): unknown {
  try {
    return JSON.parse(storage.getItem(key) || "null");
  } catch {
    return null;
  }
}
export function validStoryId(value: unknown): string | null {
  return typeof value === "string" &&
    stories.some((story) => story.id === value)
    ? value
    : null;
}
export function parseSelection(value: unknown): SelectionItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      !products.some((p) => p.id === item.id) ||
      seen.has(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 9
    )
      return [];
    seen.add(item.id);
    return [
      {
        id: item.id,
        quantity: item.quantity,
        selected: item.selected === true,
      },
    ];
  });
}
export function parsePreferences(value: unknown): Preferences {
  if (!value || typeof value !== "object") return { ...defaultPreferences };
  const p = value as Record<string, unknown>;
  return {
    motion: p.motion === "full" || p.motion === "reduce" ? p.motion : "system",
    large: p.large === true,
    contrast: p.contrast === true,
    view: p.view === "list" ? "list" : "wall",
  };
}
export type GalleryReturn = { url: string; y: number; focus: string };
export function readGalleryReturn(): GalleryReturn | null {
  try {
    const value = readJSON(sessionStorage, "beauty-return");
    if (!value || typeof value !== "object") return null;
    const r = value as Record<string, unknown>;
    if (typeof r.url !== "string" || !/^\/stories(?:\?|$)/.test(r.url))
      return null;
    return {
      url: r.url,
      y: typeof r.y === "number" && Number.isFinite(r.y) ? Math.max(0, r.y) : 0,
      focus: typeof r.focus === "string" ? r.focus : "",
    };
  } catch {
    return null;
  }
}
