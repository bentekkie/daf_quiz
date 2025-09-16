'use server';

/**
 * @fileOverview A daily quiz generator for the current Daf Yomi page.
 *
 * - generateDailyQuiz - A function that generates a quiz for the current Daf Yomi page.
 * - GenerateDailyQuizInput - The input type for the generateDailyQuiz function.
 * - GenerateDailyQuizOutput - The return type for the generateDailyQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyQuizInputSchema = z.object({
  dafYomiText: z
    .string()
    .describe('The text content of the current Daf Yomi page.'),
});
export type GenerateDailyQuizInput = z.infer<typeof GenerateDailyQuizInputSchema>;

const GenerateDailyQuizOutputSchema = z.object({
  quiz: z.string().describe('The generated quiz questions and answers.'),
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
  Given the text of the current Daf Yomi page, generate a quiz with questions and answers.
  Include references to specific sections or passages within the text where the answers can be found.

  Daf Yomi Text:
  {{{
dafYomiText
  }}}
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
    return output!;
  }
);
