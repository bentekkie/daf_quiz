import { getTodaysQuiz } from '@/lib/quiz-service'
import { QuizTypeHref, QuizTypeName, QuizTypes, YearMonthDay } from '@/lib/types';
import type { NextRequest } from 'next/server'
import { DateTime } from 'luxon';


function isKeyOfObject<T extends object>(
    key: string | number | symbol,
    obj: T,
): key is keyof T {
    return key in obj;
}

function resolveQuizInfo(urlType: string): { name: QuizTypeName, href: QuizTypeHref } {
    if (!isKeyOfObject(urlType, QuizTypes)) {
        throw new Error(`Invalid quiz type: ${urlType}`)
    }
    return { name: QuizTypes[urlType].name, href: urlType }
}

const MAX_FUTURE_DAYS = 7;

function getDate(request: NextRequest): { date: YearMonthDay; isFutureDate: boolean } {
    const tz = request.nextUrl.searchParams.get("tz")
    if (tz === null) {
        throw new Error(`Missing tz query param`)
    }
    const today = DateTime.local({ zone: tz }).startOf('day')
    if (!today.isValid) {
        throw new Error(`Invalid tz query param: ${tz}`)
    }

    const dateParam = request.nextUrl.searchParams.get("date")
    if (!dateParam) {
        return {
            date: { year: today.year, month: today.month, day: today.day },
            isFutureDate: false,
        }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
        throw new Error(`Invalid date format: ${dateParam}. Expected YYYY-MM-DD.`)
    }

    const requested = DateTime.fromISO(dateParam, { zone: tz }).startOf('day')
    if (!requested.isValid) {
        throw new Error(`Invalid date: ${dateParam}`)
    }

    const diffDays = Math.round(requested.diff(today, 'days').days)
    if (diffDays < 0 || diffDays > MAX_FUTURE_DAYS) {
        throw new Error(`Date must be between today and ${MAX_FUTURE_DAYS} days in the future.`)
    }

    return {
        date: {
            year: requested.year,
            month: requested.month,
            day: requested.day,
        },
        isFutureDate: diffDays > 0,
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ quizType: string }> }) {
    try {
        const { quizType } = await params
        const info = resolveQuizInfo(quizType)
        const { date, isFutureDate } = getDate(request)
        const quiz = await getTodaysQuiz(info.name, date, { isFutureDate })
        return Response.json({ name: info.name, dafRef: quiz.dafRef, quiz: quiz.quiz })
    }
    catch (e) {
        return Response.json({error: (e as Error).toString()}, {status: 500})
    }
}