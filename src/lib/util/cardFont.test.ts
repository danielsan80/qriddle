import { describe, it, expect } from 'vitest';
import { resolveCardFont, cardFontDescriptor } from './cardFont';

describe('resolveCardFont', () => {
  it('maps the font query param to a family name, falling back to the default', () => {
    const searches = [
      '',
      '?font=corinthia',
      '?font=pinyon',
      '?font=unknown',
      '?other=1',
      '?font=',
    ];

    expect(searches.map(resolveCardFont)).toEqual([
      'Corinthia',
      'Corinthia',
      'Pinyon Script',
      'Corinthia',
      'Corinthia',
      'Corinthia',
    ]);
  });
});

describe('cardFontDescriptor', () => {
  it('quotes the family name for document.fonts.load', () => {
    expect(cardFontDescriptor('Pinyon Script')).toBe(`1px 'Pinyon Script'`);
  });
});
