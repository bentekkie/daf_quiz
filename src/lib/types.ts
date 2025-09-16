export interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  reference: string;
}

export interface QuizData {
  title: string;
  questions: Question[];
}
