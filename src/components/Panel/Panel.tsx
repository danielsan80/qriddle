import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  showCanvas: boolean;
  children?: ReactNode;
}

export function Panel({ title, showCanvas, children }: PanelProps) {
  const containerClass = showCanvas
    ? `${styles.canvasContainer} ${styles.hasContent}`
    : styles.canvasContainer;

  return (
    <div className={styles.panel}>
      <h2>{title}</h2>
      <div className={containerClass}>{children}</div>
    </div>
  );
}
