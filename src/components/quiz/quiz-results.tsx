'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Question, QuizTypeHref, QuizTypeName } from '@/lib/types';
import { QUIZ_NAME_TO_HREF } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Award, CheckCircle, Printer, XCircle } from 'lucide-react';
import { ShareButtons } from './share-buttons';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onReset: () => void;
  dafRef: string;
  sefariaRef?: string;
  quizType: QuizTypeName;
  quizHref?: QuizTypeHref | null;
}

export function QuizResults({
  questions,
  userAnswers,
  onReset,
  dafRef,
  sefariaRef,
  quizType,
  quizHref,
}: QuizResultsProps) {
  const tResults = useTranslations('Results');
  const tQuiz = useTranslations('Quiz');
  const tQuizTypes = useTranslations('QuizTypes');
  const tMaster = useTranslations('MasterTitles');

  const resolvedHref = quizHref ?? QUIZ_NAME_TO_HREF[quizType];
  const localizedQuizName = tQuizTypes(resolvedHref);

  const { scorePercentage, correctAnswersCount } = useMemo(() => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return {
      scorePercentage: percentage,
      correctAnswersCount: correct,
    };
  }, [questions, userAnswers]);

  const getResultMessage = () => {
    if (scorePercentage === 100) {
      return tResults('perfectScore', { masterTitle: tMaster(resolvedHref) });
    }
    if (scorePercentage >= 80) return tResults('excellentScore');
    if (scorePercentage >= 50) return tResults('goodScore');
    return tResults('keepStudying');
  };

  const refForUrl = sefariaRef || dafRef;
  const getSefariaUrl = (ref: string, side: string | undefined, line: number) => {
    if (!side) return `https://www.sefaria.org/${ref.replace(/ /g, '_')}.${line}`;
    return `https://www.sefaria.org/${ref.replace(/ /g, '_')}${side}.${line}`;
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95">
      <CardHeader className="items-center text-center">
        <Award className="h-16 w-16 text-accent" />
        <CardTitle className="text-3xl font-headline mt-4">
          {tResults('quizCompleted')}
        </CardTitle>
        <CardDescription className="text-lg">{getResultMessage()}</CardDescription>
        <p className="text-5xl font-bold text-primary pt-4">{scorePercentage}%</p>
        <p className="text-muted-foreground">
          {tResults('answeredCount', {
            correct: correctAnswersCount,
            total: questions.length,
          })}
        </p>
      </CardHeader>
      <CardContent>
        <div className="my-6">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {tResults('reviewYourAnswers')}
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((q, index) => {
              const userAnswerIndex = userAnswers[index];
              const isCorrect = userAnswerIndex === q.correctAnswerIndex;
              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2 text-start">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      )}
                      <span className="font-semibold">
                        {tResults('questionNumber', { number: index + 1 })}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2 text-start">
                    <p className="font-semibold">{q.questionText}</p>
                    <p>
                      {tResults('yourAnswer')}{' '}
                      <span className={!isCorrect ? 'text-destructive font-medium' : 'text-green-600'}>
                        {q.options[userAnswerIndex] ?? tResults('notAnswered')}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        {tResults('correctAnswer')}{' '}
                        <span className="font-medium text-green-600">{q.correctAnswer}</span>
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {tResults('reference')}{' '}
                      <a
                        href={getSefariaUrl(refForUrl, q.reference.side?.toLowerCase(), q.reference.line)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {q.reference.text}
                      </a>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <ShareButtons
          scorePercentage={scorePercentage}
          dafRef={dafRef}
          sefariaRef={refForUrl}
          quizType={localizedQuizName}
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={onReset} variant="outline">
            {tResults('takeQuizAgain')}
          </Button>
          {quizHref && (
            <Button variant="outline" asChild>
              <Link href={`/${quizHref}/print`}>
                <Printer className="me-2 h-4 w-4" />
                {tQuiz('printQuizAndAnswers')}
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
