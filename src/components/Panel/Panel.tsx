import type { ReactNode } from 'react';
import styles from './Panel.module.css';

type PanelType = 'qrcode' | 'puzzle';

interface PanelProps {
  title: string;
  type: PanelType;
  showCanvas: boolean;
  children?: ReactNode;
}

export function Panel({ title, type, showCanvas, children }: PanelProps) {
  const classes = [styles.canvasContainer, styles[type]];
  if (showCanvas) classes.push(styles.hasContent);
  const containerClass = classes.join(' ');

  return (
    <div className={styles.panel}>
      <h2>{title}</h2>
      <div className={containerClass}>{children}</div>
    </div>
  );
}
