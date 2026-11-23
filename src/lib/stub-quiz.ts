import type { QuizData, QuizTypeName } from '@/lib/types';

export interface StubQuizResponse {
  dafRef: string;
  quiz: QuizData;
}

const DAF_YOMI_STUB: StubQuizResponse = {
  dafRef: 'Berakhot 2a',
  quiz: {
    questions: [
      {
        questionNumber: 1,
        questionText:
          'According to the Mishnah on Berakhot 2a, from what time may one recite the evening Shema?',
        options: [
          'From the time when the kohanim enter to eat their terumah',
          'From the exact moment of sunset regardless of the stars',
          'From the beginning of the second watch of the night',
          'Only after the evening Amidah has been recited',
        ],
        correctAnswer: 'From the time when the kohanim enter to eat their terumah',
        correctAnswerIndex: 0,
        reference: {
          side: 'A',
          line: 1,
          text: 'From what time may one recite the Shema in the evening? From the hour when the priests enter to eat their terumah.',
        },
      },
      {
        questionNumber: 2,
        questionText:
          'Until what time does Rabbi Eliezer rule that the evening Shema may be recited?',
        options: [
          'Until midnight (chatzot)',
          'Until the end of the first watch',
          'Until the rise of dawn (amud hashachar)',
          'Until sunrise (hanetz hachamah)',
        ],
        correctAnswer: 'Until the end of the first watch',
        correctAnswerIndex: 1,
        reference: {
          side: 'A',
          line: 2,
          text: 'Until the end of the first watch, the words of Rabbi Eliezer.',
        },
      },
      {
        questionNumber: 3,
        questionText:
          'Until when do the Sages (Chachamim) say one may recite the evening Shema?',
        options: [
          'Until the end of the first watch',
          'Until the end of the second watch',
          'Until midnight (chatzot)',
          'Until dawn without any Rabbinic fence',
        ],
        correctAnswer: 'Until midnight (chatzot)',
        correctAnswerIndex: 2,
        reference: {
          side: 'A',
          line: 2,
          text: 'And the Sages say: Until midnight. Rabban Gamliel says: Until the column of dawn rises.',
        },
      },
      {
        questionNumber: 4,
        questionText:
          'Why did the Sages limit the time for reciting the evening Shema to midnight, even though Rabban Gamliel said it may be recited until dawn?',
        options: [
          'Because the Torah explicitly forbids reciting Shema after midnight',
          'Because kohanim may not eat terumah after midnight',
          'To align the evening Shema with the burning of the daily Tamid offering',
          'To distance a person from transgression',
        ],
        correctAnswer: 'To distance a person from transgression',
        correctAnswerIndex: 3,
        reference: {
          side: 'A',
          line: 5,
          text: 'If so, why did the Sages say until midnight? In order to distance a person from transgression.',
        },
      },
      {
        questionNumber: 5,
        questionText:
          'What fundamental question does the Gemara immediately ask about the opening of the Mishnah?',
        options: [
          'Why the Tanna begins with the evening Shema before the morning Shema, and where the obligation to recite Shema is derived from',
          'Whether women are obligated in the recitation of the evening Shema',
          'How many blessings must precede the evening Shema',
          'Which translation of the Torah may be used for Shema',
        ],
        correctAnswer:
          'Why the Tanna begins with the evening Shema before the morning Shema, and where the obligation to recite Shema is derived from',
        correctAnswerIndex: 0,
        reference: {
          side: 'A',
          line: 7,
          text: 'The Tanna—upon what verse does he base himself that he teaches "From what time"? And furthermore, why does he teach the evening Shema first?',
        },
      },
    ],
  },
};

const DAILY_MISHNAH_STUB: StubQuizResponse = {
  dafRef: 'Mishnah Berakhot 1:1',
  quiz: {
    questions: [
      {
        questionNumber: 1,
        questionText:
          'In Mishnah Berakhot 1:1, whose sons returned from a banquet hall after midnight and asked whether they could still recite Shema?',
        options: [
          'Rabbi Eliezer',
          'Rabban Gamliel',
          'Rabbi Akiva',
          'Rabbi Yehoshua',
        ],
        correctAnswer: 'Rabban Gamliel',
        correctAnswerIndex: 1,
        reference: {
          line: 3,
          text: 'An incident occurred where his sons returned from a banquet hall and said to him: We have not yet recited the Shema.',
        },
      },
      {
        questionNumber: 2,
        questionText:
          'What was Rabban Gamliel’s ruling to his sons when they returned after midnight?',
        options: [
          'If the column of dawn has not yet risen, you are obligated to recite it',
          'Since midnight has passed, you have missed the mitzvah',
          'Recite only the first paragraph without blessings',
          'Wait until sunrise and recite it twice',
        ],
        correctAnswer:
          'If the column of dawn has not yet risen, you are obligated to recite it',
        correctAnswerIndex: 0,
        reference: {
          line: 4,
          text: 'He said to them: If the column of dawn has not yet risen, you are obligated to recite.',
        },
      },
      {
        questionNumber: 3,
        questionText:
          'Besides Shema, which Temple service does the Mishnah mention as having a Biblical time until dawn, though the Sages said until midnight?',
        options: [
          'The lighting of the Menorah',
          'The baking of the Showbread',
          'The burning of sacrificial fats and limbs',
          'The blowing of the silver trumpets',
        ],
        correctAnswer: 'The burning of sacrificial fats and limbs',
        correctAnswerIndex: 2,
        reference: {
          line: 5,
          text: 'The burning of the fats and the limbs—their mitzvah is until the column of dawn rises.',
        },
      },
      {
        questionNumber: 4,
        questionText:
          'What is the stated purpose of the Sages setting midnight as the boundary for these mitzvot?',
        options: [
          'To honor the night watch of the Levites',
          'To distance a person from transgression',
          'To ensure people wake early for morning prayers',
          'To match the length of the daytime watches',
        ],
        correctAnswer: 'To distance a person from transgression',
        correctAnswerIndex: 1,
        reference: {
          line: 6,
          text: 'Why did the Sages say until midnight? In order to distance a person from transgression.',
        },
      },
      {
        questionNumber: 5,
        questionText:
          'How many opinions regarding the end time of the evening Shema are recorded in Mishnah Berakhot 1:1?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correctAnswer: 'Three',
        correctAnswerIndex: 1,
        reference: {
          line: 2,
          text: 'Rabbi Eliezer says until the end of the first watch; the Sages say until midnight; Rabban Gamliel says until the column of dawn rises.',
        },
      },
    ],
  },
};

const DEFAULT_REFS: Record<QuizTypeName, string> = {
  'Daf Yomi': 'Berakhot 2a',
  'Daily Rambam': 'Mishneh Torah, Foundations of the Torah 1',
  'Daily Rambam (3 Chapters)': 'Mishneh Torah, Foundations of the Torah 1-3',
  'Tanya Yomi': 'Tanya, Part I; Likkutei Amarim 1',
  'Daily Mishnah': 'Mishnah Berakhot 1:1',
  '929': 'Genesis 1',
};

const FUTURE_REFS: Record<QuizTypeName, string> = {
  'Daf Yomi': 'Berakhot 2b',
  'Daily Rambam': 'Mishneh Torah, Foundations of the Torah 2',
  'Daily Rambam (3 Chapters)': 'Mishneh Torah, Foundations of the Torah 4-6',
  'Tanya Yomi': 'Tanya, Part I; Likkutei Amarim 2',
  'Daily Mishnah': 'Mishnah Berakhot 1:2',
  '929': 'Genesis 2',
};

export function getStubQuizData(
  quizType: QuizTypeName,
  isFutureDate = false,
): StubQuizResponse {
  if (quizType === 'Daily Mishnah') {
    return {
      dafRef: isFutureDate ? FUTURE_REFS['Daily Mishnah'] : DAILY_MISHNAH_STUB.dafRef,
      quiz: DAILY_MISHNAH_STUB.quiz,
    };
  }
  return {
    dafRef: isFutureDate
      ? (FUTURE_REFS[quizType] ?? 'Berakhot 2b')
      : (DEFAULT_REFS[quizType] ?? DAF_YOMI_STUB.dafRef),
    quiz: DAF_YOMI_STUB.quiz,
  };
}
