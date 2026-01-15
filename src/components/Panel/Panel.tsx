import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelProps {
  title: string;
  children?: ReactNode;
}

export function Panel({ title, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <h2>{title}</h2>
      <div className={styles.canvasContainer}>{children}</div>
    </div>
  );
}
