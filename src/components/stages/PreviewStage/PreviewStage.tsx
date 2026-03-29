import type { ReactNode } from 'react';
import styles from './PreviewStage.module.css';

interface PreviewStageProps {
  children: ReactNode;
}

export function PreviewStage({ children }: PreviewStageProps) {
  return <div className={styles.stage}>{children}</div>;
}
