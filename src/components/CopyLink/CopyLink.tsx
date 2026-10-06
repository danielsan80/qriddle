import { useRef, useState } from 'react';
import styles from './CopyLink.module.css';

export function CopyLink() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 5000);
  }

  return (
    <button
      type="button"
      className={copied ? `${styles.button} ${styles.copied}` : styles.button}
      onClick={handleCopy}
    >
      {copied ? 'Saved! Link copied' : 'Save'}
    </button>
  );
}
