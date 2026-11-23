'use client';
import { unstable_noStore as noStore } from 'next/cache';

import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import type { QuizData, QuizTypeName, QuizTypeHref } from '@/lib/types';
import { QUIZ_NAME_TO_HREF } from '@/lib/i18n';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { QuizResults } from './quiz-results';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Calendar, Printer, Terminal } from 'lucide-react';
import { Header } from '../layout/header';
import { useStreak } from '@/hooks/useStreak';
import { Skeleton } from '../ui/skeleton';

interface QuizClientProps {
  data: {
    quiz: QuizData | null;
    dafRef: string;
    sefariaRef?: string;
    dataError?: Error;
  };
  quizType: QuizTypeName | null;
  quizHref: QuizTypeHref | null;
  error: string | null;
}

type QuizState = 'not-started' | 'in-progress' | 'completed';

export function QuizClient({ data, quizType, quizHref, error }: QuizClientProps) {
  noStore();
  const { language } = useLanguage();
  const tCommon = useTranslations('Common');
  const tQuiz = useTranslations('Quiz');
  const tQuizTypes = useTranslations('QuizTypes');

  const [quizState, setQuizState] = useState<QuizState>('not-started');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const { streak, updateStreak } = useStreak();

  const upcomingShabbat = useMemo(() => {
    const today = DateTime.local().startOf('day');
    // Luxon weekday: 1 = Monday ... 5 = Friday, 6 = Saturday, 7 = Sunday
    const daysUntilSaturday = today.weekday === 6 ? 7 : (6 - today.weekday + 7) % 7;
    const shabbatDate = today.plus({ days: daysUntilSaturday }).setLocale(language);
    return {
      iso: shabbatDate.toISODate() ?? '',
      shortLabel: shabbatDate.toFormat('ccc, MMM d'),
      isTomorrow: daysUntilSaturday === 1,
    };
  }, [language]);

  const { quiz, dafRef, sefariaRef, dataError } = data;

  const localizedQuizName = quizHref
    ? tQuizTypes(quizHref)
    : quizType
      ? tQuizTypes(QUIZ_NAME_TO_HREF[quizType])
      : '';

  const handleStart = () => {
    setQuizState('in-progress');
  };

  const handleSelection = (value: string) => {
    setCurrentSelection(value);
  };

  const handleNext = () => {
    if (currentSelection === null) return;

    const newSelectedAnswers = {
      ...selectedAnswers,
      [currentQuestionIndex]: Number(currentSelection),
    };
    setSelectedAnswers(newSelectedAnswers);

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentSelection(null);
    } else {
      setQuizState('completed');
    }
  };

  const handleReset = () => {
    setQuizState('not-started');
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setCurrentSelection(null);
  };

  useEffect(() => {
    if (quizState === 'completed') {
      updateStreak();
    }
  }, [quizState, updateStreak]);

  if (!quizType) {
    error = tQuiz('invalidQuizType');
  }

  if (dataError) {
    console.error(dataError.toString());
    return (
      <>
        <Header dafRef={dafRef} sefariaRef={sefariaRef} streak={streak} quizType={quizHref} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Alert variant="destructive" className="max-w-2xl">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{tCommon('errorTitle')}</AlertTitle>
            <AlertDescription>{dataError.toString()}</AlertDescription>
          </Alert>
        </main>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Header dafRef={dafRef} sefariaRef={sefariaRef} streak={streak} quizType={quizHref} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Alert variant="destructive" className="max-w-2xl">
            <Terminal className="h-4 w-4" />
            <AlertTitle>{tCommon('errorTitle')}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </>
    );
  }

  if (!quiz) {
    return (
      <>
        <Header dafRef={dafRef} sefariaRef={sefariaRef} streak={streak} quizType={quizHref} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="items-center text-center">
              <CardTitle>
                <Skeleton className="h-8 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Skeleton className="h-5 w-3/4 mx-auto mb-6" />
              <Skeleton className="h-11 w-32 mx-auto" />
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const quizInProgress = quizState === 'in-progress' || quizState === 'completed';

  return (
    <>
      <Header
        dafRef={dafRef}
        sefariaRef={sefariaRef}
        quizInProgress={quizInProgress}
        onReset={handleReset}
        streak={streak}
        quizType={quizHref}
      />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {quizState === 'not-started' && (
          <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-headline">{dafRef}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                {tQuiz('startSubtitle', { quizName: localizedQuizName })}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button onClick={handleStart} size="lg">
                  {tQuiz('startQuiz')}
                </Button>
                {quizHref && (
                  <Button variant="outline" size="lg" asChild>
                    <Link href={`/${quizHref}/print`}>
                      <Printer className="me-2 h-4 w-4" />
                      {tQuiz('printQuizAndAnswers')}
                    </Link>
                  </Button>
                )}
              </div>
              {quizHref && upcomingShabbat.iso && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
                  <span>
                    {upcomingShabbat.isTomorrow
                      ? tQuiz('preparingForShabbat')
                      : tQuiz('printingAhead')}{' '}
                    <Link
                      href={{
                        pathname: `/${quizHref}/print`,
                        query: { date: upcomingShabbat.iso },
                      }}
                      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      {upcomingShabbat.isTomorrow
                        ? tQuiz('printTomorrowsShabbat')
                        : tQuiz('printForShabbatOrFuture', {
                            shortDate: upcomingShabbat.shortLabel,
                          })}
                    </Link>
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {quizState === 'in-progress' && (
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
              <Progress
                value={((currentQuestionIndex + 1) / totalQuestions) * 100}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground text-center pt-2">
                {tQuiz('questionProgress', {
                  current: currentQuestionIndex + 1,
                  total: totalQuestions,
                })}
              </p>
              <CardTitle className="pt-4 text-xl md:text-2xl font-headline">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={currentSelection ?? ''}
                onValueChange={handleSelection}
                className="space-y-4"
              >
                {currentQuestion.options.map((option, index) => (
                  <Label
                    key={index}
                    className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer has-[input:checked]:bg-accent/20 has-[input:checked]:border-accent transition-colors"
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                    <span className="text-base flex-1 text-start">{option}</span>
                  </Label>
                ))}
              </RadioGroup>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext} disabled={currentSelection === null}>
                  {currentQuestionIndex < totalQuestions - 1
                    ? tQuiz('next')
                    : tQuiz('finishQuiz')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {quizState === 'completed' && (
          <QuizResults
            questions={quiz.questions}
            userAnswers={selectedAnswers}
            onReset={handleReset}
            dafRef={dafRef}
            sefariaRef={sefariaRef}
            quizType={quizType!}
            quizHref={quizHref}
          />
        )}
      </main>
    </>
  );
}
