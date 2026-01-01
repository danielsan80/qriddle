import type { ReactNode } from 'react';
import './Panel.css';

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
    <div className="panel">
      <h2>{title}</h2>
      <div className="canvas-container">
        {children}
      </div>
      <div className="stats">
        {stats.map((item, index) => (
          <div key={index} className="stats-item">
            <span className="stats-label">{item.label}:</span>{' '}
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}