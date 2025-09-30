import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { QuizTypeName, YearMonthDay, YearMonthDayTag } from '@/lib/types';
import { getTodaysSefariaData } from '@/lib/sefaria';
import { generateDailyQuiz, GenerateDailyQuizOutput } from '@/ai/flows/generate-daily-quiz';

const CACHE_DIR = () => path.join(process.env.APP_ROOT || process.cwd(), '.cache', 'quizzes');

async function getCacheFilePath(date: YearMonthDay, quizType: QuizTypeName): Promise<string> {
  // Use a simple YYYY-MM-DD format for the filename.
  const dateTag = YearMonthDayTag(date)
  const type_tag = quizType.replace(/\s+/g, '-').toLowerCase();
  const fileName = `${type_tag}-${dateTag}.json`;
  return path.join(CACHE_DIR(), fileName);
}

async function getCachedQuiz(date: YearMonthDay, quizType: QuizTypeName): Promise<GenerateDailyQuizOutput | null> {
  try {
    const filePath = await getCacheFilePath(date, quizType);
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

async function setCachedQuiz(date: YearMonthDay, quiz: GenerateDailyQuizOutput, quizType: QuizTypeName): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR(), { recursive: true });
    const filePath = await getCacheFilePath(date, quizType);
    await fs.writeFile(filePath, JSON.stringify(quiz), 'utf-8');
    console.log(`Wrote quiz to ${filePath}`)
  } catch (error) {
    console.error('Error writing to quiz cache:', error);
  }
}

export async function getTodaysQuiz(quizType: QuizTypeName | null, now: YearMonthDay): Promise<{ dafRef: string; quiz: GenerateDailyQuizOutput | null }> {
  noStore()
  if (!quizType) {
    return {
      dafRef: '',
      quiz: null,
    }
  }

  let cachedQuiz = await getCachedQuiz(now, quizType);

  const daf = await getTodaysSefariaData(quizType, now);

  if (cachedQuiz) {
    return { dafRef: daf.ref, quiz: cachedQuiz };
  }
  const newQuiz = await generateDailyQuiz({
    quizType: quizType,
    pageText: daf.text
  });

  if (newQuiz) {
    await setCachedQuiz(now, newQuiz, quizType);
  } else {
    throw new Error('Failed to generate a new quiz.');
  }

  return { dafRef: daf.ref, quiz: newQuiz };
}
