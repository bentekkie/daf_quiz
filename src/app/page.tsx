import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTodaysQuiz } from '@/lib/quiz-service';
import { Terminal } from 'lucide-react';
import type { QuizData } from '@/lib/types';

export default async function Home() {
  let dafRef = '';
  let quizData: QuizData | null = null;
  let error = null;

  try {
    const quizResult = await getTodaysQuiz();
    dafRef = quizResult.dafRef;
    if (quizResult.quiz?.questions && quizResult.quiz.questions.length > 0) {
      quizData = {
        title: `Daily Quiz: ${dafRef}`,
        questions: quizResult.quiz.questions,
      };
    }
    if (!quizData) {
        throw new Error("Failed to generate the quiz. The AI may be unable to create a quiz from today's text.");
    }
  } catch (e: any) {
    console.error(e);
    error = e.message || "An unknown error occurred.";
  }

  return (
    <div className="flex flex-col min-h-screen">
       <QuizClient quiz={quizData} dafRef={dafRef} error={error} />
      <Footer />
    </div>
  );
}
