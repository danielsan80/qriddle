/**
 * Script font used for the handwritten text on the card.
 *
 * Two candidates are shipped side by side so they can be compared in the real
 * tool: append `?font=pinyon` to the URL to switch. Once one wins, drop the
 * other and this resolver with it.
 */
const cardFonts = {
  corinthia: 'Corinthia',
  pinyon: 'Pinyon Script',
} as const;

type CardFontKey = keyof typeof cardFonts;

const defaultCardFont: CardFontKey = 'corinthia';

function isCardFontKey(value: string | null): value is CardFontKey {
  return value !== null && value in cardFonts;
}

export function resolveCardFont(search: string): string {
  const key = new URLSearchParams(search).get('font');

  return cardFonts[isCardFontKey(key) ? key : defaultCardFont];
}

/** Font shorthand accepted by document.fonts.load, which needs a size. */
export function cardFontDescriptor(family: string): string {
  return `1px '${family}'`;
}

export const cardFontFamily = resolveCardFont(window.location.search);
