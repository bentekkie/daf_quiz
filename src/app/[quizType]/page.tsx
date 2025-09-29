'use server';

import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { Quiz } from '@/components/quiz/quiz-wrapper';
import { getTodaysQuiz } from '@/lib/quiz-service';
import { QuizTypes, QuizTypeName, QuizTypeHref } from '@/lib/types';

function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}

function resolveQuizInfo(urlType: string): {name: QuizTypeName, href: QuizTypeHref} {
  if (!isKeyOfObject(urlType, QuizTypes)) {
    throw new Error(`Invalid quiz type: ${urlType}`)
  }
  return { name: QuizTypes[urlType].name, href: urlType }
}

export default async function QuizPage({ params }: { params: Promise<{ quizType: string }> }) {
  try {
    const quizTypeParam = (await params).quizType;
    const { name, href } = resolveQuizInfo(quizTypeParam);
    const today = new Date();
    const data = getTodaysQuiz(name, today).catch((error : Error) => ({dafRef: '', quiz: null, dataError: error}));

    return (
      <div className="flex flex-col min-h-screen">
        <Quiz name={name} href={href} data={data}/>
        <Footer />
      </div>
    );
  } catch (e) {
    console.error(e)
    const quizTypeParam = (await params).quizType;
    const {  href } = isKeyOfObject(quizTypeParam, QuizTypes) ? { href: quizTypeParam} : {href: null};
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient data={Promise.resolve({quiz: null, dafRef: ''})} error={"Error loading quiz"} quizType={null} quizHref={href} />
        <Footer />
      </div>
    );
  }
}
