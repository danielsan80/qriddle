import LZString from 'lz-string';

export function encode(state: object): string {
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

export function writeState(state: object): void {
  window.history.replaceState(null, '', `#${encode(state)}`);
}

export function mergeState(partial: object): void {
  const current = readState<Record<string, unknown>>({});
  writeState({ ...current, ...partial });
}
