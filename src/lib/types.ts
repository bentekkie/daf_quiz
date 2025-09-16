export interface Question {
  questionNumber: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
  reference: {
    side: 'A' | 'B'
    line: number
    text: string
  };
}

export interface QuizData {
  title: string;
  questions: Question[];
}
