import type { QuizData, QuizTypeName } from '@/lib/types';
import type { Language } from '@/lib/i18n';

export interface StubQuizResponse {
  dafRef: string;
  sefariaRef: string;
  quiz: QuizData;
}

const DAF_YOMI_STUB_QUIZ: QuizData = {
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
};

const DAF_YOMI_HE_STUB_QUIZ: QuizData = {
  questions: [
    {
      questionNumber: 1,
      questionText:
        'לפי המשנה בברכות ב׳ ע״א, מאימתי קורין את שמע בערבין?',
      options: [
        'משעה שהכהנים נכנסים לאכול בתרומתן',
        'מרגע שקיעת החמה ללא קשר לצאת הכוכבים',
        'מתחילת האשמורה השנייה של הלילה',
        'רק לאחר תפילת ערבית',
      ],
      correctAnswer: 'משעה שהכהנים נכנסים לאכול בתרומתן',
      correctAnswerIndex: 0,
      reference: {
        side: 'A',
        line: 1,
        text: 'מֵאֵימָתַי קוֹרִין אֶת שְׁמַע בְּעַרְבִין? מִשָּׁעָה שֶׁהַכֹּהֲנִים נִכְנָסִים לֶאֱכוֹל בִּתְרוּמָתָן.',
      },
    },
    {
      questionNumber: 2,
      questionText: 'עד מתי סובר רבי אליעזר שניתן לקרוא קריאת שמע של ערבית?',
      options: [
        'עד חצות הלילה',
        'עד סוף האשמורה הראשונה',
        'עד שיעלה עמוד השחר',
        'עד הנץ החמה',
      ],
      correctAnswer: 'עד סוף האשמורה הראשונה',
      correctAnswerIndex: 1,
      reference: {
        side: 'A',
        line: 2,
        text: 'עַד סוֹף הָאַשְׁמוּרָה הָרִאשׁוֹנָה, דִּבְרֵי רַבִּי אֱלִיעֶזֶר.',
      },
    },
    {
      questionNumber: 3,
      questionText: 'עד מתי אומרים חכמים שניתן לקרוא קריאת שמע בערבין?',
      options: [
        'עד סוף האשמורה הראשונה',
        'עד סוף האשמורה השנייה',
        'עד חצות',
        'עד עמוד השחר ללא כל סייג',
      ],
      correctAnswer: 'עד חצות',
      correctAnswerIndex: 2,
      reference: {
        side: 'A',
        line: 2,
        text: 'וַחֲכָמִים אוֹמְרִים עַד חֲצוֹת. רַבָּן גַּמְלִיאֵל אוֹמֵר עַד שֶׁיַּעֲלֶה עַמּוּד הַשַּׁחַר.',
      },
    },
    {
      questionNumber: 4,
      questionText:
        'מדוע אמרו חכמים "עד חצות", אף על פי שמדין תורה זמנה עד שיעלה עמוד השחר?',
      options: [
        'מפני שהתורה אוסרת קריאת שמע לאחר חצות',
        'מפני שהכהנים אינם רשאים לאכול תרומה לאחר חצות',
        'כדי להשוות את זמנה לזמן קרבן התמיד',
        'כדי להרחיק את האדם מן העבירה',
      ],
      correctAnswer: 'כדי להרחיק את האדם מן העבירה',
      correctAnswerIndex: 3,
      reference: {
        side: 'A',
        line: 5,
        text: 'אִם כֵּן לָמָּה אָמְרוּ חֲכָמִים עַד חֲצוֹת? כְּדֵי לְהַרְחִיק אֶת הָאָדָם מִן הָעֲבֵירָה.',
      },
    },
    {
      questionNumber: 5,
      questionText: 'מה שואלת הגמרא מיד על פתיחת המשנה?',
      options: [
        'תנא אהיכא קאי דקתני "מאימתי", ומדוע פתח בקריאת שמע של ערבית תחילה',
        'האם נשים חייבות בקריאת שמע של ערבית',
        'כמה ברכות יש לברך לפני קריאת שמע',
        'באיזו לשון מותר לקרוא קריאת שמע',
      ],
      correctAnswer:
        'תנא אהיכא קאי דקתני "מאימתי", ומדוע פתח בקריאת שמע של ערבית תחילה',
      correctAnswerIndex: 0,
      reference: {
        side: 'A',
        line: 7,
        text: 'תַּנָּא אַהֵיכָא קָאֵי דְּקָתָנֵי מֵאֵימָתַי? וְתוּ, מַאי שְׁנָא דְּתָנֵי בְּעַרְבִין בְּרֵישָׁא?',
      },
    },
  ],
};

const DAILY_MISHNAH_STUB_QUIZ: QuizData = {
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
};

const DAILY_MISHNAH_HE_STUB_QUIZ: QuizData = {
  questions: [
    {
      questionNumber: 1,
      questionText:
        'במשנה ברכות א׳:א׳, בניו של מי באו מבית המשתה לאחר חצות ושאלו האם עדיין מותר לקרוא שמע?',
      options: ['רבי אליעזר', 'רבן גמליאל', 'רבי עקיבא', 'רבי יהושע'],
      correctAnswer: 'רבן גמליאל',
      correctAnswerIndex: 1,
      reference: {
        line: 3,
        text: 'מַעֲשֶׂה וּבָאוּ בָנָיו מִבֵּית הַמִּשְׁתֶּה, אָמְרוּ לוֹ לֹא קָרִינוּ אֶת שְׁמַע.',
      },
    },
    {
      questionNumber: 2,
      questionText: 'מה השיב רבן גמליאל לבניו כאשר שבו מבית המשתה?',
      options: [
        'אם לא עלה עמוד השחר חייבין אתם לקרות',
        'כיוון שעבר חצות הפסדתם את המצווה',
        'קראו רק את הפרשה הראשונה ללא ברכות',
        'המתינו לזריחה וקראו פעמיים',
      ],
      correctAnswer: 'אם לא עלה עמוד השחר חייבין אתם לקרות',
      correctAnswerIndex: 0,
      reference: {
        line: 4,
        text: 'אָמַר לָהֶם, אִם לֹא עָלָה עַמּוּד הַשַּׁחַר, חַיָּבִין אַתֶּם לִקְרוֹת.',
      },
    },
    {
      questionNumber: 3,
      questionText:
        'מלבד קריאת שמע, איזו עבודה בבית המקדש מזכירה המשנה שמצוותה עד שיעלה עמוד השחר?',
      options: [
        'הדלקת המנורה',
        'אפיית לחם הפנים',
        'הקטר חלבים ואברים',
        'תקיעה בחצוצרות הכסף',
      ],
      correctAnswer: 'הקטר חלבים ואברים',
      correctAnswerIndex: 2,
      reference: {
        line: 5,
        text: 'הֶקְטֵר חֲלָבִים וְאֵבָרִים, מִצְוָתָן עַד שֶׁיַּעֲלֶה עַמּוּד הַשַּׁחַר.',
      },
    },
    {
      questionNumber: 4,
      questionText: 'מהי הסיבה שמביאה המשנה לכך שחכמים הגבילו את הזמן עד חצות?',
      options: [
        'לכבוד משמרת הלויים בלילה',
        'כדי להרחיק את האדם מן העבירה',
        'כדי שאנשים ישכימו לתפילת שחרית',
        'כדי להתאים לאורך משמרות היום',
      ],
      correctAnswer: 'כדי להרחיק את האדם מן העבירה',
      correctAnswerIndex: 1,
      reference: {
        line: 6,
        text: 'לָמָּה אָמְרוּ חֲכָמִים עַד חֲצוֹת? כְּדֵי לְהַרְחִיק אֶת הָאָדָם מִן הָעֲבֵירָה.',
      },
    },
    {
      questionNumber: 5,
      questionText: 'כמה דעות לגבי סוף זמן קריאת שמע של ערבית מובאות במשנה ברכות א׳:א׳?',
      options: ['שתיים', 'שלוש', 'ארבע', 'חמש'],
      correctAnswer: 'שלוש',
      correctAnswerIndex: 1,
      reference: {
        line: 2,
        text: 'עַד סוֹף הָאַשְׁמוּרָה הָרִאשׁוֹנָה דִּבְרֵי רַבִּי אֱלִיעֶזֶר, וַחֲכָמִים אוֹמְרִים עַד חֲצוֹת, רַבָּן גַּמְלִיאֵל אוֹמֵר עַד שֶׁיַּעֲלֶה עַמּוּד הַשַּׁחַר.',
      },
    },
  ],
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

const DEFAULT_HE_REFS: Record<QuizTypeName, string> = {
  'Daf Yomi': 'ברכות ב׳ ע״א',
  'Daily Rambam': 'משנה תורה, הלכות יסודי התורה א׳',
  'Daily Rambam (3 Chapters)': 'משנה תורה, הלכות יסודי התורה א׳–ג׳',
  'Tanya Yomi': 'תניא, ליקוטי אמרים פרק א׳',
  'Daily Mishnah': 'משנה ברכות א׳:א׳',
  '929': 'בראשית א׳',
};

const FUTURE_HE_REFS: Record<QuizTypeName, string> = {
  'Daf Yomi': 'ברכות ב׳ ע״ב',
  'Daily Rambam': 'משנה תורה, הלכות יסודי התורה ב׳',
  'Daily Rambam (3 Chapters)': 'משנה תורה, הלכות יסודי התורה ד׳–ו׳',
  'Tanya Yomi': 'תניא, ליקוטי אמרים פרק ב׳',
  'Daily Mishnah': 'משנה ברכות א׳:ב׳',
  '929': 'בראשית ב׳',
};

export function getStubQuizData(
  quizType: QuizTypeName,
  isFutureDate = false,
  lang: Language = 'en',
): StubQuizResponse {
  const sefariaRef = isFutureDate
    ? (FUTURE_REFS[quizType] ?? 'Berakhot 2b')
    : (DEFAULT_REFS[quizType] ?? 'Berakhot 2a');

  const dafRef =
    lang === 'he'
      ? isFutureDate
        ? (FUTURE_HE_REFS[quizType] ?? 'ברכות ב׳ ע״ב')
        : (DEFAULT_HE_REFS[quizType] ?? 'ברכות ב׳ ע״א')
      : sefariaRef;

  if (quizType === 'Daily Mishnah') {
    return {
      dafRef,
      sefariaRef,
      quiz: lang === 'he' ? DAILY_MISHNAH_HE_STUB_QUIZ : DAILY_MISHNAH_STUB_QUIZ,
    };
  }

  return {
    dafRef,
    sefariaRef,
    quiz: lang === 'he' ? DAF_YOMI_HE_STUB_QUIZ : DAF_YOMI_STUB_QUIZ,
  };
}
