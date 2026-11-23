import type { QuizTypeHref, QuizTypeName } from '@/lib/types';

export type Language = 'en' | 'he';

export function isLanguage(value: string | null | undefined): value is Language {
  return value === 'en' || value === 'he';
}

export const HEBREW_QUIZ_DISPLAY_TITLES: Record<QuizTypeName, string> = {
  'Daf Yomi': 'דַּף יוֹמִי',
  'Daily Rambam': 'רַמְבַּ״ם יוֹמִי',
  'Daily Rambam (3 Chapters)': 'רַמְבַּ״ם יוֹמִי • ג׳ פְּרָקִים',
  'Tanya Yomi': 'תַּנְיָא יוֹמִי',
  'Daily Mishnah': 'מִשְׁנָה יוֹמִית',
  '929': 'תַּנַ״ךְ יוֹמִי • 929',
};

export const QUIZ_NAME_TO_HREF: Record<QuizTypeName, QuizTypeHref> = {
  'Daf Yomi': 'daf-yomi',
  'Daily Rambam': 'daily-rambam',
  'Daily Rambam (3 Chapters)': 'daily-rambam-three',
  'Tanya Yomi': 'daily-tanya',
  'Daily Mishnah': 'daily-mishnah',
  '929': '929',
};

export const OPTION_LETTERS: Record<Language, string[]> = {
  en: ['A', 'B', 'C', 'D', 'E', 'F'],
  he: ['א', 'ב', 'ג', 'ד', 'ה', 'ו'],
};
