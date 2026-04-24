// Lightweight i18n system — no external dependency.
//
// Usage:
//   import { useT } from '../i18n';
//   const { t, lang, setLang } = useT();
//   return <h1>{t('landing.hero.title')}</h1>;
//
// Dictionaries live in ./{ko,en,ja}.js. Keys are dot-paths into nested
// objects. Missing translations fall back to Korean (source language) so
// half-translated screens still work during iteration.

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import ko from './ko.js';
import en from './en.js';
import ja from './ja.js';

export const LOCALES = { ko, en, ja };
export const LANG_META = {
  ko: { code: 'ko', label: '한국어', flag: '🇰🇷' },
  en: { code: 'en', label: 'English', flag: '🇺🇸' },
  ja: { code: 'ja', label: '日本語', flag: '🇯🇵' },
};

const STORAGE_KEY = 'shortsInsight.lang';
const DEFAULT_LANG = 'ko';

function detectInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES[saved]) return saved;
  } catch {
    /* SSR / disabled storage */
  }
  if (typeof navigator !== 'undefined') {
    const langs = [navigator.language, ...(navigator.languages || [])];
    for (const raw of langs) {
      if (!raw) continue;
      const code = raw.toLowerCase().slice(0, 2);
      if (LOCALES[code]) return code;
    }
  }
  return DEFAULT_LANG;
}

// Resolve "a.b.c" against a dictionary. Missing → null.
function pick(dict, path) {
  const parts = path.split('.');
  let cur = dict;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return null;
    cur = cur[p];
  }
  return cur == null ? null : cur;
}

// Cheap {varName} interpolation — avoids a template engine dependency.
function interpolate(template, vars) {
  if (typeof template !== 'string' || !vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => detectInitial());

  const setLang = useCallback((next) => {
    if (!LOCALES[next]) return;
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // Reflect on <html lang="..."> for accessibility + browser translation hints
    try { document.documentElement.lang = lang; } catch { /* ignore */ }
  }, [lang]);

  const t = useCallback(
    (path, vars) => {
      const direct = pick(LOCALES[lang], path);
      if (direct != null) return interpolate(direct, vars);
      // Fallback: Korean source (DEFAULT_LANG) so UI never shows raw key.
      const fallback = pick(LOCALES[DEFAULT_LANG], path);
      if (fallback != null) return interpolate(fallback, vars);
      return path; // last resort — shows key so we can spot gaps in dev
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Allow components to be used outside the provider in dev — degrade gracefully.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (path) => pick(LOCALES[DEFAULT_LANG], path) ?? path,
    };
  }
  return ctx;
}

// Convenience: read a translation outside React (e.g. in a pure util that
// receives lang from the caller). Not reactive.
export function translate(lang, path, vars) {
  const hit = pick(LOCALES[lang] || LOCALES[DEFAULT_LANG], path);
  if (hit == null) return pick(LOCALES[DEFAULT_LANG], path) ?? path;
  return interpolate(hit, vars);
}
