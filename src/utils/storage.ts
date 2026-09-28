import type { SavedCalculation, Settings } from '@/types';

const STORAGE_KEY = 'wgp_saved_calculations';
const SETTINGS_KEY = 'wgp_settings';

export const defaultSettings: Settings = {
  voltageDropLimit: 5,
  ambientTemp: 30,
  material: 'copper',
  phase: 'single',
  currency: '$',
  temperatureUnit: 'celsius',
  autoSave: true,
};

export function loadSavedCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedCalculation[];
  } catch {
    return [];
  }
}

export function saveCalculation(calc: SavedCalculation): void {
  const existing = loadSavedCalculations();
  existing.unshift(calc);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
}

export function deleteCalculation(id: string): void {
  const existing = loadSavedCalculations();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllCalculations(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) } as Settings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
