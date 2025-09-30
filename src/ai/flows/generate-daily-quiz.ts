'use server';

/**
 * @fileOverview A daily quiz generator for the current Daf Yomi page.
 *
 * - generateDailyQuiz - A function that generates a quiz for the current Daf Yomi page.
 * - GenerateDailyQuizInput - The input type for the generateDailyQuiz function.
 * - GenerateDailyQuizOutput - The return type for the generateDailyQuiz function.
 */

import {ai} from '@/ai/genkit';
import {QuizTypes} from '@/lib/types';
import {z} from 'genkit';
z.enum
const quiznames= Object.values(QuizTypes).map(({name}) => name)
const GenerateDailyQuizInputSchema = z.object({
  pageText: z
    .string()
    .describe('The text content of the current page. Each line is prefixed with line number and optionally a side (A or B).'),
  quizType: z.enum([quiznames[0], ...quiznames.slice(1)]).describe('The type of quiz being generated.'),
  });
export type GenerateDailyQuizInput = z.infer<typeof GenerateDailyQuizInputSchema>;

const ReferenceSchema = z.object({
  side: z.enum(['A', 'B']).optional(),
  line: z.number(),
  text: z.string(),
});
export type Reference = z.infer<typeof ReferenceSchema>;

const QuestionSchema = z.object({
  questionNumber: z.number().describe('The question number, starting from 1.'),
  questionText: z.string().describe('The text of the quiz question.'),
  options: z.array(z.string()).describe('An array of 4 multiple choice options.'),
  correctAnswer: z.string().describe('The text of the correct answer.'),
  correctAnswerIndex: z.number().describe('The index of the correct answer in the options array.'),
  reference: ReferenceSchema.describe('A reference to the section in the text where the answer can be found.'),
});

const GenerateDailyQuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of 5 quiz questions.'),
});
export type GenerateDailyQuizOutput = z.infer<typeof GenerateDailyQuizOutputSchema>;

export async function generateDailyQuiz(input: GenerateDailyQuizInput): Promise<GenerateDailyQuizOutput> {
  return generateDailyQuizFlow(input);
}

const generateDailyQuizPrompt = ai.definePrompt({
  name: 'generateDailyQuizPrompt',
  input: {schema: GenerateDailyQuizInputSchema},
  output: {schema: GenerateDailyQuizOutputSchema},
  prompt: `You are an expert in creating quizzes based on religious texts.
  Given the text of the current {{{quizType}}} page, generate a quiz with 5 multiple-choice questions.
  For each question, provide 4 options, the correct answer text, the index of the correct answer, and a reference to the specific passage.
  Ensure the response is a valid JSON object matching the provided schema.

  {{{quizType}}} Text:
  {{{pageText}}}
  `,
});

const generateDailyQuizFlow = ai.defineFlow(
  {
    name: 'generateDailyQuizFlow',
    inputSchema: GenerateDailyQuizInputSchema,
    outputSchema: GenerateDailyQuizOutputSchema,
  },
  async input => {
    const {output} = await generateDailyQuizPrompt(input);
    if (!output) {
      throw new Error('Failed to generate quiz.');
    }
    return output;
  }
);
