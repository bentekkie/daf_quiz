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

test.describe('Daf Quiz Integration Tests (Stubbed GenAI)', () => {
  test('full interactive quiz flow and screen screenshots', async ({ page }) => {
    // 1. Visiting "/" redirects to "/daf-yomi" and loads the stubbed quiz
    await page.goto('/');
    await expect(page).toHaveURL(/\/daf-yomi$/);

    await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible();
    await expect(page.getByText('Berakhot 2a').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /Print Quiz & Answer Sheet/i }),
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
    await page.getByRole('link', { name: /Print Quiz & Answer Sheet/i }).click();
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
    await page.getByRole('link', { name: /Print Quiz & Answer Sheet/i }).click();
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
});
