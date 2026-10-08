import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

function umamiScript() {
  const html = readFileSync('index.html', 'utf8');
  const page = new DOMParser().parseFromString(html, 'text/html');
  return page.querySelector('script[src*="umami"]');
}

describe('index.html', () => {
  it('keeps the work in the URL hash away from the analytics', () => {
    expect(umamiScript()?.getAttribute('data-exclude-hash')).toBe('true');
  });
});
