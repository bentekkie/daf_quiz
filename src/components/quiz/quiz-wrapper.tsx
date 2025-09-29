"use client"

import type { QuizTypeName, QuizTypeHref } from '@/lib/types';
import { QuizClient } from './quiz-client';
import type { GenerateDailyQuizOutput } from '@/ai/flows/generate-daily-quiz';

export const experimental_ppr = true

export function Quiz({ name, href, data }: {
  name: QuizTypeName, href: QuizTypeHref, data: Promise<{
    dafRef: string;
    quiz: GenerateDailyQuizOutput | null;
    dataError?: Error;
  }>
}) {
  return (
    <QuizClient data={data} error={null} quizType={name} quizHref={href} />
  );
}
