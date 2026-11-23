import { notFound } from 'next/navigation';
import { QuizTypes, type QuizTypeHref, type QuizTypeName } from '@/lib/types';
import { PrintQuizClient } from '@/components/quiz/print-quiz-client';
import type { PrintViewMode } from '@/components/quiz/printable-quiz';

function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

function resolveQuizInfo(urlType: string): { name: QuizTypeName; href: QuizTypeHref } | null {
  if (!isKeyOfObject(urlType, QuizTypes)) {
    return null;
  }
  return { name: QuizTypes[urlType].name, href: urlType };
}

function parsePrintMode(view: string | undefined): PrintViewMode {
  if (view === 'quiz' || view === 'answers' || view === 'both') {
    return view;
  }
  return 'both';
}

export default async function PrintQuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizType: string }>;
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const { quizType } = await params;
  const { view, date } = await searchParams;
  const quizInfo = resolveQuizInfo(quizType);

  if (!quizInfo) {
    notFound();
  }

  return (
    <PrintQuizClient
      name={quizInfo.name}
      href={quizInfo.href}
      initialMode={parsePrintMode(view)}
      initialDate={date}
    />
  );
}
