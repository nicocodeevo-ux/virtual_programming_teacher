import { LANGUAGES as DEFAULT_LANGUAGES } from '../data/lessons';

const STORAGE_KEY = 'vpt_languages_v1';

export function loadLanguages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load languages from localStorage, falling back to defaults', e);
  }
  return DEFAULT_LANGUAGES;
}

export function saveLanguages(payload: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (e) {
    console.error('Failed to save languages to localStorage', e);
    return false;
  }
}

export function resetLanguages() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to remove languages from localStorage', e);
  }
  return DEFAULT_LANGUAGES;
}
