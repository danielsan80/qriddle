import { useEffect, useState } from 'react';
import { loadFont } from './loadFont';
import { cardFontDescriptor } from './cardFont';

export function useFontReady(): boolean {
  // Start as ready when FontFaceSet API is not available (e.g. jsdom in tests)
  const [ready, setReady] = useState(() => !document.fonts);

  useEffect(() => {
    if (!document.fonts) return;
    let cancelled = false;
    loadFont(cardFontDescriptor).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
