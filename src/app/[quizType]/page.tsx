'use server';

import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { Quiz } from '@/components/quiz/quiz-wrapper';
import { QuizTypes, QuizTypeName, QuizTypeHref } from '@/lib/types';

function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

function resolveQuizInfo(urlType: string): { name: QuizTypeName, href: QuizTypeHref } {
  if (!isKeyOfObject(urlType, QuizTypes)) {
    throw new Error(`Invalid quiz type: ${urlType}`)
  }
  return { name: QuizTypes[urlType].name, href: urlType }
}

export default async function QuizPage({ params }: { params: Promise<{ quizType: string }> }) {
  const quizTypeParam = (await params).quizType;
  try {
    const { name, href } = resolveQuizInfo(quizTypeParam);

    return (
      <div className="flex flex-col min-h-screen">
        <Quiz name={name} href={href} />
        <Footer />
      </div>
    );
  } catch (e) {
    console.error(e)
    const { href } = isKeyOfObject(quizTypeParam, QuizTypes) ? { href: quizTypeParam } : { href: null };
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient data={{ quiz: null, dafRef: '' }} error={"Error loading quiz"} quizType={null} quizHref={href} />
        <Footer />
      </div>
    );
  }
}
