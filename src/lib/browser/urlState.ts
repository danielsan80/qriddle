import LZString from 'lz-string';

export type UrlState = Record<string, unknown>;

export function encode(state: UrlState): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(state));
}

export function decode<T>(str: string, fallback: T): T {
  if (!str) return fallback;
  try {
    const json = LZString.decompressFromEncodedURIComponent(str);
    if (!json) return fallback;
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function readState<T>(fallback: T): T {
  const hash = window.location.hash;
  if (!hash || hash === '#') return fallback;
  return decode(hash.slice(1), fallback);
}

function writeState(state: UrlState): void {
  window.history.replaceState(null, '', `#${encode(state)}`);
}

export function mergeState(partial: UrlState): void {
  const current = readState<UrlState>({});
  writeState({ ...current, ...partial });
}
