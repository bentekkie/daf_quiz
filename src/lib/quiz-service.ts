import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';
import { QuizData, QuizTypeName, YearMonthDay, YearMonthDayTag } from '@/lib/types';
import type { Language } from '@/lib/i18n';
import { getTodaysSefariaData } from '@/lib/sefaria';
import { getStubQuizData } from '@/lib/stub-quiz';

const CACHE_DIR = () => path.join(process.env.APP_ROOT || process.cwd(), '.cache', 'quizzes');

async function getCacheFilePath(date: YearMonthDay, quizType: QuizTypeName, lang: Language): Promise<string> {
  // Use a simple YYYY-MM-DD format for the filename, suffixed with -he for Hebrew.
  const dateTag = YearMonthDayTag(date)
  const type_tag = quizType.replace(/\s+/g, '-').toLowerCase();
  const langSuffix = lang === 'he' ? '-he' : '';
  const fileName = `${type_tag}-${dateTag}${langSuffix}.json`;
  return path.join(CACHE_DIR(), fileName);
}

async function getCachedQuiz(date: YearMonthDay, quizType: QuizTypeName, lang: Language): Promise<QuizData | null> {
  try {
    const filePath = await getCacheFilePath(date, quizType, lang);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as QuizData;
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return null; // File not found, which is expected if cache is cold
    }
    console.error('Error reading from quiz cache:', error);
    return null;
  }
}

async function setCachedQuiz(date: YearMonthDay, quiz: QuizData, quizType: QuizTypeName, lang: Language): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR(), { recursive: true });
    const filePath = await getCacheFilePath(date, quizType, lang);
    await fs.writeFile(filePath, JSON.stringify(quiz), 'utf-8');
    console.log(`Wrote quiz to ${filePath}`)
  } catch (error) {
    console.error('Error writing to quiz cache:', error);
  }
}

export async function getTodaysQuiz(
  quizType: QuizTypeName | null,
  now: YearMonthDay,
  options?: { isFutureDate?: boolean; lang?: Language },
): Promise<{ dafRef: string; sefariaRef: string; quiz: QuizData | null }> {
  noStore()
  const lang: Language = options?.lang ?? 'en';
  if (!quizType) {
    return {
      dafRef: '',
      sefariaRef: '',
      quiz: null,
    }
  }

  if (process.env.STUB_AI === 'true') {
    return getStubQuizData(quizType, options?.isFutureDate, lang);
  }

  const cachedQuiz = await getCachedQuiz(now, quizType, lang);

  const daf = await getTodaysSefariaData(quizType, now, lang);

  if (cachedQuiz) {
    return { dafRef: daf.ref, sefariaRef: daf.sefariaRef, quiz: cachedQuiz };
  }

  const { generateDailyQuiz } = await import('@/ai/flows/generate-daily-quiz');
  const newQuiz = await generateDailyQuiz({
    quizType: quizType,
    pageText: daf.text,
    language: lang,
  });

  if (newQuiz) {
    await setCachedQuiz(now, newQuiz, quizType, lang);
  } else {
    throw new Error('Failed to generate a new quiz.');
  }

  return { dafRef: daf.ref, sefariaRef: daf.sefariaRef, quiz: newQuiz };
}
