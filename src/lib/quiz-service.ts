import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { getTodaysDaf } from '@/lib/sefaria';
import { generateDailyQuiz, GenerateDailyQuizOutput } from '@/ai/flows/generate-daily-quiz';

const CACHE_DIR = path.join(process.cwd(), '.cache', 'quizzes');

async function getCacheFilePath(): Promise<string> {
  const today = new Date();
  // Use a simple YYYY-MM-DD format for the filename.
  const date_tag = today.toISOString().split('T')[0];
  const fileName = `${date_tag}.json`;
  return path.join(CACHE_DIR, fileName);
}

async function getCachedQuiz(): Promise<GenerateDailyQuizOutput | null> {
  try {
    const filePath = await getCacheFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as GenerateDailyQuizOutput;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return null; // File not found, which is expected if cache is cold
    }
    console.error('Error reading from quiz cache:', error);
    return null;
  }
}

async function setCachedQuiz(quiz: GenerateDailyQuizOutput): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const filePath = await getCacheFilePath();
    await fs.writeFile(filePath, JSON.stringify(quiz), 'utf-8');
  } catch (error) {
    console.error('Error writing to quiz cache:', error);
  }
}

export async function getTodaysQuiz(): Promise<{ dafRef: string; quiz: GenerateDailyQuizOutput }> {
  let cachedQuiz = await getCachedQuiz();

  const daf = await getTodaysDaf();

  if (cachedQuiz) {
    return { dafRef: daf.ref, quiz: cachedQuiz };
  }

  const newQuiz = await generateDailyQuiz({ dafYomiText: daf.text });

  if (newQuiz) {
    await setCachedQuiz(newQuiz);
  } else {
    throw new Error('Failed to generate a new quiz.');
  }

  return { dafRef: daf.ref, quiz: newQuiz };
}
