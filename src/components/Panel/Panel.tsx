import type { ReactNode } from 'react';
import styles from './Panel.module.css';

interface PanelAction {
  icon: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface PanelProps {
  title: string;
  action?: PanelAction;
  children?: ReactNode;
}

export function Panel({ title, action, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {action && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={action.onClick}
            disabled={action.disabled}
            title={action.label}
          >
            {action.icon}
          </button>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
