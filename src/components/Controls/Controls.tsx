import styles from './Controls.module.css';

interface ControlsProps {
  qrText: string;
  onQrTextChange: (text: string) => void;
  onGenerate: () => void;
}

export function Controls({
  qrText,
  onQrTextChange,
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

      <button type="button" onClick={onGenerate}>
        Genera Puzzle
      </button>
    </div>
  );
}
