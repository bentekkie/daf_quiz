'use client';

import type { QuizData, QuizTypeName } from '@/lib/types';
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

const HEBREW_QUIZ_TITLES: Record<QuizTypeName, string> = {
  'Daf Yomi': 'דַּף יוֹמִי',
  'Daily Rambam': 'רַמְבַּ״ם יוֹמִי',
  'Daily Rambam (3 Chapters)': 'רַמְבַּ״ם יוֹמִי • ג׳ פְּרָקִים',
  'Tanya Yomi': 'תַּנְיָא יוֹמִי',
  'Daily Mishnah': 'מִשְׁנָה יוֹמִית',
  '929': 'תַּנַ״ךְ יוֹמִי • 929',
};

const HEBREW_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳'];
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function CornerFiligree({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const transforms: Record<'tl' | 'tr' | 'bl' | 'br', string> = {
    tl: 'top-2.5 left-2.5',
    tr: 'top-2.5 right-2.5 scale-x-[-1]',
    bl: 'bottom-2.5 left-2.5 scale-y-[-1]',
    br: 'bottom-2.5 right-2.5 scale-[-1]',
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className={`pointer-events-none absolute h-12 w-12 ${transforms[position]}`}
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
      className="mx-auto h-6 w-52"
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
    <div className="my-3 flex items-center justify-center gap-3" aria-hidden="true">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#B8860B] to-[#1B365D]/60" />
      <svg viewBox="0 0 24 14" className="h-3.5 w-6 shrink-0" fill="none">
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
}: {
  children: React.ReactNode;
  pageBreak?: boolean;
  testId: string;
}) {
  return (
    <section
      data-testid={testId}
      className={`print-sheet judaica-paper relative mx-auto w-full max-w-[8.5in] rounded-sm border-2 border-[#1B365D] bg-white p-2.5 text-[#162338] shadow-xl ${
        pageBreak ? 'print-page-break mt-8 print:mt-0' : ''
      }`}
    >
      {/* Inner Gold Manuscript Frame */}
      <div className="relative border border-[#B8860B] px-7 py-6 sm:px-10 sm:py-8">
        {/* Hairline inner accent */}
        <div className="pointer-events-none absolute inset-1.5 border border-[#1B365D]/15" />

        <CornerFiligree position="tl" />
        <CornerFiligree position="tr" />
        <CornerFiligree position="bl" />
        <CornerFiligree position="br" />

        {/* Traditional BS"D (B'siyata D'shmaya) */}
        <div
          dir="rtl"
          className="font-judaica absolute right-11 top-4 text-sm font-bold tracking-wide text-[#1B365D]"
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
  const hebrewTitle = HEBREW_QUIZ_TITLES[quizType] ?? 'חִידוֹן יוֹמִי';
  const showQuiz = mode === 'quiz' || mode === 'both';
  const showAnswers = mode === 'answers' || mode === 'both';

  const formatReferenceLocation = (side: 'A' | 'B' | undefined, line: number) => {
    if (side) {
      return `${dafRef} • Side ${side}, Line ${line}`;
    }
    return `${dafRef} • Line ${line}`;
  };

  return (
    <div className="space-y-8 print:space-y-0">
      {showQuiz && (
        <ManuscriptFrame testId="printable-quiz-sheet">
          {/* Header */}
          <header className="text-center">
            <HeaderFlourish />

            <p
              dir="rtl"
              className="font-judaica mt-1 text-lg font-bold tracking-wide text-[#B8860B]"
            >
              {hebrewTitle} • חִידוֹן יוֹמִי
            </p>

            <h1 className="font-judaica mt-0.5 text-3xl font-bold tracking-tight text-[#1B365D]">
              {quizType} Quiz
            </h1>

            {/* Passage / Daf Reference Banner (white background for ink-friendly printing) */}
            <div className="mt-2.5 inline-flex items-center gap-2.5 rounded-full border border-[#B8860B] bg-white px-5 py-1 text-base font-semibold text-[#1B365D]">
              <span className="text-[#B8860B]">✦</span>
              <span className="font-judaica-serif text-lg tracking-wide">
                {dafRef}
              </span>
              <span className="text-[#B8860B]">✦</span>
            </div>

            {dateLabel && (
              <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-[#475569]">
                {isShabbat ? `Shabbat • ${dateLabel}` : dateLabel}
              </p>
            )}
          </header>

          <OrnamentalDivider />

          {/* Name / Date / Score Bar */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 rounded border border-[#B8860B]/70 bg-white px-4 py-2.5 text-sm text-[#1B365D]">
            <div className="flex flex-1 min-w-[180px] items-baseline gap-2">
              <span className="font-judaica font-semibold">Name:</span>
              <span className="flex-1 border-b border-dotted border-[#1B365D]/60 pb-0.5" />
            </div>
            <div className="flex w-40 items-baseline gap-2">
              <span className="font-judaica font-semibold">Date:</span>
              <span className="flex-1 border-b border-dotted border-[#1B365D]/60 pb-0.5" />
            </div>
            <div className="flex items-center gap-1.5 rounded border border-[#B8860B] bg-white px-2.5 py-0.5 font-judaica font-semibold">
              <span>Score:</span>
              <span className="inline-block w-7 border-b border-[#1B365D]/60 text-center">
                &nbsp;
              </span>
              <span>/ {quiz.questions.length}</span>
            </div>
          </div>

          <p className="mb-4 text-center font-judaica-serif text-sm italic text-[#475569]">
            Circle the letter of the best answer for each question below.
          </p>

          {/* Questions List */}
          <ol className="space-y-4">
            {quiz.questions.map((question, qIndex) => {
              const hebrewNum = HEBREW_LETTERS[qIndex] ?? `${qIndex + 1}`;
              return (
                <li
                  key={question.questionNumber}
                  className="print-avoid-break rounded-md border border-[#1B365D]/25 bg-white px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Crisp Outlined Number Medallion (ink-friendly) */}
                    <div className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#1B365D] bg-white ring-1 ring-[#B8860B]/70 ring-offset-1">
                      <span className="text-xs font-bold leading-none text-[#1B365D]">
                        {qIndex + 1}
                      </span>
                      <span
                        dir="rtl"
                        className="font-judaica text-[9px] font-bold leading-none text-[#B8860B]"
                      >
                        {hebrewNum}
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="font-judaica text-[15px] font-semibold leading-snug text-[#162338]">
                        {question.questionText}
                      </p>

                      <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-start gap-2 text-[13px] leading-snug text-[#1E293B]"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1B365D] bg-white font-judaica text-[11px] font-bold text-[#1B365D]">
                              {OPTION_LETTERS[optIndex] ?? optIndex + 1}
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
          <footer className="mt-5 text-center">
            <OrnamentalDivider />
            <p
              dir="rtl"
              className="font-judaica text-sm font-semibold text-[#1B365D]"
            >
              הֲפֹךְ בָּהּ וַהֲפֹךְ בָּהּ דְּכֹלָּא בָהּ
            </p>
            <p className="font-judaica-serif text-xs italic text-[#475569]">
              &ldquo;Turn it and turn it again, for everything is in it.&rdquo; — Pirkei Avot 5:22
            </p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
              {quizType} • Daf Quiz • Powered by Sefaria
            </p>
          </footer>
        </ManuscriptFrame>
      )}

      {showAnswers && (
        <ManuscriptFrame
          pageBreak={showQuiz}
          testId="printable-answer-sheet"
        >
          {/* Header */}
          <header className="text-center">
            <HeaderFlourish />

            {/* Crisp Outlined Answer Sheet Ribbon (ink-friendly) */}
            <div className="mt-1.5 inline-flex items-center gap-2 rounded border-2 border-[#1B365D] bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1B365D]">
              <span dir="rtl" className="font-judaica text-sm tracking-normal text-[#B8860B]">
                מַפְתֵּחַ תְּשׁוּבוֹת
              </span>
              <span className="text-[#B8860B]">•</span>
              <span>Answer Sheet</span>
            </div>

            <h2 className="font-judaica mt-2 text-2xl font-bold tracking-tight text-[#1B365D]">
              {quizType} — {dafRef}
            </h2>

            {dateLabel && (
              <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-[#475569]">
                {isShabbat ? `Shabbat • ${dateLabel}` : dateLabel}
              </p>
            )}
          </header>

          <OrnamentalDivider />

          {/* Quick-Check Answer Key Strip */}
          <div
            data-testid="quick-answer-key"
            className="mb-5 rounded-md border border-[#B8860B] bg-white px-4 py-2.5"
          >
            <p className="mb-2 text-center font-judaica text-xs font-bold uppercase tracking-[0.2em] text-[#1B365D]">
              Quick-Check Key
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {quiz.questions.map((question, qIndex) => {
                const letter =
                  OPTION_LETTERS[question.correctAnswerIndex] ??
                  String(question.correctAnswerIndex + 1);
                return (
                  <div
                    key={question.questionNumber}
                    className="flex items-center gap-1.5 rounded border border-[#1B365D]/30 bg-white px-3 py-1 text-sm"
                  >
                    <span className="font-judaica font-semibold text-[#475569]">
                      Q{qIndex + 1}:
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1B365D] bg-white font-judaica text-xs font-bold text-[#1B365D]">
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Answers & Source References */}
          <ol className="space-y-3.5">
            {quiz.questions.map((question, qIndex) => {
              const hebrewNum = HEBREW_LETTERS[qIndex] ?? `${qIndex + 1}`;
              const correctLetter =
                OPTION_LETTERS[question.correctAnswerIndex] ??
                String(question.correctAnswerIndex + 1);

              return (
                <li
                  key={question.questionNumber}
                  className="print-avoid-break rounded-md border border-[#1B365D]/25 bg-white px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 flex-col items-center justify-center rounded-full border border-[#B8860B] bg-white text-[#1B365D]">
                      <span className="text-[11px] font-bold leading-none">
                        {qIndex + 1}
                      </span>
                      <span
                        dir="rtl"
                        className="font-judaica text-[8px] font-bold leading-none text-[#B8860B]"
                      >
                        {hebrewNum}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <p className="font-judaica text-sm font-semibold leading-snug text-[#162338]">
                        {question.questionText}
                      </p>

                      {/* Correct Answer Highlight (crisp left gold bar on white) */}
                      <div className="flex items-start gap-2 rounded border border-[#1B365D]/20 border-l-4 border-l-[#B8860B] bg-white px-2.5 py-1.5 text-[13px] text-[#1B365D]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#1B365D] bg-white text-[#1B365D]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <div>
                          <span className="font-bold">
                            Answer ({correctLetter}):{' '}
                          </span>
                          <span className="font-medium">
                            {question.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Source Reference */}
                      <blockquote className="border-l-2 border-[#B8860B] pl-3 text-xs text-[#475569]">
                        <span className="font-semibold not-italic text-[#1B365D]">
                          Source ({formatReferenceLocation(question.reference.side, question.reference.line)}):
                        </span>{' '}
                        <span className="font-judaica-serif italic">
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
          <footer className="mt-5 text-center">
            <OrnamentalDivider />
            <p
              dir="rtl"
              className="font-judaica text-sm font-semibold text-[#1B365D]"
            >
              כָּל הַשּׁוֹנֶה הֲלָכוֹת בְּכָל יוֹם מֻבְטָח לוֹ שֶׁהוּא בֶּן הָעוֹלָם הַבָּא
            </p>
            <p className="font-judaica-serif text-xs italic text-[#475569]">
              &ldquo;Whoever studies Torah laws every day is assured a share in the World to Come.&rdquo; — Megillah 28b
            </p>
            <p className="mt-1.5 text-[10px] uppercase tracking-[0.2em] text-[#64748B]">
              {quizType} Answer Key • Daf Quiz • Source Text via Sefaria.org
            </p>
          </footer>
        </ManuscriptFrame>
      )}
    </div>
  );
}
