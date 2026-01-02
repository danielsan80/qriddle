import styles from './Controls.module.css';

export function Controls() {
  return (
    <div className={styles.controls}>
      <div className={styles.inputGroup}>
        <label htmlFor="qrText">Testo o URL per QR Code</label>
        <input
          type="text"
          id="qrText"
          defaultValue="https://example.com"
          placeholder="Inserisci testo o URL..."
        />
      </div>

      <button type="button">Genera Puzzle</button>
    </div>
  );
}