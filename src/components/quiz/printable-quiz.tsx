'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { QuizData, QuizTypeName } from '@/lib/types';
import {
  HEBREW_QUIZ_DISPLAY_TITLES,
  OPTION_LETTERS,
  QUIZ_NAME_TO_HREF,
} from '@/lib/i18n';
import { useLanguage } from '@/components/language-provider';
import { Check } from 'lucide-react';

export type PrintViewMode = 'both' | 'quiz' | 'answers';

interface PrintableQuizProps {
  quiz: QuizData;
  dafRef: string;
  quizType: QuizTypeName;
  mode: PrintViewMode;
  dateLabel?: string;
  isShabbat?: boolean;
}

const HEBREW_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳'];

// US Letter is 11in (1056px @ 96dpi). With 0.3in top/bottom @page margins,
// printable height is 10.4in (998px). Target 950px to leave comfortable safety margin.
const MAX_LETTER_HEIGHT_PX = 950;
const MIN_BASE_FONT_PX = 9.5;
const MAX_BASE_FONT_PX = 15.5;

function estimateInitialFontPx(charCount: number, kind: 'quiz' | 'answers'): number {
  const threshold = kind === 'quiz' ? 1150 : 1250;
  if (charCount <= threshold) return MAX_BASE_FONT_PX;
  // Smoothly reduce base font size for verbose AI-generated content
  // so mobile print engines (which may not re-run React effects on print) also fit on 1 page.
  const excess = charCount - threshold;
  const reduction = (excess / 350) * 0.85;
  return Math.max(MIN_BASE_FONT_PX, Math.round((MAX_BASE_FONT_PX - reduction) * 2) / 2);
}

function CornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<'tl' | 'tr' | 'bl' | 'br', string> = {
    tl: 'top-2 left-2',
    tr: 'top-2 right-2 scale-x-[-1]',
    bl: 'bottom-2 left-2 scale-y-[-1]',
    br: 'bottom-2 right-2 scale-[-1]',
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={`pointer-events-none absolute h-[2.2em] w-[2.2em] ${transforms[position]}`}
      fill="none"
    >
      {/* Outer L-bracket in Tekhelet */}
      <path d="M4 36V4H36" stroke="#1B365D" strokeWidth="2" />
      {/* Inner gold scrollwork */}
      <path d="M10 30V10H30" stroke="#B8860B" strokeWidth="1.25" />
      <path
        d="M10 10C18 10 22 14 22 22C14 22 10 18 10 10Z"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1.15"
      />
      <circle cx="16" cy="16" r="2" fill="#1B365D" />
      {/* Delicate floral curls */}
      <path
        d="M22 10C26 6 32 6 36 10"
        stroke="#B8860B"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M10 22C6 26 6 32 10 36"
        stroke="#B8860B"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="38" cy="10" r="1.4" fill="#B8860B" />
      <circle cx="10" cy="38" r="1.4" fill="#B8860B" />
    </svg>
  );
}

function HeaderFlourish() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 26"
      className="mx-auto h-[1.15em] w-[10.5em]"
      fill="none"
    >
      {/* Left ornamental scroll & olive leaf */}
      <path
        d="M12 14C34 14 54 9 86 13"
        stroke="#B8860B"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M32 13C38 7 46 6 52 10C46 13 38 14 32 13Z"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1.05"
      />
      <path
        d="M56 11C62 6 70 6 76 11C69 14 62 13 56 11Z"
        fill="none"
        stroke="#1B365D"
        strokeWidth="0.95"
      />

      {/* Center classical diamond fleuron */}
      <path
        d="M110 5L118 13L110 21L102 13L110 5Z"
        fill="#FFFFFF"
        stroke="#1B365D"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M110 8.5L114.5 13L110 17.5L105.5 13L110 8.5Z"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1"
      />
      <circle cx="110" cy="13" r="1.4" fill="#1B365D" />
      <circle cx="94" cy="13" r="1.5" fill="#B8860B" />
      <circle cx="126" cy="13" r="1.5" fill="#B8860B" />

      {/* Right ornamental scroll & olive leaf */}
      <path
        d="M208 14C186 14 166 9 134 13"
        stroke="#B8860B"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M188 13C182 7 174 6 168 10C174 13 182 14 188 13Z"
        fill="none"
        stroke="#B8860B"
        strokeWidth="1.05"
      />
      <path
        d="M164 11C158 6 150 6 144 11C151 14 158 13 164 11Z"
        fill="none"
        stroke="#1B365D"
        strokeWidth="0.95"
      />
    </svg>
  );
}

function OrnamentalDivider() {
  return (
    <div className="my-[0.45em] flex items-center justify-center gap-3" aria-hidden="true">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B8860B] to-[#1B365D]/60" />
      <svg viewBox="0 0 24 14" className="h-[0.75em] w-[1.25em] shrink-0" fill="none">
        <path
          d="M12 1.5L17.5 7L12 12.5L6.5 7L12 1.5Z"
          stroke="#1B365D"
          strokeWidth="1.25"
          fill="#FFFFFF"
        />
        <circle cx="12" cy="7" r="1.4" fill="#B8860B" />
        <circle cx="2.5" cy="7" r="1.2" fill="#B8860B" />
        <circle cx="21.5" cy="7" r="1.2" fill="#B8860B" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#B8860B] to-[#1B365D]/60" />
    </div>
  );
}

function ManuscriptFrame({
  children,
  pageBreak = false,
  testId,
  dir,
  initialFontPx,
  contentKey,
}: {
  children: React.ReactNode;
  pageBreak?: boolean;
  testId: string;
  dir: 'ltr' | 'rtl';
  initialFontPx: number;
  contentKey: string;
}) {
  const sheetRef = useRef<HTMLElement | null>(null);
  const [fontState, setFontState] = useState<{ key: string; px: number }>({
    key: contentKey,
    px: initialFontPx,
  });

  const activeFontPx = fontState.key === contentKey ? fontState.px : initialFontPx;

  useLayoutEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    // Only auto-shrink based on measured height when laid out at desktop/Letter width
    // (narrow phone screens wrap much taller than Letter paper).
    if (el.clientWidth < 640) return;

    const currentHeight = el.getBoundingClientRect().height;
    if (currentHeight > MAX_LETTER_HEIGHT_PX && activeFontPx > MIN_BASE_FONT_PX) {
      const ratio = MAX_LETTER_HEIGHT_PX / currentHeight;
      const estimated = Math.floor(activeFontPx * Math.sqrt(ratio) * 2) / 2;
      const nextPx = Math.max(
        MIN_BASE_FONT_PX,
        Math.min(activeFontPx - 0.5, estimated),
      );
      if (nextPx < activeFontPx) {
        setFontState({ key: contentKey, px: nextPx });
      }
    }
  }, [activeFontPx, contentKey]);

  useEffect(() => {
    const handleRefit = () => {
      const el = sheetRef.current;
      if (!el || el.clientWidth < 640) return;
      const currentHeight = el.getBoundingClientRect().height;
      if (currentHeight > MAX_LETTER_HEIGHT_PX && activeFontPx > MIN_BASE_FONT_PX) {
        const nextPx = Math.max(MIN_BASE_FONT_PX, activeFontPx - 0.5);
        setFontState({ key: contentKey, px: nextPx });
      }
    };

    window.addEventListener('beforeprint', handleRefit);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleRefit);
    }
    return () => {
      window.removeEventListener('beforeprint', handleRefit);
    };
  }, [activeFontPx, contentKey]);

  return (
    <section
      ref={sheetRef}
      data-testid={testId}
      data-font-px={activeFontPx}
      dir={dir}
      style={{ fontSize: `${activeFontPx}px` }}
      className={`print-sheet judaica-paper relative mx-auto w-full max-w-[8.5in] rounded-sm border-2 border-[#1B365D] bg-white p-[0.45em] text-[#162338] shadow-xl ${
        pageBreak ? 'print-page-break mt-8 print:mt-0' : ''
      }`}
    >
      {/* Inner Gold Manuscript Frame */}
      <div className="relative border border-[#B8860B] px-[1.6em] py-[1em]">
        {/* Hairline inner accent */}
        <div className="pointer-events-none absolute inset-1 border border-[#1B365D]/15" />

        <CornerFiligree position="tl" />
        <CornerFiligree position="tr" />
        <CornerFiligree position="bl" />
        <CornerFiligree position="br" />

        {/* Traditional BS"D (B'siyata D'shmaya) */}
        <div
          dir="rtl"
          className="font-judaica absolute right-[2.2em] top-[0.65em] text-[0.75em] font-bold tracking-wide text-[#1B365D]"
        >
          בס״ד
        </div>

        <div className="relative z-10">{children}</div>
      </div>
    </section>
  );
}

export function PrintableQuiz({
  quiz,
  dafRef,
  quizType,
  mode,
  dateLabel,
  isShabbat = false,
}: PrintableQuizProps) {
  const { language, isRtl } = useLanguage();
  const tPrint = useTranslations('Print');
  const tQuizTypes = useTranslations('QuizTypes');

  const hebrewTitle = HEBREW_QUIZ_DISPLAY_TITLES[quizType] ?? 'חִידוֹן יוֹמִי';
  const localizedQuizName = tQuizTypes(QUIZ_NAME_TO_HREF[quizType]);
  const optionLetters = OPTION_LETTERS[language];
  const dir = isRtl ? 'rtl' : 'ltr';

  const showQuiz = mode === 'quiz' || mode === 'both';
  const showAnswers = mode === 'answers' || mode === 'both';

  const quizCharCount = useMemo(
    () =>
      quiz.questions.reduce(
        (sum, q) =>
          sum +
          q.questionText.length +
          q.options.reduce((optSum, opt) => optSum + opt.length, 0),
        0,
      ),
    [quiz.questions],
  );

  const answersCharCount = useMemo(
    () =>
      quiz.questions.reduce(
        (sum, q) =>
          sum +
          q.questionText.length +
          q.correctAnswer.length +
          q.reference.text.length,
        0,
      ),
    [quiz.questions],
  );

  const initialQuizFontPx = useMemo(
    () => estimateInitialFontPx(quizCharCount, 'quiz'),
    [quizCharCount],
  );
  const initialAnswersFontPx = useMemo(
    () => estimateInitialFontPx(answersCharCount, 'answers'),
    [answersCharCount],
  );

  const contentSignature = `${dafRef}:${language}:${quizCharCount}:${answersCharCount}`;

  const formatReferenceLocation = (side: 'A' | 'B' | undefined, line: number) => {
    const lineText = tPrint('lineLabel', { line });
    if (side) {
      const sideText = side === 'A' ? tPrint('sideA') : tPrint('sideB');
      return `${dafRef} • ${sideText}, ${lineText}`;
    }
    return `${dafRef} • ${lineText}`;
  };

  const formattedDateLine = dateLabel
    ? isShabbat
      ? tPrint('shabbatDatePrefix', { date: dateLabel })
      : dateLabel
    : '';

  return (
    <div className="space-y-8 print:space-y-0">
      {showQuiz && (
        <ManuscriptFrame
          testId="printable-quiz-sheet"
          dir={dir}
          initialFontPx={initialQuizFontPx}
          contentKey={`quiz:${contentSignature}`}
        >
          {/* Header */}
          <header className="text-center">
            <HeaderFlourish />

            <p
              dir="rtl"
              className="font-judaica mt-[0.15em] text-[0.85em] font-bold tracking-wide text-[#B8860B]"
            >
              {hebrewTitle} • חִידוֹן יוֹמִי
            </p>

            <h1 className="font-judaica text-[1.5em] font-bold leading-tight tracking-tight text-[#1B365D]">
              {tPrint('quizHeading', { quizName: localizedQuizName })}
            </h1>

            {/* Passage / Daf Reference Banner */}
            <div className="mt-[0.35em] inline-flex items-center gap-[0.5em] rounded-full border border-[#B8860B] bg-white px-[1em] py-[0.12em] text-[0.88em] font-semibold text-[#1B365D]">
              <span className="text-[#B8860B]">✦</span>
              <span className="font-judaica-serif tracking-wide">
                {dafRef}
              </span>
              <span className="text-[#B8860B]">✦</span>
            </div>

            {formattedDateLine && (
              <p
                className={`mt-[0.25em] text-[0.68em] text-[#475569] ${
                  isRtl ? '' : 'uppercase tracking-[0.15em]'
                }`}
              >
                {formattedDateLine}
              </p>
            )}
          </header>

          <OrnamentalDivider />

          {/* Name / Date / Score Bar */}
          <div className="mb-[0.6em] flex flex-wrap items-end justify-between gap-[0.75em] rounded border border-[#B8860B]/70 bg-white px-[0.8em] py-[0.4em] text-[0.78em] text-[#1B365D]">
            <div className="flex flex-1 min-w-[140px] items-baseline gap-2">
              <span className="font-judaica font-semibold">{tPrint('nameField')}</span>
              <span className="flex-1 border-b border-dotted border-[#1B365D]/60 pb-0.5" />
            </div>
            <div className="flex w-[9em] items-baseline gap-2">
              <span className="font-judaica font-semibold">{tPrint('dateField')}</span>
              <span className="flex-1 border-b border-dotted border-[#1B365D]/60 pb-0.5" />
            </div>
            <div className="flex items-center gap-1.5 rounded border border-[#B8860B] bg-white px-[0.55em] py-[0.1em] font-judaica font-semibold">
              <span>{tPrint('scoreField')}</span>
              <span dir="ltr" className="inline-flex items-center gap-1">
                <span className="inline-block w-[1.8em] border-b border-[#1B365D]/60 text-center">
                  &nbsp;
                </span>
                <span>/ {quiz.questions.length}</span>
              </span>
            </div>
          </div>

          <p
            className={`mb-[0.55em] text-center font-judaica-serif text-[0.76em] text-[#475569] ${
              isRtl ? '' : 'italic'
            }`}
          >
            {tPrint('instructions')}
          </p>

          {/* Questions List */}
          <ol className="space-y-[0.5em]">
            {quiz.questions.map((question, qIndex) => {
              const hebrewNum = HEBREW_LETTERS[qIndex] ?? `${qIndex + 1}`;
              return (
                <li
                  key={question.questionNumber}
                  className="print-avoid-break rounded-md border border-[#1B365D]/25 bg-white px-[0.8em] py-[0.45em] text-start"
                >
                  <div className="flex items-start gap-[0.65em]">
                    {/* Crisp Outlined Number Medallion */}
                    <div className="flex h-[1.85em] w-[1.85em] shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#1B365D] bg-white ring-1 ring-[#B8860B]/70 ring-offset-1">
                      <span className="text-[0.7em] font-bold leading-none text-[#1B365D]">
                        {qIndex + 1}
                      </span>
                      <span
                        dir="rtl"
                        className="font-judaica text-[0.52em] font-bold leading-none text-[#B8860B]"
                      >
                        {hebrewNum}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-judaica text-[0.86em] font-semibold leading-snug text-[#162338]">
                        {question.questionText}
                      </p>

                      <div className="mt-[0.35em] grid grid-cols-1 gap-x-[0.8em] gap-y-[0.25em] sm:grid-cols-2 print:grid-cols-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-start gap-[0.4em] text-[0.76em] leading-snug text-[#1E293B]"
                          >
                            <span className="mt-[0.1em] flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center rounded-full border border-[#1B365D] bg-white font-judaica text-[0.85em] font-bold text-[#1B365D]">
                              {optionLetters[optIndex] ?? optIndex + 1}
                            </span>
                            <span className="flex-1">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Traditional Closing Quote & Footer */}
          <footer className="mt-[0.65em] text-center">
            <OrnamentalDivider />
            <p
              dir="rtl"
              className="font-judaica text-[0.78em] font-semibold text-[#1B365D]"
            >
              הֲפֹךְ בָּהּ וַהֲפֹךְ בָּהּ דְּכֹלָּא בָהּ
            </p>
            {!isRtl && (
              <p className="font-judaica-serif text-[0.7em] italic text-[#475569]">
                &ldquo;Turn it and turn it again, for everything is in it.&rdquo; — Pirkei Avot 5:22
              </p>
            )}
            {isRtl && (
              <p className="font-judaica text-[0.7em] text-[#475569]">
                פרקי אבות ה׳, כ״ב
              </p>
            )}
            <p
              className={`mt-[0.25em] text-[0.58em] text-[#64748B] ${
                isRtl ? '' : 'uppercase tracking-[0.15em]'
              }`}
            >
              {tPrint('footerQuiz', { quizName: localizedQuizName })}
            </p>
          </footer>
        </ManuscriptFrame>
      )}

      {showAnswers && (
        <ManuscriptFrame
          pageBreak={showQuiz}
          testId="printable-answer-sheet"
          dir={dir}
          initialFontPx={initialAnswersFontPx}
          contentKey={`answers:${contentSignature}`}
        >
          {/* Header */}
          <header className="text-center">
            <HeaderFlourish />

            {/* Crisp Outlined Answer Sheet Ribbon */}
            <div className="mt-[0.25em] inline-flex items-center gap-[0.5em] rounded border-2 border-[#1B365D] bg-white px-[0.9em] py-[0.15em] text-[0.7em] font-bold uppercase tracking-[0.15em] text-[#1B365D]">
              <span dir="rtl" className="font-judaica text-[1.1em] tracking-normal text-[#B8860B]">
                מַפְתֵּחַ תְּשׁוּבוֹת
              </span>
              {!isRtl && (
                <>
                  <span className="text-[#B8860B]">•</span>
                  <span>{tPrint('answerSheetBadge')}</span>
                </>
              )}
            </div>

            <h2 className="font-judaica mt-[0.25em] text-[1.25em] font-bold leading-tight tracking-tight text-[#1B365D]">
              {localizedQuizName} — {dafRef}
            </h2>

            {formattedDateLine && (
              <p
                className={`mt-[0.15em] text-[0.68em] text-[#475569] ${
                  isRtl ? '' : 'uppercase tracking-[0.15em]'
                }`}
              >
                {formattedDateLine}
              </p>
            )}
          </header>

          <OrnamentalDivider />

          {/* Compact Single-Row Quick-Check Answer Key Strip */}
          <div
            data-testid="quick-answer-key"
            className="mb-[0.6em] flex flex-wrap items-center justify-center gap-[0.5em] rounded-md border border-[#B8860B] bg-white px-[0.8em] py-[0.35em]"
          >
            <span
              className={`font-judaica text-[0.72em] font-bold text-[#1B365D] ${
                isRtl ? '' : 'uppercase tracking-[0.12em]'
              }`}
            >
              {tPrint('quickKeyTitle')}:
            </span>
            {quiz.questions.map((question, qIndex) => {
              const letter =
                optionLetters[question.correctAnswerIndex] ??
                String(question.correctAnswerIndex + 1);
              return (
                <div
                  key={question.questionNumber}
                  className="flex items-center gap-1 rounded border border-[#1B365D]/30 bg-white px-[0.5em] py-[0.1em] text-[0.75em]"
                >
                  <span className="font-judaica font-semibold text-[#475569]">
                    {tPrint('quickKeyItem', { number: qIndex + 1 })}
                  </span>
                  <span className="flex h-[1.4em] w-[1.4em] items-center justify-center rounded-full border border-[#1B365D] bg-white font-judaica text-[0.85em] font-bold text-[#1B365D]">
                    {letter}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Detailed Answers & Source References */}
          <ol className="space-y-[0.45em]">
            {quiz.questions.map((question, qIndex) => {
              const hebrewNum = HEBREW_LETTERS[qIndex] ?? `${qIndex + 1}`;
              const correctLetter =
                optionLetters[question.correctAnswerIndex] ??
                String(question.correctAnswerIndex + 1);

              return (
                <li
                  key={question.questionNumber}
                  className="print-avoid-break rounded-md border border-[#1B365D]/25 bg-white px-[0.8em] py-[0.45em] text-start"
                >
                  <div className="flex items-start gap-[0.6em]">
                    <div className="flex h-[1.6em] w-[1.6em] shrink-0 flex-col items-center justify-center rounded-full border border-[#B8860B] bg-white text-[#1B365D]">
                      <span className="text-[0.65em] font-bold leading-none">
                        {qIndex + 1}
                      </span>
                      <span
                        dir="rtl"
                        className="font-judaica text-[0.48em] font-bold leading-none text-[#B8860B]"
                      >
                        {hebrewNum}
                      </span>
                    </div>

                    <div className="flex-1 space-y-[0.25em]">
                      <p className="font-judaica text-[0.8em] font-semibold leading-snug text-[#162338]">
                        {question.questionText}
                      </p>

                      {/* Correct Answer Highlight */}
                      <div className="flex items-start gap-[0.4em] rounded border border-[#1B365D]/20 border-s-4 border-s-[#B8860B] bg-white px-[0.55em] py-[0.25em] text-[0.74em] leading-snug text-[#1B365D]">
                        <span className="mt-[0.15em] flex h-[1.2em] w-[1.2em] shrink-0 items-center justify-center rounded-full border border-[#1B365D] bg-white text-[#1B365D]">
                          <Check className="h-[0.8em] w-[0.8em]" strokeWidth={3} />
                        </span>
                        <div>
                          <span className="font-bold">
                            {tPrint('answerPrefix', { letter: correctLetter })}{' '}
                          </span>
                          <span className="font-medium">
                            {question.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Source Reference */}
                      <blockquote className="border-s-2 border-[#B8860B] ps-[0.6em] text-[0.68em] leading-snug text-[#475569]">
                        <span className="font-semibold not-italic text-[#1B365D]">
                          {tPrint('sourcePrefix', {
                            location: formatReferenceLocation(
                              question.reference.side,
                              question.reference.line,
                            ),
                          })}
                        </span>{' '}
                        <span
                          className={`font-judaica-serif ${isRtl ? '' : 'italic'}`}
                        >
                          &ldquo;{question.reference.text}&rdquo;
                        </span>
                      </blockquote>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Footer */}
          <footer className="mt-[0.65em] text-center">
            <OrnamentalDivider />
            <p
              dir="rtl"
              className="font-judaica text-[0.78em] font-semibold text-[#1B365D]"
            >
              כָּל הַשּׁוֹנֶה הֲלָכוֹת בְּכָל יוֹם מֻבְטָח לוֹ שֶׁהוּא בֶּן הָעוֹלָם הַבָּא
            </p>
            {!isRtl && (
              <p className="font-judaica-serif text-[0.7em] italic text-[#475569]">
                &ldquo;Whoever studies Torah laws every day is assured a share in the World to Come.&rdquo; — Megillah 28b
              </p>
            )}
            {isRtl && (
              <p className="font-judaica text-[0.7em] text-[#475569]">
                מגילה כ״ח ע״ב
              </p>
            )}
            <p
              className={`mt-[0.25em] text-[0.58em] text-[#64748B] ${
                isRtl ? '' : 'uppercase tracking-[0.15em]'
              }`}
            >
              {tPrint('footerAnswers', { quizName: localizedQuizName })}
            </p>
          </footer>
        </ManuscriptFrame>
      )}
    </div>
  );
}
