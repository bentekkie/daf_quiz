'use client';

import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  Printer,
  Terminal,
} from 'lucide-react';
import type { QuizData, QuizTypeHref, QuizTypeName } from '@/lib/types';
import { PrintableQuiz, type PrintViewMode } from './printable-quiz';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PrintQuizClientProps {
  name: QuizTypeName;
  href: QuizTypeHref;
  initialMode?: PrintViewMode;
  initialDate?: string;
}

interface QuizApiResponse {
  name: string;
  dafRef: string;
  quiz: QuizData | null;
  error?: string;
}

interface DateOption {
  iso: string;
  label: string;
  fullLabel: string;
  isShabbat: boolean;
  offsetDays: number;
}

const FUTURE_DAYS_COUNT = 7;

function buildDateOptions(today: DateTime): DateOption[] {
  const options: DateOption[] = [];
  for (let offset = 0; offset <= FUTURE_DAYS_COUNT; offset++) {
    const dt = today.plus({ days: offset });
    const iso = dt.toISODate() ?? '';
    const isShabbat = dt.weekday === 6; // Luxon: 1 = Monday ... 6 = Saturday
    const shortDate = dt.toFormat('ccc, MMM d');
    const fullLabel = dt.toLocaleString(DateTime.DATE_FULL);

    let prefix = '';
    if (offset === 0) {
      prefix = isShabbat ? 'Today (Shabbat) — ' : 'Today — ';
    } else if (offset === 1) {
      prefix = isShabbat ? 'Tomorrow (Shabbat) — ' : 'Tomorrow — ';
    } else if (isShabbat) {
      prefix = 'Shabbat — ';
    }

    options.push({
      iso,
      label: `${prefix}${shortDate}`,
      fullLabel,
      isShabbat,
      offsetDays: offset,
    });
  }
  return options;
}

export function PrintQuizClient({
  name,
  href,
  initialMode = 'both',
  initialDate,
}: PrintQuizClientProps) {
  const [data, setData] = useState<QuizApiResponse>({
    name,
    dafRef: '',
    quiz: null,
  });
  const [mode, setMode] = useState<PrintViewMode>(initialMode);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  const today = useMemo(() => DateTime.local().startOf('day'), []);
  const zoneName = today.zoneName;
  const dateOptions = useMemo(() => buildDateOptions(today), [today]);

  const [selectedIso, setSelectedIso] = useState<string>(() => {
    if (initialDate && dateOptions.some((opt) => opt.iso === initialDate)) {
      return initialDate;
    }
    return dateOptions[0]?.iso ?? '';
  });

  const selectedDate =
    dateOptions.find((opt) => opt.iso === selectedIso) ?? dateOptions[0];
  const upcomingShabbat =
    dateOptions.find((opt) => opt.offsetDays > 0 && opt.isShabbat) ?? null;

  const requestKey = `${href}:${selectedDate.iso}:${zoneName}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ tz: zoneName });
    if (selectedDate.offsetDays > 0) {
      params.set('date', selectedDate.iso);
    }

    fetch(`/api/${href}?${params.toString()}`)
      .then((res) => res.json() as Promise<QuizApiResponse>)
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoadedKey(requestKey);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData({
            name,
            dafRef: '',
            quiz: null,
            error: err instanceof Error ? err.message : String(err),
          });
          setLoadedKey(requestKey);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [href, name, requestKey, selectedDate.iso, selectedDate.offsetDays, zoneName]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#ECEAE4] print:bg-white">
      {/* Top Print Controls Toolbar (hidden when printing) */}
      <div className="no-print sticky top-0 z-40 border-b border-[#1B365D]/15 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-sm">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${href}`}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Quiz
              </Link>
            </Button>
            <span className="hidden h-5 w-px bg-border sm:inline-block" />
            <span className="hidden font-judaica text-base font-bold text-[#1B365D] lg:inline">
              Print {name}
              {data.dafRef ? ` — ${data.dafRef}` : ''}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date Picker (Today through +7 days, highlighting Shabbat) */}
            <label className="inline-flex items-center gap-1.5 rounded-md border border-[#1B365D]/20 bg-white px-2.5 py-1.5 text-xs font-medium text-[#1B365D]">
              <Calendar className="h-3.5 w-3.5 text-[#B8860B]" aria-hidden="true" />
              <span className="text-[#475569]">Date:</span>
              <select
                aria-label="Select printout date"
                value={selectedDate.iso}
                onChange={(e) => setSelectedIso(e.target.value)}
                className="bg-transparent pr-1 text-xs font-medium text-[#1B365D] focus:outline-none cursor-pointer"
              >
                {dateOptions.map((opt) => (
                  <option key={opt.iso} value={opt.iso}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            {upcomingShabbat && selectedDate.iso !== upcomingShabbat.iso && (
              <button
                type="button"
                onClick={() => setSelectedIso(upcomingShabbat.iso)}
                title={`Switch printout to ${upcomingShabbat.label}`}
                className="inline-flex items-center gap-1 rounded-md border border-[#B8860B] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1B365D] transition-colors hover:bg-[#B8860B]/10 cursor-pointer"
              >
                For Shabbat
              </button>
            )}

            {/* View Mode Selector */}
            <div
              role="group"
              aria-label="Printout mode"
              className="inline-flex rounded-md border border-[#1B365D]/20 bg-white p-0.5"
            >
              <button
                type="button"
                onClick={() => setMode('both')}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === 'both'
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'text-[#1B365D] hover:bg-[#1B365D]/10'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Quiz &amp; Answers
              </button>
              <button
                type="button"
                onClick={() => setMode('quiz')}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === 'quiz'
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'text-[#1B365D] hover:bg-[#1B365D]/10'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Quiz Only
              </button>
              <button
                type="button"
                onClick={() => setMode('answers')}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  mode === 'answers'
                    ? 'bg-[#1B365D] text-white shadow-xs'
                    : 'text-[#1B365D] hover:bg-[#1B365D]/10'
                }`}
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Answer Sheet
              </button>
            </div>

            <Button
              onClick={handlePrint}
              disabled={loading || !data.quiz}
              className="bg-[#1B365D] text-white hover:bg-[#142947]"
              size="sm"
            >
              <Printer className="mr-1.5 h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Sheet Preview Area */}
      <main className="px-4 py-8 print:p-0">
        {data.error ? (
          <div className="mx-auto max-w-2xl">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error loading printable quiz</AlertTitle>
              <AlertDescription>{data.error}</AlertDescription>
            </Alert>
          </div>
        ) : loading || !data.quiz ? (
          <div className="mx-auto max-w-[8.5in] rounded-sm border-2 border-[#1B365D]/20 bg-white p-10 shadow-lg">
            <div className="flex flex-col items-center gap-3">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="mt-8 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <PrintableQuiz
            quiz={data.quiz}
            dafRef={data.dafRef}
            quizType={name}
            mode={mode}
            dateLabel={selectedDate.fullLabel}
            isShabbat={selectedDate.isShabbat}
          />
        )}
      </main>
    </div>
  );
}
