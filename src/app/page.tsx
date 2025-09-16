import { generateDailyQuiz } from '@/ai/flows/generate-daily-quiz';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { QuizClient } from '@/components/quiz/quiz-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTodaysDaf } from '@/lib/sefaria';
import { parseQuiz } from '@/lib/quiz-parser';
import { Terminal } from 'lucide-react';

export default async function Home() {
  let dafRef = '';
  let quizData = null;
  let error = null;

  try {
    const daf = await getTodaysDaf();
    dafRef = daf.ref;
    const quizResult = await generateDailyQuiz({ dafYomiText: daf.text });
    if (quizResult?.quiz) {
      quizData = parseQuiz(quizResult.quiz, dafRef);
    }
    if (!quizData) {
        throw new Error("Failed to generate or parse the quiz. The AI may be unable to create a quiz from today's text.");
    }
  } catch (e: any) {
    console.error(e);
    error = e.message || "An unknown error occurred.";
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header dafRef={dafRef} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {error ? (
          <Alert variant="destructive" className="max-w-2xl">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : quizData ? (
          <QuizClient quiz={quizData} />
        ) : (
           <Alert className="max-w-2xl">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Quiz Unavailable</AlertTitle>
            <AlertDescription>
              The quiz for today could not be loaded. Please try again later.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <Footer />
    </div>
  );
}
