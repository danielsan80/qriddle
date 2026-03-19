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

const HASH_KEY = 'state';

export function readHash<T>(fallback: T): T {
  const hash = window.location.hash;
  const prefix = `#${HASH_KEY}=`;
  if (!hash.startsWith(prefix)) return fallback;
  return decode(hash.slice(prefix.length), fallback);
}

export function writeHash(state: object): void {
  window.history.replaceState(null, '', `#${HASH_KEY}=${encode(state)}`);
}
