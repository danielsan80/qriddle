import type { Ref } from 'react';
import styles from './PreviewCanvas.module.css';

interface PreviewCanvasProps {
  ref: Ref<HTMLCanvasElement>;
}

export function PreviewCanvas({ ref }: PreviewCanvasProps) {
  return <canvas ref={ref} className={styles.canvas} />;
}
