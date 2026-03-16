import type { ReactNode } from 'react';
import styles from './CanvasStage.module.css';

interface CanvasStageProps {
  show: boolean;
  children: ReactNode;
}

export function CanvasStage({ show, children }: CanvasStageProps) {
  return (
    <div className={styles.stage}>
      <div className={show ? styles.visible : styles.hidden}>{children}</div>
    </div>
  );
}
