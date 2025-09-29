
import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { QuizTypes, QuizTypeName } from '@/lib/types';
import { getTodaysQuiz } from '@/lib/quiz-service';

export function isKeyOfObject<T extends object>(
  key: string | number | symbol,
  obj: T,
): key is keyof T {
  return key in obj;
}
function resolveType(urlType: string): QuizTypeName {
  if (!isKeyOfObject(urlType, QuizTypes)) {
    throw new Error(`Invalid quiz type: ${urlType}`)
  }
  return QuizTypes[urlType].name
}

export default async function QuizPage({ params }: { params: Promise<{ quizType: string }> }) {
  try {
    const quizTypeParam = (await params).quizType;
    const name = resolveType(quizTypeParam);
    const { quiz, dafRef } = await getTodaysQuiz(name);
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient quiz={quiz} dafRef={dafRef} error={null} quizType={name} />
        <Footer />
      </div>
    );
  } catch (e) {
    console.error(e)
    const quizTypeParam = (await params).quizType;
    const name = isKeyOfObject(quizTypeParam, QuizTypes) ? QuizTypes[quizTypeParam].name : null;
    return (
      <div className="flex flex-col min-h-screen">
        <QuizClient quiz={null} dafRef={''} error={"Error loading quiz"} quizType={name} />
        <Footer />
      </div>
    );
  }

}
