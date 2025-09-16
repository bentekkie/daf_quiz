'use client';

import { useMemo } from 'react';
import type { Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { ShareButtons } from './share-buttons';

interface QuizResultsProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onReset: () => void;
  dafRef: string;
}

export function QuizResults({ questions, userAnswers, onReset, dafRef }: QuizResultsProps) {
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
    if (scorePercentage === 100) return "Perfect score! You're a Talmud master!";
    if (scorePercentage >= 80) return "Excellent work! You really know your stuff.";
    if (scorePercentage >= 50) return "Good job! You're on your way to mastery.";
    return "Keep studying! Every day is a new opportunity to learn.";
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95">
      <CardHeader className="items-center text-center">
        <Award className="h-16 w-16 text-accent" />
        <CardTitle className="text-3xl font-headline mt-4">Quiz Completed!</CardTitle>
        <CardDescription className="text-lg">{getResultMessage()}</CardDescription>
        <p className="text-5xl font-bold text-primary pt-4">{scorePercentage}%</p>
        <p className="text-muted-foreground">You answered {correctAnswersCount} out of {questions.length} questions correctly.</p>
      </CardHeader>
      <CardContent>
        <div className="my-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Review Your Answers</h3>
            <Accordion type="single" collapsible className="w-full">
            {questions.map((q, index) => {
                const userAnswerIndex = userAnswers[index];
                const isCorrect = userAnswerIndex === q.correctAnswerIndex;
                return (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-2 text-left">
                        {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
                        <span className="font-semibold">Question {index + 1}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-2">
                        <p className="font-semibold">{q.questionText}</p>
                        <p>Your answer: <span className={!isCorrect ? 'text-destructive font-medium' : 'text-green-600'}>{q.options[userAnswerIndex] ?? 'Not answered'}</span></p>
                        {!isCorrect && <p>Correct answer: <span className="font-medium text-green-600">{q.correctAnswer}</span></p>}
                        <p className="text-sm text-muted-foreground">Reference: {q.reference}</p>
                    </AccordionContent>
                </AccordionItem>
                );
            })}
            </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <ShareButtons scorePercentage={scorePercentage} dafRef={dafRef} />
        <Button onClick={onReset} variant="outline">Take Quiz Again</Button>
      </CardFooter>
    </Card>
  );
}
