
import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { QuizTypes, QuizTypeName, QuizTypeHref } from '@/lib/types';
import { getTodaysQuiz } from '@/lib/quiz-service';

export function isKeyOfObject<T extends object>(
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
    const { quiz, dafRef } = await getTodaysQuiz(name);
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient quiz={quiz} dafRef={dafRef} error={null} quizType={name} quizHref={href} />
        <Footer />
      </div>
    );
  } catch (e) {
    console.error(e)
    const quizTypeParam = (await params).quizType;
    const { name, href } = isKeyOfObject(quizTypeParam, QuizTypes) ? {name: QuizTypes[quizTypeParam].name, href: quizTypeParam} : {name: null, href: null};
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient quiz={null} dafRef={''} error={"Error loading quiz"} quizType={name} quizHref={href} />
        <Footer />
      </div>
    );
  }

}
