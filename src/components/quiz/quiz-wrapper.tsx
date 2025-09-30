"use client"

import type { QuizTypeName, QuizTypeHref } from '@/lib/types';
import { QuizClient } from './quiz-client';
import type { GenerateDailyQuizOutput } from '@/ai/flows/generate-daily-quiz';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

export const experimental_ppr = true



async function fetchData(href : QuizTypeHref, tz: string): Promise<{
  name: string,
  dafRef: string,
  quiz: GenerateDailyQuizOutput | null
  error?: string
}> {
  return (await fetch(`/api/${href}?tz=${tz}`)).json()
}

export function Quiz({ name, href }: {
  name: QuizTypeName, href: QuizTypeHref
}) {
  const [data, setData] = useState<{
    name: string,
    dafRef: string,
    quiz: GenerateDailyQuizOutput | null
    error?: string
  }>({
    name,
    dafRef: '',
    quiz: null
  })
  const today = DateTime.local();
  useEffect(() => {
    fetchData(href, today.zoneName).then(setData)
  }, [href, `${today.year}-${today.month}-${today.day}`, today.zoneName])
  return (
    <QuizClient data={data} error={null} quizType={name} quizHref={href} />
  );
}
