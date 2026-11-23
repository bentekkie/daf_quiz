"use client"

import type { QuizData, QuizTypeName, QuizTypeHref } from '@/lib/types';
import type { Language } from '@/lib/i18n';
import { QuizClient } from './quiz-client';
import { useLanguage } from '@/components/language-provider';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export const experimental_ppr = true

interface QuizResponse {
  name: string;
  dafRef: string;
  sefariaRef?: string;
  quiz: QuizData | null;
  error?: string;
}

async function fetchData(
  href: QuizTypeHref,
  tz: string,
  lang: Language,
): Promise<QuizResponse> {
  const params = new URLSearchParams({ tz, lang });
  return (await fetch(`/api/${href}?${params.toString()}`)).json();
}

export function Quiz({ name, href }: {
  name: QuizTypeName, href: QuizTypeHref
}) {
  const { language } = useLanguage();
  const [data, setData] = useState<QuizResponse>({
    name,
    dafRef: '',
    sefariaRef: '',
    quiz: null,
  });
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const today = DateTime.local();
  const todayKey = `${today.year}-${today.month}-${today.day}`;
  const zoneName = today.zoneName;
  const requestKey = `${href}:${todayKey}:${zoneName}:${language}`;

  useEffect(() => {
    let cancelled = false;
    fetchData(href, zoneName, language).then((res) => {
      if (!cancelled) {
        setData(res);
        setLoadedKey(requestKey);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [href, language, requestKey, zoneName]);

  const effectiveData =
    loadedKey === requestKey
      ? data
      : { name, dafRef: '', sefariaRef: '', quiz: null };

  return (
    <QuizClient data={effectiveData} error={null} quizType={name} quizHref={href} />
  );
}
