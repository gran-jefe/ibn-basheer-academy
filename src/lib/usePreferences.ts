'use client';

import { useCallback, useEffect, useState } from 'react';

export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';

const LANG_KEY = 'ib-lang';
const THEME_KEY = 'ib-theme';

const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode / blocked storage — preference just won't persist */
  }
};

/**
 * Language + theme, kept in sync with <html lang/dir/data-theme> and
 * localStorage. The inline script in layout.tsx applies the saved values
 * before paint; this hook re-reads them after hydration so server and client
 * markup never disagree.
 */
export function usePreferences() {
  const [lang, setLangState] = useState<Lang>('ar');
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const storedLang = read(LANG_KEY);
    if (storedLang === 'ar' || storedLang === 'en') setLangState(storedLang);

    const storedTheme = read(THEME_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setThemeState(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    write(LANG_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      write(THEME_KEY, next);
      return next;
    });
  }, []);

  return { lang, setLang, theme, toggleTheme };
}
