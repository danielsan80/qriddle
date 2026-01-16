import styles from './Controls.module.css';

interface ControlsProps {
  qrText: string;
  onQrTextChange: (text: string) => void;
  seed: string;
  onGenerate: () => void;
}

export function Controls({
  qrText,
  onQrTextChange,
  seed,
  onGenerate,
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
        <input type="text" id="seed" value={seed} readOnly />
      </div>

      <button type="button" onClick={onGenerate}>
        Genera Puzzle
      </button>
    </div>
  );
}
