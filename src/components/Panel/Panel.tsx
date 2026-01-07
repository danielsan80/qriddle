import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface StatsItem {
  label: string;
  value: string;
}

interface PanelProps {
  title: string;
  stats: StatsItem[];
  children?: ReactNode;
}

export function Panel({ title, stats, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <h2>{title}</h2>
      <div className={styles.canvasContainer}>{children}</div>
      <div className={styles.stats}>
        {stats.map((item, index) => (
          <div key={index} className={styles.statsItem}>
            <span className={styles.statsLabel}>{item.label}:</span>{' '}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
