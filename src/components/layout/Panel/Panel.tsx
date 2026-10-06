import type { ReactNode } from 'react';
import styles from './Panel.module.css';

function Title({ children }: { children: ReactNode }) {
  return <h2 className={styles.title}>{children}</h2>;
}

function Actions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

function Body({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  children: ReactNode;
}

function ActionButton({ onClick, label, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={styles.actionButton}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export function Panel({ children }: { children: ReactNode }) {
  return <div className={styles.panel}>{children}</div>;
}

Panel.Title = Title;
Panel.Actions = Actions;
Panel.Body = Body;
Panel.ActionButton = ActionButton;
