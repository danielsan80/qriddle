import type { Ref } from 'react';
import styles from './QrcodeCanvas.module.css';

interface QrcodeCanvasProps {
  ref: Ref<HTMLCanvasElement>;
}

export function QrcodeCanvas({ ref }: QrcodeCanvasProps) {
  return <canvas ref={ref} className={styles.canvas} />;
}
