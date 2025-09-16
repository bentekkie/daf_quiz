'use client';

import { useState } from 'react';
import type { QuizData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from './quiz-results';

interface QuizClientProps {
  quiz: QuizData;
}

type QuizState = 'not-started' | 'in-progress' | 'completed';

export function QuizClient({ quiz }: QuizClientProps) {
  const [quizState, setQuizState] = useState<QuizState>('not-started');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [currentSelection, setCurrentSelection] = useState<number | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleStart = () => {
    setQuizState('in-progress');
  };

  const handleSelection = (value: string) => {
    setCurrentSelection(Number(value));
  };
  
  const handleNext = () => {
    if (currentSelection !== null) {
      const updatedAnswers = { ...selectedAnswers, [currentQuestionIndex]: currentSelection };
      setSelectedAnswers(updatedAnswers);
      
      setCurrentSelection(null);
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setQuizState('completed');
      }
    }
  };
  
  const handleReset = () => {
    setQuizState('not-started');
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setCurrentSelection(null);
  };

  if (quizState === 'not-started') {
    return (
      <Card className="w-full max-w-2xl shadow-lg animate-in fade-in zoom-in-95">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-headline">{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">Test your knowledge of today's Daf Yomi. Ready to begin?</p>
          <Button onClick={handleStart} size="lg">Start Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  if (quizState === 'completed') {
    return <QuizResults questions={quiz.questions} userAnswers={selectedAnswers} onReset={handleReset} dafRef={quiz.title.replace('Daily Quiz: ', '')}/>;
  }

  return (
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
          value={currentSelection?.toString()}
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
  );
}
