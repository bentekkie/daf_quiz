import type { QuizData, Question } from './types';

export function parseQuiz(quizText: string, dafRef: string): QuizData | null {
  if (!quizText || typeof quizText !== 'string') {
    return null;
  }

  try {
    const questions: Question[] = [];
    
    // Split the text into blocks for each question. The AI might use '---' or just start a new question.
    // The regex looks for '**Question' to split, but keeps the delimiter.
    const questionBlocks = quizText.split(/(?=\*\*Question\s\d+:)/).filter(block => block.trim());

    if (questionBlocks.length === 0) {
        // Fallback for different separators
        const fallbackBlocks = quizText.split('---').filter(block => block.trim());
        if (fallbackBlocks.length > 0) {
            questionBlocks.push(...fallbackBlocks);
        } else {
            return null;
        }
    }

    for (const block of questionBlocks) {
      // Regex to capture question number and text. Handles multi-line questions.
      const questionMatch = block.match(/\*\*Question\s*(\d+):\*\*\s*([\s\S]*?)(?=(?:\n\s*\d+\.)|(?:\n\s*\*\*Answer:\*\*))/);
      if (!questionMatch) continue;

      const questionNumber = parseInt(questionMatch[1], 10);
      const questionText = questionMatch[2].trim();

      // Regex to capture all options.
      const optionsMatch = Array.from(block.matchAll(/^\s*\d+\.\s*(.*?)$/gm));
      if (optionsMatch.length < 2) continue;
      const options = optionsMatch.map(m => m[1].trim());

      // Regex to capture the correct answer text.
      const answerMatch = block.match(/\*\*Answer:\*\*\s*\d+\.\s*(.*)/);
      if (!answerMatch) continue;
      const correctAnswerText = answerMatch[1].trim();
      
      // Regex to capture the reference.
      const referenceMatch = block.match(/\*\*Reference:\*\*\s*(.*)/);
      const reference = referenceMatch ? referenceMatch[1].trim() : `See ${dafRef}`;

      // Find the index of the correct answer, case-insensitively and ignoring trailing punctuation.
      const correctAnswerIndex = options.findIndex(opt => 
        opt.toLowerCase().replace(/[.,]$/, '') === correctAnswerText.toLowerCase().replace(/[.,]$/, '')
      );
      
      if (correctAnswerIndex === -1) continue;

      questions.push({
        questionNumber,
        questionText,
        options,
        correctAnswer: correctAnswerText,
        correctAnswerIndex,
        reference,
      });
    }

    if (questions.length === 0) {
      console.error("Quiz parsing resulted in zero valid questions.");
      return null;
    }
    
    // Re-number questions to ensure they are sequential, in case of parsing gaps or disorder.
    questions.sort((a, b) => a.questionNumber - b.questionNumber).forEach((q, i) => q.questionNumber = i + 1);

    return {
      title: `Daily Quiz: ${dafRef}`,
      questions,
    };
  } catch (error) {
    console.error("Failed to parse quiz text:", error);
    return null;
  }
}
