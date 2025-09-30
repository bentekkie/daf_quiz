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


export type YearMonthDay = {
  year: number;
  month: number;
  day: number;
}


function padnum(n: number): string {
  return String(n).padStart(2, "0")
}

export function YearMonthDayTag(date: YearMonthDay): string {
  return `${date.year}-${padnum(date.month)}-${padnum(date.day)}`
}