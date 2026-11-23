import fs from 'fs';
import path from 'path';
import { test, expect, type Page } from '@playwright/test';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-screenshots');

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

async function waitForFonts(page: Page) {
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });
}

function countPdfPages(pdfBuffer: Buffer): number {
  const content = pdfBuffer.toString('latin1');
  const pagesMatches = content.match(/\/Type\s*\/Page\b(?!s)/g);
  return pagesMatches ? pagesMatches.length : 0;
}

test.describe('Daf Quiz Integration Tests (Stubbed GenAI)', () => {
  test('full interactive quiz flow and screen screenshots', async ({ page }) => {
    // 1. Visiting "/" redirects to "/daf-yomi" and loads the stubbed quiz
    await page.goto('/');
    await expect(page).toHaveURL(/\/daf-yomi$/);

    await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
    await expect(page.getByText('Berakhot 2a').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Print Quiz & Answer Sheet', exact: true }),
    ).toBeVisible();

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '01-quiz-start.png'),
      fullPage: true,
    });

    // 2. Start the quiz and answer Question 1
    await page.getByRole('button', { name: 'Start Quiz' }).click();
    await expect(page.getByText('Question 1 of 5')).toBeVisible();
    await expect(
      page.getByText(/from what time may one recite the evening Shema/i),
    ).toBeVisible();

    // Select option 0 (correct)
    await page.locator('#option-0').click();
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '02-quiz-question.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: 'Next' }).click();

    // Question 2: select option 0 (incorrect; correct is 1) so results show both correct & incorrect states
    await expect(page.getByText('Question 2 of 5')).toBeVisible();
    await page.locator('#option-0').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Question 3: select option 2 (correct)
    await expect(page.getByText('Question 3 of 5')).toBeVisible();
    await page.locator('#option-2').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Question 4: select option 3 (correct)
    await expect(page.getByText('Question 4 of 5')).toBeVisible();
    await page.locator('#option-3').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Question 5: select option 0 (correct) and finish
    await expect(page.getByText('Question 5 of 5')).toBeVisible();
    await page.locator('#option-0').click();
    await page.getByRole('button', { name: 'Finish Quiz' }).click();

    // 3. Verify results screen and streak update
    await expect(page.getByText('Quiz Completed!')).toBeVisible();
    await expect(page.getByText('80%')).toBeVisible();
    await expect(
      page.getByText('You answered 4 out of 5 questions correctly.'),
    ).toBeVisible();

    // Expand Question 2 in the review accordion to show incorrect + correct answer & reference
    await page.getByRole('button', { name: 'Question 2' }).click();
    await expect(page.getByText(/Until the end of the first watch/i).first()).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-quiz-results.png'),
      fullPage: true,
    });
  });

  test('printout previews and print-media renderings', async ({
    page,
  }) => {
    await page.goto('/daf-yomi');
    await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();

    // Navigate to the print view
    await page.getByRole('link', { name: 'Print Quiz & Answer Sheet', exact: true }).click();
    await expect(page).toHaveURL(/\/daf-yomi\/print$/);

    const quizSheet = page.getByTestId('printable-quiz-sheet');
    const answerSheet = page.getByTestId('printable-answer-sheet');

    // Default mode shows both Quiz Sheet and Answer Sheet
    await expect(quizSheet).toBeVisible();
    await expect(answerSheet).toBeVisible();
    await expect(quizSheet.getByText('בס״ד')).toBeVisible();
    await expect(quizSheet.getByText('Berakhot 2a', { exact: true })).toBeVisible();
    await expect(page.getByTestId('quick-answer-key')).toBeVisible();

    // Preview Quiz Sheet Only (screen view)
    await page.getByRole('button', { name: 'Quiz Only' }).click();
    await expect(quizSheet).toBeVisible();
    await expect(answerSheet).toHaveCount(0);

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '04-print-preview-quiz.png'),
      fullPage: true,
    });

    // Preview Answer Sheet Only (screen view)
    await page.getByRole('button', { name: 'Answer Sheet' }).click();
    await expect(answerSheet).toBeVisible();
    await expect(quizSheet).toHaveCount(0);

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '05-print-preview-answers.png'),
      fullPage: true,
    });

    // Printout rendering (print media at US Letter proportions: 8.5in x 11in @ 96dpi)
    await page.setViewportSize({ width: 816, height: 1056 });

    // Quiz Sheet printout
    await page.getByRole('button', { name: 'Quiz Only' }).click();
    await expect(quizSheet).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await expect(
      page.getByRole('button', { name: /Print \/ Save PDF/i }),
    ).toBeHidden();
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '06-printout-quiz.png'),
      fullPage: true,
    });
    const quizPdf = await page.pdf({
      format: 'Letter',
      preferCSSPageSize: true,
      printBackground: true,
    });
    expect(countPdfPages(quizPdf)).toBe(1);

    // Answer Sheet printout
    await page.emulateMedia({ media: 'screen' });
    await page.getByRole('button', { name: 'Answer Sheet' }).click();
    await expect(answerSheet).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await expect(
      page.getByRole('button', { name: /Print \/ Save PDF/i }),
    ).toBeHidden();
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '07-printout-answers.png'),
      fullPage: true,
    });
    const answersPdf = await page.pdf({
      format: 'Letter',
      preferCSSPageSize: true,
      printBackground: true,
    });
    expect(countPdfPages(answersPdf)).toBe(1);

    // Both Quiz & Answer Sheet should be exactly 2 Letter pages (1 quiz + 1 answers)
    await page.emulateMedia({ media: 'screen' });
    await page.getByRole('button', { name: 'Quiz & Answers' }).click();
    await expect(quizSheet).toBeVisible();
    await expect(answerSheet).toBeVisible();
    await page.emulateMedia({ media: 'print' });
    await waitForFonts(page);
    const bothPdf = await page.pdf({
      format: 'Letter',
      preferCSSPageSize: true,
      printBackground: true,
    });
    expect(countPdfPages(bothPdf)).toBe(2);

    // Reset media
    await page.emulateMedia({ media: 'screen' });
  });

  test('switching quiz types loads stubbed data and captures Daily Mishnah screenshots', async ({
    page,
  }) => {
    await page.goto('/daf-yomi');
    await expect(page.getByText('Berakhot 2a').first()).toBeVisible();

    await page.getByText('Daf Yomi', { exact: true }).first().click();
    await page.getByRole('menuitemradio', { name: 'Daily Mishnah' }).click();

    await expect(page).toHaveURL(/\/daily-mishnah$/);
    await expect(page.getByText('Mishnah Berakhot 1:1').first()).toBeVisible();

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '08-daily-mishnah-start.png'),
      fullPage: true,
    });

    // Verify printout titles update for Daily Mishnah and capture printout screenshot
    await page.getByRole('link', { name: 'Print Quiz & Answer Sheet', exact: true }).click();
    await expect(page).toHaveURL(/\/daily-mishnah\/print$/);

    const quizSheet = page.getByTestId('printable-quiz-sheet');
    const answerSheet = page.getByTestId('printable-answer-sheet');
    await expect(quizSheet.getByRole('heading', { name: 'Daily Mishnah Quiz' })).toBeVisible();
    await expect(quizSheet.getByText(/מִשְׁנָה יוֹמִית/)).toBeVisible();
    await expect(quizSheet.getByText('Mishnah Berakhot 1:1', { exact: true })).toBeVisible();
    await expect(
      answerSheet.getByRole('heading', { name: 'Daily Mishnah — Mishnah Berakhot 1:1' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Quiz Only' }).click();
    await page.setViewportSize({ width: 816, height: 1056 });
    await page.emulateMedia({ media: 'print' });
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '09-daily-mishnah-printout.png'),
      fullPage: true,
    });
    await page.emulateMedia({ media: 'screen' });
  });

  test('can discover and generate a printout for a future day (Shabbat)', async ({ page }) => {
    // 1. Discover via the Shabbat shortcut link on the main quiz card
    await page.goto('/daf-yomi');
    const shabbatLink = page.getByRole('link', { name: /Shabbat/i });
    await expect(shabbatLink).toBeVisible();
    await shabbatLink.click();

    await expect(page).toHaveURL(/\/daf-yomi\/print\?date=\d{4}-\d{2}-\d{2}$/);
    const quizSheet = page.getByTestId('printable-quiz-sheet');
    await expect(quizSheet.getByText('Berakhot 2b', { exact: true })).toBeVisible();
    await expect(quizSheet.getByText(/Shabbat •/i)).toBeVisible();

    // 2. Also verify the "For Shabbat" quick-select button on the Print toolbar
    await page.goto('/daf-yomi/print');
    await expect(quizSheet.getByText('Berakhot 2a', { exact: true })).toBeVisible();

    const forShabbatButton = page.getByRole('button', { name: 'For Shabbat' });
    await expect(forShabbatButton).toBeVisible();
    await forShabbatButton.click();

    await expect(quizSheet.getByText('Berakhot 2b', { exact: true })).toBeVisible();
    await expect(quizSheet.getByText(/Shabbat •/i)).toBeVisible();
    await expect(forShabbatButton).toBeHidden();
  });

  test('language toggle switches site to Hebrew RTL and captures Hebrew screenshots', async ({
    page,
  }) => {
    await page.goto('/daf-yomi');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();

    // Toggle to Hebrew
    await page.getByRole('button', { name: /Switch language to Hebrew/i }).click();

    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'he');
    await expect(page.getByText('ברכות ב׳ ע״א').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'התחל חידון' })).toBeVisible();

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '10-hebrew-quiz-start.png'),
      fullPage: true,
    });

    // Start Hebrew quiz and capture question screen
    await page.getByRole('button', { name: 'התחל חידון' }).click();
    await expect(page.getByText('שאלה 1 מתוך 5')).toBeVisible();
    await page.locator('#option-0').click();

    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '11-hebrew-quiz-question.png'),
      fullPage: true,
    });

    // Navigate to Print page and verify Hebrew RTL persists
    await page.goto('/daf-yomi/print');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    const quizSheet = page.getByTestId('printable-quiz-sheet');
    const answerSheet = page.getByTestId('printable-answer-sheet');
    await expect(quizSheet).toHaveAttribute('dir', 'rtl');
    await expect(quizSheet.getByRole('heading', { name: 'חידון דף יומי' })).toBeVisible();
    await expect(quizSheet.getByText('ברכות ב׳ ע״א', { exact: true })).toBeVisible();

    // Capture Hebrew Quiz Sheet printout
    await page.getByRole('button', { name: 'חידון בלבד' }).click();
    await page.setViewportSize({ width: 816, height: 1056 });
    await page.emulateMedia({ media: 'print' });
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '12-hebrew-printout-quiz.png'),
      fullPage: true,
    });

    // Capture Hebrew Answer Sheet printout
    await page.emulateMedia({ media: 'screen' });
    await page.getByRole('button', { name: 'דף תשובות' }).click();
    await expect(answerSheet).toHaveAttribute('dir', 'rtl');
    await page.emulateMedia({ media: 'print' });
    await waitForFonts(page);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '13-hebrew-printout-answers.png'),
      fullPage: true,
    });

    // Toggle back to English and verify LTR is restored
    await page.emulateMedia({ media: 'screen' });
    await page.getByRole('button', { name: /החלפת שפה לאנגלית/i }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('long verbose quiz and answer sheets dynamically scale font to fit 1 Letter page each', async ({
    page,
  }) => {
    const longQuestions = Array.from({ length: 5 }, (_, idx) => ({
      questionNumber: idx + 1,
      questionText: `Question ${idx + 1}: According to the detailed discussion in the Gemara regarding the dispute between Rabbi Yehuda and the Rabbis about entering a courtyard and preparing an eruv before Shabbat, what is the exact legal principle derived from the Mishnah?`,
      options: [
        'Because the Mishnah explicitly states that any vessel set aside for a forbidden labor may still be moved for the sake of its place or its body during Shabbat',
        'Because the Sages enacted a Rabbinic decree in order to prevent people from inadvertently carrying items across a public domain boundary on Shabbat',
        'Because Rabbi Yehuda holds that only items designated specifically before twilight on Friday afternoon retain their permitted status throughout the entire day',
        'Because the principle of muktzeh applies equally to both utensils used for permitted tasks and those reserved exclusively for crafts prohibited on Shabbat',
      ],
      correctAnswer:
        'Because the Sages enacted a Rabbinic decree in order to prevent people from inadvertently carrying items across a public domain boundary on Shabbat',
      correctAnswerIndex: 1,
      reference: {
        side: 'A' as const,
        line: idx + 4,
        text: 'The Gemara explains at length: Why did the Sages establish this boundary in the Mishnah? In order to distance a person from transgression and ensure that no one mistakenly carries from a private domain into a public domain on Shabbat or festival days.',
      },
    }));

    await page.route('**/api/daf-yomi*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'Daf Yomi',
          dafRef: 'Arakhin 7a',
          sefariaRef: 'Arakhin 7a',
          quiz: { questions: longQuestions },
        }),
      });
    });

    await page.goto('/daf-yomi/print');
    const quizSheet = page.getByTestId('printable-quiz-sheet');
    const answerSheet = page.getByTestId('printable-answer-sheet');
    await expect(quizSheet).toBeVisible();
    await expect(answerSheet).toBeVisible();
    await waitForFonts(page);

    // Verify dynamic font scaling reduced the base font size below the 15.5px default
    const quizFontPx = Number(await quizSheet.getAttribute('data-font-px'));
    const answerFontPx = Number(await answerSheet.getAttribute('data-font-px'));
    expect(quizFontPx).toBeLessThan(15.5);
    expect(answerFontPx).toBeLessThan(15.5);

    // Verify real Letter PDF fits on exactly 2 pages (1 quiz + 1 answer sheet)
    await page.emulateMedia({ media: 'print' });
    await waitForFonts(page);
    const pdf = await page.pdf({
      format: 'Letter',
      preferCSSPageSize: true,
      printBackground: true,
    });
    expect(countPdfPages(pdf)).toBe(2);
    await page.emulateMedia({ media: 'screen' });
  });
});
