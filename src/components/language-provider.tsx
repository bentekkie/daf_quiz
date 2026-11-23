'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { isLanguage, type Language } from '@/lib/i18n';
import enMessages from '@/messages/en.json';
import heMessages from '@/messages/he.json';

const LANGUAGE_STORAGE_KEY = 'dafQuizLanguage';

const MESSAGES = {
  en: enMessages,
  he: heMessages,
} as const;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRtl: boolean;
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function getLanguageSnapshot(): Language {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (isLanguage(urlLang)) {
      return urlLang;
    }
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(stored)) {
      return stored;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'en';
}

function getServerSnapshot(): Language {
  return 'en';
}

function persistLanguage(lang: Language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  } catch {
    // Ignore storage access errors
  }
  notifyListeners();
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getLanguageSnapshot,
    getServerSnapshot,
  );

  const setLanguage = useCallback((lang: Language) => {
    persistLanguage(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = language === 'en' ? 'he' : 'en';
    persistLanguage(next);
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    toggleLanguage,
    isRtl: language === 'he',
  };

  return (
    <LanguageContext.Provider value={value}>
      <NextIntlClientProvider
        locale={language}
        messages={MESSAGES[language]}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
