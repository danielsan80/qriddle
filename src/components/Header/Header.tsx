import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <h1>QR Puzzle Generator</h1>
      <div className={styles.subtitle}>Generatore di Enigmi QR Code</div>
    </header>
  );
}