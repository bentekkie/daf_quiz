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

function getDate(request: NextRequest): YearMonthDay {
    const tz = request.nextUrl.searchParams.get("tz")
    if (tz === null) {
        throw new Error(`Missing tz query param`)
    }
    const date = DateTime.local({zone: tz})
    return {
        year: date.year,
        month: date.month,
        day: date.day
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ quizType: string }> }) {
    try {
        const { quizType } = await params
        const info = resolveQuizInfo(quizType)
        const quiz = await getTodaysQuiz(info.name, getDate(request))
        return Response.json({ name: info.name, dafRef: quiz.dafRef, quiz: quiz.quiz })
    }
    catch (e) {
        return Response.json({error: (e as Error).toString()}, {status: 500})
    }
}