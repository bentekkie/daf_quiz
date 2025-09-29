export interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  reference: {
    side?: 'A' | 'B'
    line: number
    text: string
  };
}

export interface QuizData {
  questions: Question[];
}

export const QuizTypes = {
  'daf-yomi': {
    name: 'Daf Yomi',
  },
  'daily-rambam': {
    name: 'Daily Rambam',
  },
  'daily-mishnah': {
    name: 'Daily Mishnah',
  },
  '929': { 
    name: '929',
  },
} as const

export type QuizTypeName = typeof QuizTypes[keyof typeof QuizTypes]["name"];
export type QuizTypeHref =  keyof typeof QuizTypes;
