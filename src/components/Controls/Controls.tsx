import './Controls.css';

export function Controls() {
  return (
    <div className="controls">
      <div className="input-group">
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