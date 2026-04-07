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

export type HistoryMode = 'push' | 'replace';

export function writeState(state: UrlState, mode: HistoryMode): void {
  const url = `#${encode(state)}`;
  switch (mode) {
    case 'push':
      window.history.pushState(null, '', url);
      break;
    case 'replace':
      window.history.replaceState(null, '', url);
      break;
    default:
      throw new Error(`Unexpected HistoryMode: ${mode satisfies never}`);
  }
}

export function mergeState(partial: UrlState, mode: HistoryMode): void {
  const current = readState<UrlState>({});
  writeState({ ...current, ...partial }, mode);
}
