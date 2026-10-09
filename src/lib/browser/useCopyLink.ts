import { useRef, useState } from 'react';
import { config } from '../config';

export function useCopyLink() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(
      () => setCopied(false),
      config.linkCopiedConfirmationMs,
    );
  }

  return { copied, copy };
}
