import { test, expect, type Browser, type Page } from '@playwright/test';
import { encode } from '../src/lib/browser/urlState';

type TraceEvent = { name: string };

const MOVES = 60;

async function openFrontWith(page: Page, text: string) {
  const hash = encode({
    step: 'outer.front',
    textBoxes: [{ id: '1', x: 157, y: 222, text, fontSize: 8, face: 'front' }],
  });
  await page.goto(`/#${hash}`);
  const textBox = page.getByText(text);
  await textBox.waitFor();
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await page.evaluate(() => new Promise(requestAnimationFrame));
  return textBox;
}

async function traceDrag(
  browser: Browser,
  page: Page,
  text: string,
): Promise<TraceEvent[]> {
  const textBox = await openFrontWith(page, text);
  const box = (await textBox.boundingBox())!;
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;

  await browser.startTracing(page, {
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'],
  });
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let move = 1; move <= MOVES; move++) {
    await page.mouse.move(startX + move, startY + move / 2);
  }
  await page.mouse.up();
  const trace = JSON.parse((await browser.stopTracing()).toString());
  return trace.traceEvents;
}

function count(events: TraceEvent[], name: string) {
  return events.filter((event) => event.name === name).length;
}

test('decodes the face background at most once while a text box is dragged', async ({
  browser,
  page,
}) => {
  const events = await traceDrag(browser, page, 'drag me');

  expect(count(events, 'ImageDecodeTask')).toBeLessThanOrEqual(1);
});
