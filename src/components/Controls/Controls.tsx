import styles from './Controls.module.css';

interface ControlsProps {
  qrText: string;
  onQrTextChange: (text: string) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
  onSeedRegenerate: () => void;
}

export function Controls({
  qrText,
  onQrTextChange,
  seed,
  onSeedChange,
  onSeedRegenerate,
}: ControlsProps) {
  return (
    <div className={styles.controls}>
      <div className={styles.inputGroup}>
        <label htmlFor="qrText">Testo o URL per QR Code</label>
        <input
          type="text"
          id="qrText"
          value={qrText}
          onChange={(e) => onQrTextChange(e.target.value)}
          placeholder="Inserisci testo o URL..."
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="seed">Seed</label>
        <div className={styles.seedInput}>
          <input
            type="text"
            id="seed"
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
          />
          <button type="button" onClick={onSeedRegenerate}>
            ↻
          </button>
        </div>
      </div>
    </div>
  );
}
