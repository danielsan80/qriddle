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
  headerActions?: ReactNode;
  children?: ReactNode;
}

export function Panel({ title, action, headerActions, children }: PanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {headerActions}
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
