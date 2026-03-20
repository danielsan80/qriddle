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
  disabled?: boolean;
  title?: string;
  children: ReactNode;
}

function ActionButton({
  onClick,
  disabled,
  title,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={styles.actionButton}
      onClick={onClick}
      disabled={disabled}
      title={title}
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
