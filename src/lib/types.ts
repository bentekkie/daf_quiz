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
    disabled: false,
  },
  'daily-rambam': {
    name: 'Daily Rambam',
    disabled: true,
  },
  'daily-mishnah': {
    name: 'Daily Mishnah',
    disabled: true,
  },
  '929': { 
    name: '929',
    disabled: true,
  },
} as const

export type QuizTypeName = typeof QuizTypes[keyof typeof QuizTypes]["name"];
export type QuizTypeHref =  keyof typeof QuizTypes;
