import { test, expect } from '@playwright/test';
import { stat } from 'node:fs/promises';
import { encode } from '../src/lib/browser/urlState';

const MAX_PDF_BYTES = 2 * 1024 * 1024;

test('downloads a PDF of at most 2 MB', async ({ page }, testInfo) => {
  const hash = encode({
    step: 'download',
    qrText: 'https://maps.app.goo.gl/AbCdEfGhIjKlMnOp9',
    seed: 'fitness',
    textBoxes: [
      {
        id: '1',
        x: 157,
        y: 222,
        text: 'Happy birthday',
        fontSize: 8,
        face: 'front',
      },
    ],
  });
  await page.goto(`/#${hash}`);

  const downloadEvent = page.waitForEvent('download', { timeout: 60_000 });
  await page.getByRole('button', { name: 'Download the PDF' }).click();
  const download = await downloadEvent;
  const path = testInfo.outputPath('puzzle.pdf');
  await download.saveAs(path);

  const { size } = await stat(path);
  expect(size).toBeLessThanOrEqual(MAX_PDF_BYTES);
});
