import { useState } from 'react';
import styles from './MobileBlock.module.css';

export function MobileBlock() {
  const [copied, setCopied] = useState(false);

  const isMobile = navigator.maxTouchPoints > 0;

  if (!isMobile) return null;

  const url = window.location.href;

  async function handleShare() {
    await navigator.share({ url, title: 'QRiddle' });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <h1 className={styles.title}>QRiddle</h1>
        <p className={styles.message}>
          This service works on desktop only.
          <br />
          Send yourself the link to open it on your computer.
        </p>
        <div className={styles.actions}>
          {navigator.share != null && (
            <button className={styles.primary} onClick={handleShare}>
              Share the link
            </button>
          )}
          <button className={styles.secondary} onClick={handleCopy}>
            {copied ? 'Link copied!' : 'Copy the link'}
          </button>
        </div>
      </div>
    </div>
  );
}
