import type { ReactNode } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h1>QRiddle</h1>
        <p className={styles.tagline}>Put a treasure into your Greeting Card</p>
      </div>
      {children}
    </aside>
  );
}
