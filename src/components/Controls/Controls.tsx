import styles from './Controls.module.css';

interface ControlsProps {
  qrText: string;
  onQrTextChange: (text: string) => void;
  onQrTextBlur: () => void;
}

export function Controls({
  qrText,
  onQrTextChange,
  onQrTextBlur,
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
          onBlur={onQrTextBlur}
          placeholder="Inserisci testo o URL..."
        />
      </div>
    </div>
  );
}
