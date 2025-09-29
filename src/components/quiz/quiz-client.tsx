'use client';

import { useEffect, useState } from 'react';
import type { QuizData, QuizTypeName, QuizTypeHref } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from './quiz-results';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { Header } from '../layout/header';
import { useStreak } from '@/hooks/useStreak';

interface QuizClientProps {
  quiz: QuizData | null;
  quizType: QuizTypeName | null;
  quizHref: QuizTypeHref | null;
  dafRef: string;
  error: string | null;
}

type QuizState = 'not-started' | 'in-progress' | 'completed';

export function QuizClient({ quiz, dafRef, quizType, quizHref, error }: QuizClientProps) {
  const [quizState, setQuizState] = useState<QuizState>('not-started');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const { streak, updateStreak } = useStreak();
  
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
        setCurrentQuestionIndex(prev => prev + 1);
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
    error = 'Invalid quiz type';
  }

  if (error) {
    return (
      <>
        <Header dafRef={dafRef} streak={streak} quizType={quizHref} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
            <Alert variant="destructive" className="max-w-2xl">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        </main>
      </>
    );
  }

  if (!quiz) {
    return (
        <>
            <Header dafRef={dafRef} streak={streak} quizType={quizHref} />
            <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
                <Alert className="max-w-2xl">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Quiz Unavailable</AlertTitle>
                    <AlertDescription>
                    The quiz for today could not be loaded. Please try again later.
                    </AlertDescription>
                </Alert>
            </main>
      </>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const quizInProgress = quizState === 'in-progress' || quizState === 'completed';

  return (
    <>
        <Header dafRef={dafRef} quizInProgress={quizInProgress} onReset={handleReset} streak={streak} quizType={quizHref} />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        {quizState === 'not-started' && (
            <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95">
                <CardHeader>
                <CardTitle className="text-center text-3xl font-headline">{dafRef}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">Test your knowledge of today's {quizType}. Ready to begin?</p>
                <Button onClick={handleStart} size="lg">Start Quiz</Button>
                </CardContent>
            </Card>
        )}

        {quizState === 'in-progress' && (
            <Card className="w-full max-w-2xl shadow-lg">
                <CardHeader>
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground text-center pt-2">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
                <CardTitle className="pt-4 text-xl md:text-2xl font-headline">{currentQuestion.questionText}</CardTitle>
                </CardHeader>
                <CardContent>
                <RadioGroup
                    value={currentSelection ?? ''}
                    onValueChange={handleSelection}
                    className="space-y-4"
                >
                    {currentQuestion.options.map((option, index) => (
                    <Label key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer has-[input:checked]:bg-accent/20 has-[input:checked]:border-accent transition-colors">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                        <span className="text-base flex-1">{option}</span>
                    </Label>
                    ))}
                </RadioGroup>
                <div className="mt-6 flex justify-end">
                    <Button onClick={handleNext} disabled={currentSelection === null}>
                    {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish Quiz'}
                    </Button>
                </div>
                </CardContent>
            </Card>
        )}

        {quizState === 'completed' && (
            <QuizResults questions={quiz.questions} userAnswers={selectedAnswers} onReset={handleReset} dafRef={dafRef} quizType={quizType!}/>
        )}
        </main>
    </>
  )
}
